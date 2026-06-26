"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * The recorder phase machine:
 *  idle      → overlay closed, nothing acquired
 *  preview   → options panel open, live camera preview running
 *  countdown → 3-2-1 before capture; screen/mic/canvas already wired
 *  recording → MediaRecorder running
 *  paused    → MediaRecorder paused (timer frozen)
 *  review    → stopped; the composited blob is ready to preview/download
 */
export type RecorderPhase =
  | "idle"
  | "preview"
  | "countdown"
  | "recording"
  | "paused"
  | "review";

/** Public surface the provider exposes through `RecorderContext`. */
export interface RecorderEngine {
  phase: RecorderPhase;
  isOpen: boolean;

  open: () => void;
  close: () => void;

  cameraOn: boolean;
  micOn: boolean;
  setCameraOn: (on: boolean) => void;
  setMicOn: (on: boolean) => void;

  /** Live camera stream for the preview bubble (null when off/denied). */
  cameraStream: MediaStream | null;
  /** True when camera acquisition was denied/failed. */
  cameraError: boolean;

  startRecording: () => void;
  stopRecording: () => void;
  cancelRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  restartRecording: () => void;
  cancelCountdown: () => void;

  /** Elapsed recorded seconds (excludes paused time). */
  elapsedSec: number;
  /** Current 3-2-1 value during the countdown. */
  countdownValue: number;
  /** Object URL of the finished recording (review phase), else null. */
  recordedUrl: string | null;
  /** MIME type of the finished recording, for choosing a download extension. */
  recordedType: string | null;
  /** User-facing error (e.g. screen-share declined). */
  errorMessage: string | null;
}

const CAMERA_CONSTRAINTS: MediaStreamConstraints = {
  video: { width: { ideal: 1280 }, height: { ideal: 720 } },
};
const MIC_CONSTRAINTS: MediaStreamConstraints = { audio: true };

// Composite output is capped at 1080p / 30fps; the webcam bubble is a circle
// pinned bottom-left, sized relative to the canvas height.
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;
const FPS = 30;
const COUNTDOWN_FROM = 3;
const BUBBLE_DIAMETER_RATIO = 0.26;
const BUBBLE_MARGIN_RATIO = 0.03;

/** Best WebM profile this browser can record, VP9 → VP8 → bare WebM. */
function pickMimeType(): string | undefined {
  if (typeof MediaRecorder === "undefined") return undefined;
  const candidates = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
  ];
  return candidates.find((c) => MediaRecorder.isTypeSupported(c));
}

/** Cap (w,h) within MAX_WIDTH×MAX_HEIGHT, preserving aspect ratio. */
function fitCanvasSize(
  w: number,
  h: number,
): { width: number; height: number } {
  const safeW = w > 0 ? w : 1280;
  const safeH = h > 0 ? h : 720;
  const scale = Math.min(1, MAX_WIDTH / safeW, MAX_HEIGHT / safeH);
  return {
    width: Math.round(safeW * scale),
    height: Math.round(safeH * scale),
  };
}

/**
 * Create an off-DOM <video> playing `stream`, resolved once it has dimensions.
 * Rejects (instead of hanging forever) if the track ends or errors before
 * metadata arrives, or after a timeout — e.g. the user hits "Stop sharing" in
 * the gap between getDisplayMedia resolving and the first frame.
 */
async function makeOffscreenVideo(
  stream: MediaStream,
): Promise<HTMLVideoElement> {
  const video = document.createElement("video");
  video.muted = true;
  video.playsInline = true;
  video.srcObject = stream;
  if (video.readyState < 1) {
    await new Promise<void>((resolve, reject) => {
      const cleanup = () => {
        window.clearTimeout(timer);
        video.removeEventListener("loadedmetadata", onLoaded);
        video.removeEventListener("error", onError);
        track?.removeEventListener("ended", onError);
      };
      const onLoaded = () => {
        cleanup();
        resolve();
      };
      const onError = () => {
        cleanup();
        reject(new Error("video source ended before metadata loaded"));
      };
      const track = stream.getVideoTracks()[0];
      const timer = window.setTimeout(onError, 5000);
      video.addEventListener("loadedmetadata", onLoaded, { once: true });
      video.addEventListener("error", onError, { once: true });
      track?.addEventListener("ended", onError, { once: true });
    });
  }
  await video.play().catch(() => undefined);
  return video;
}

export function useRecorderEngine(): RecorderEngine {
  const [phase, setPhaseState] = useState<RecorderPhase>("idle");
  const [cameraOn, setCameraOnState] = useState(true);
  const [micOn, setMicOnState] = useState(true);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [countdownValue, setCountdownValue] = useState(0);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [recordedType, setRecordedType] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Mirrors of render state read inside async callbacks / the draw loop, so they
  // never see a stale closure value.
  const phaseRef = useRef<RecorderPhase>("idle");
  const cameraOnRef = useRef(true);
  const micOnRef = useRef(true);

  // Media resources (imperative; kept out of render state).
  const screenStreamRef = useRef<MediaStream | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const screenVideoRef = useRef<HTMLVideoElement | null>(null);
  const cameraVideoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mixedStreamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordedUrlRef = useRef<string | null>(null);
  const screenTrackEndedRef = useRef<(() => void) | null>(null);

  // Loop / timer handles.
  const rafRef = useRef<number | null>(null);
  const drawIntervalRef = useRef<number | null>(null);
  const visibilityHandlerRef = useRef<(() => void) | null>(null);
  const countdownTimerRef = useRef<number | null>(null);
  const elapsedTimerRef = useRef<number | null>(null);
  const elapsedBaseMsRef = useRef(0);
  const segmentStartRef = useRef(0);

  // Guards for the async start path: `startingRef` blocks re-entrant Start
  // clicks; `runIdRef` is a generation token bumped by reset() so an in-flight
  // start that resolves after the user closed (or closed-then-reopened) the
  // recorder can detect it's stale and abort instead of resurrecting capture.
  const startingRef = useRef(false);
  const runIdRef = useRef(0);
  // False once the provider unmounts, so post-await work can bail.
  const mountedRef = useRef(true);
  // Blocks a second camera acquisition while one is already in flight, so two
  // concurrent acquireCamera() calls can't each grab a stream and leak one.
  const cameraAcquiringRef = useRef(false);

  const goPhase = useCallback((next: RecorderPhase) => {
    phaseRef.current = next;
    setPhaseState(next);
  }, []);

  // ---- low-level teardown helpers (all idempotent) -----------------------

  const stopStream = useCallback((stream: MediaStream | null) => {
    stream?.getTracks().forEach((t) => t.stop());
  }, []);

  const stopDrawLoop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (drawIntervalRef.current !== null) {
      window.clearInterval(drawIntervalRef.current);
      drawIntervalRef.current = null;
    }
    if (visibilityHandlerRef.current) {
      document.removeEventListener(
        "visibilitychange",
        visibilityHandlerRef.current,
      );
      visibilityHandlerRef.current = null;
    }
  }, []);

  const stopCamera = useCallback(() => {
    stopStream(cameraStreamRef.current);
    cameraStreamRef.current = null;
    cameraVideoRef.current = null;
    setCameraStream(null);
  }, [stopStream]);

  const closeAudio = useCallback(() => {
    if (audioCtxRef.current) {
      void audioCtxRef.current.close().catch(() => undefined);
      audioCtxRef.current = null;
    }
  }, []);

  const detachScreenEnded = useCallback(() => {
    const track = screenStreamRef.current?.getVideoTracks()[0];
    if (track && screenTrackEndedRef.current) {
      track.removeEventListener("ended", screenTrackEndedRef.current);
    }
    screenTrackEndedRef.current = null;
  }, []);

  /** Tear down screen + canvas + audio capture, leaving camera preview intact. */
  const teardownCapture = useCallback(() => {
    stopDrawLoop();
    detachScreenEnded();
    stopStream(screenStreamRef.current);
    screenStreamRef.current = null;
    screenVideoRef.current = null;
    stopStream(micStreamRef.current);
    micStreamRef.current = null;
    closeAudio();
    // The canvas-capture video track and the Web-Audio destination tracks live
    // ONLY in `mixed` — they are distinct from the screen/mic source tracks and
    // are not stopped by closeAudio(), so stop them explicitly or they leak.
    stopStream(mixedStreamRef.current);
    mixedStreamRef.current = null;
    canvasRef.current = null;
  }, [stopDrawLoop, detachScreenEnded, stopStream, closeAudio]);

  /** Detach the active recorder without firing its review handler (discard). */
  const discardRecorder = useCallback(() => {
    const recorder = recorderRef.current;
    if (recorder) {
      recorder.ondataavailable = null;
      recorder.onstop = null;
      if (recorder.state !== "inactive") recorder.stop();
    }
    recorderRef.current = null;
    chunksRef.current = [];
  }, []);

  const clearCountdownTimer = useCallback(() => {
    if (countdownTimerRef.current !== null) {
      window.clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
  }, []);

  const clearElapsedTimer = useCallback(() => {
    if (elapsedTimerRef.current !== null) {
      window.clearInterval(elapsedTimerRef.current);
      elapsedTimerRef.current = null;
    }
  }, []);

  const revokeRecordedUrl = useCallback(() => {
    if (recordedUrlRef.current) {
      URL.revokeObjectURL(recordedUrlRef.current);
      recordedUrlRef.current = null;
    }
  }, []);

  // ---- camera acquisition (preview + draw source) ------------------------

  const acquireCamera = useCallback(async () => {
    if (cameraStreamRef.current || cameraAcquiringRef.current) return;
    cameraAcquiringRef.current = true;
    try {
      const stream =
        await navigator.mediaDevices.getUserMedia(CAMERA_CONSTRAINTS);
      // The user may have closed the recorder or toggled camera off while the
      // permission prompt was up — if so, drop the freshly-acquired stream.
      if (
        !mountedRef.current ||
        phaseRef.current === "idle" ||
        !cameraOnRef.current
      ) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      cameraStreamRef.current = stream;
      cameraVideoRef.current = await makeOffscreenVideo(stream);
      setCameraError(false);
      setCameraStream(stream);
    } catch {
      cameraStreamRef.current = null;
      // If the recorder was closed or the camera toggled off while the prompt
      // was pending, don't clobber that intent with a "blocked" error.
      if (
        !mountedRef.current ||
        phaseRef.current === "idle" ||
        !cameraOnRef.current
      ) {
        return;
      }
      cameraOnRef.current = false;
      setCameraError(true);
      setCameraOnState(false);
      setCameraStream(null);
    } finally {
      cameraAcquiringRef.current = false;
    }
  }, []);

  // ---- canvas compositing ------------------------------------------------

  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const screenVideo = screenVideoRef.current;
    if (!canvas || !ctx || !screenVideo || screenVideo.videoWidth === 0) return;

    ctx.drawImage(screenVideo, 0, 0, canvas.width, canvas.height);

    const cameraVideo = cameraVideoRef.current;
    if (cameraOnRef.current && cameraVideo && cameraVideo.videoWidth > 0) {
      const diameter = Math.round(canvas.height * BUBBLE_DIAMETER_RATIO);
      const margin = Math.round(canvas.height * BUBBLE_MARGIN_RATIO);
      const dx = margin;
      const dy = canvas.height - diameter - margin;
      // Center-crop the webcam to a square before the circular clip.
      const side = Math.min(cameraVideo.videoWidth, cameraVideo.videoHeight);
      const sx = (cameraVideo.videoWidth - side) / 2;
      const sy = (cameraVideo.videoHeight - side) / 2;
      const cx = dx + diameter / 2;
      const cy = dy + diameter / 2;

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, diameter / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(
        cameraVideo,
        sx,
        sy,
        side,
        side,
        dx,
        dy,
        diameter,
        diameter,
      );
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, diameter / 2 - 1.5, 0, Math.PI * 2);
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#ffffff";
      ctx.stroke();
      ctx.restore();
    }
  }, []);

  // Draw via rAF when the tab is visible (smooth); fall back to a timer when
  // hidden so the composite keeps advancing instead of freezing while the user
  // is focused on the shared window. (A native desktop app — the planned
  // Electron path — avoids this background-throttle limitation entirely.)
  const startDrawLoop = useCallback(() => {
    const rafLoop = () => {
      drawFrame();
      rafRef.current = requestAnimationFrame(rafLoop);
    };
    const switchToRaf = () => {
      if (drawIntervalRef.current !== null) {
        window.clearInterval(drawIntervalRef.current);
        drawIntervalRef.current = null;
      }
      rafRef.current ??= requestAnimationFrame(rafLoop);
    };
    const switchToInterval = () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      drawIntervalRef.current ??= window.setInterval(drawFrame, 1000 / FPS);
    };
    const onVisibility = () =>
      document.hidden ? switchToInterval() : switchToRaf();
    visibilityHandlerRef.current = onVisibility;
    document.addEventListener("visibilitychange", onVisibility);
    onVisibility();
  }, [drawFrame]);

  // ---- elapsed timer -----------------------------------------------------

  const startElapsedTimer = useCallback(() => {
    segmentStartRef.current = performance.now();
    elapsedTimerRef.current = window.setInterval(() => {
      const ms =
        elapsedBaseMsRef.current +
        (performance.now() - segmentStartRef.current);
      setElapsedSec(Math.floor(ms / 1000));
    }, 250);
  }, []);

  // ---- recorder lifecycle ------------------------------------------------

  const finalizeRecording = useCallback(() => {
    // Idempotent: a fast double-click on Stop can call this directly AND via the
    // queued recorder.onstop. Bail on the second run so we don't rebuild an
    // empty blob over the valid one (phaseRef flips to "review" synchronously).
    if (phaseRef.current === "review") return;
    const recorder = recorderRef.current;
    if (recorder) recorder.onstop = null; // defuse a still-queued stop event
    const type = recorder?.mimeType ?? "video/webm";
    const blob = new Blob(chunksRef.current, { type });
    revokeRecordedUrl();
    const url = URL.createObjectURL(blob);
    recordedUrlRef.current = url;
    recorderRef.current = null;
    chunksRef.current = [];
    setRecordedUrl(url);
    setRecordedType(type);
    goPhase("review");
    teardownCapture();
    stopCamera();
  }, [revokeRecordedUrl, goPhase, teardownCapture, stopCamera]);

  /** Build a MediaRecorder over `mixed` wired to chunk collection + finalize. */
  const buildRecorder = useCallback(
    (mixed: MediaStream) => {
      const mimeType = pickMimeType();
      const recorder = new MediaRecorder(
        mixed,
        mimeType ? { mimeType } : undefined,
      );
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = finalizeRecording;
      recorderRef.current = recorder;
      return recorder;
    },
    [finalizeRecording],
  );

  const beginActualRecording = useCallback(() => {
    const recorder = recorderRef.current;
    if (!recorder) return;
    elapsedBaseMsRef.current = 0;
    setElapsedSec(0);
    recorder.start(1000);
    goPhase("recording");
    startElapsedTimer();
  }, [goPhase, startElapsedTimer]);

  const beginCountdown = useCallback(() => {
    clearCountdownTimer(); // never stack two countdown intervals
    let value = COUNTDOWN_FROM;
    setCountdownValue(value);
    goPhase("countdown");
    countdownTimerRef.current = window.setInterval(() => {
      value -= 1;
      if (value <= 0) {
        clearCountdownTimer();
        setCountdownValue(0);
        beginActualRecording();
      } else {
        setCountdownValue(value);
      }
    }, 1000);
  }, [goPhase, clearCountdownTimer, beginActualRecording]);

  /** Wire screen + mic + camera into a single composited MediaRecorder. */
  const prepareRecorder = useCallback(() => {
    const screenStream = screenStreamRef.current;
    if (!screenStream) return false;
    try {
      const settings = screenStream.getVideoTracks()[0]?.getSettings();
      const { width, height } = fitCanvasSize(
        settings?.width ?? screenVideoRef.current?.videoWidth ?? 1280,
        settings?.height ?? screenVideoRef.current?.videoHeight ?? 720,
      );
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvasRef.current = canvas;

      startDrawLoop();

      const canvasStream = canvas.captureStream(FPS);
      const tracks: MediaStreamTrack[] = [...canvasStream.getVideoTracks()];

      // Mix mic + system audio into the recording. Best-effort: if the browser
      // has no AudioContext at all, fall back to a video-only recording rather
      // than failing outright.
      const AudioCtor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtor) {
        const audioCtx = new AudioCtor();
        audioCtxRef.current = audioCtx;
        void audioCtx.resume().catch(() => undefined); // autoplay-policy safety
        const destination = audioCtx.createMediaStreamDestination();
        let hasAudio = false;
        if (micStreamRef.current?.getAudioTracks().length) {
          audioCtx
            .createMediaStreamSource(micStreamRef.current)
            .connect(destination);
          hasAudio = true;
        }
        const systemAudio = screenStream.getAudioTracks();
        if (systemAudio.length > 0) {
          audioCtx
            .createMediaStreamSource(new MediaStream(systemAudio))
            .connect(destination);
          hasAudio = true;
        }
        if (hasAudio) tracks.push(...destination.stream.getAudioTracks());
      }

      const mixed = new MediaStream(tracks);
      mixedStreamRef.current = mixed;
      buildRecorder(mixed);
      return true;
    } catch {
      return false;
    }
  }, [startDrawLoop, buildRecorder]);

  // ---- public actions ----------------------------------------------------

  const open = useCallback(() => {
    // The overlay is click-through while recording/paused, so the sidebar
    // "Record a video" button is reachable mid-session — ignore re-opens unless
    // we're idle or reviewing a finished take (both have no live capture).
    if (phaseRef.current !== "idle" && phaseRef.current !== "review") return;
    revokeRecordedUrl();
    setRecordedUrl(null);
    setRecordedType(null);
    setErrorMessage(null);
    setCameraError(false);
    setElapsedSec(0);
    goPhase("preview");
    if (cameraOnRef.current) void acquireCamera();
  }, [revokeRecordedUrl, goPhase, acquireCamera]);

  const reset = useCallback(() => {
    runIdRef.current += 1; // invalidate any in-flight startRecording
    startingRef.current = false;
    discardRecorder();
    clearCountdownTimer();
    clearElapsedTimer();
    teardownCapture();
    stopCamera();
    revokeRecordedUrl();
    setRecordedUrl(null);
    setRecordedType(null);
    setErrorMessage(null);
    setCameraError(false);
    setElapsedSec(0);
    setCountdownValue(0);
    goPhase("idle");
  }, [
    discardRecorder,
    clearCountdownTimer,
    clearElapsedTimer,
    teardownCapture,
    stopCamera,
    revokeRecordedUrl,
    goPhase,
  ]);

  const close = useCallback(() => reset(), [reset]);

  const setCameraOn = useCallback(
    (on: boolean) => {
      cameraOnRef.current = on;
      setCameraOnState(on);
      setCameraError(false);
      if (on) {
        if (phaseRef.current !== "idle") void acquireCamera();
      } else {
        stopCamera();
      }
    },
    [acquireCamera, stopCamera],
  );

  const setMicOn = useCallback((on: boolean) => {
    micOnRef.current = on;
    setMicOnState(on);
  }, []);

  const startRecording = useCallback(async () => {
    // Block re-entrant Start clicks (the phase stays "preview" through every
    // await below, so the phase check alone can't stop a second click).
    if (startingRef.current || phaseRef.current !== "preview") return;
    startingRef.current = true;
    const myRun = ++runIdRef.current;
    setErrorMessage(null);

    // After any await, the user may have closed (or closed-then-reopened) the
    // recorder, or the provider may have unmounted. `stale()` detects that via
    // the generation token; `abort()` releases whatever we grabbed so capture
    // never resurrects behind a closed overlay (OS share indicator stuck on).
    const stale = () => !mountedRef.current || runIdRef.current !== myRun;
    const abort = (local?: MediaStream | null) => {
      if (local) stopStream(local);
      teardownCapture();
    };

    try {
      let screenStream: MediaStream;
      try {
        // First await off the click so it keeps the user gesture.
        screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: { frameRate: { ideal: FPS } },
          audio: true,
        });
      } catch {
        if (!stale()) setErrorMessage("Screen sharing is required to record.");
        return;
      }
      if (stale()) {
        stopStream(screenStream);
        return;
      }
      screenStreamRef.current = screenStream;

      if (micOnRef.current && !micStreamRef.current) {
        try {
          micStreamRef.current =
            await navigator.mediaDevices.getUserMedia(MIC_CONSTRAINTS);
        } catch {
          micStreamRef.current = null; // proceed mic-less
        }
      }
      if (stale()) {
        abort(screenStream);
        return;
      }

      if (cameraOnRef.current && !cameraStreamRef.current) {
        await acquireCamera();
      }
      if (stale()) {
        abort(screenStream);
        return;
      }

      try {
        screenVideoRef.current = await makeOffscreenVideo(screenStream);
      } catch {
        // The share can end (e.g. native "Stop sharing") before metadata loads.
        if (!stale()) {
          setErrorMessage("Screen sharing ended before recording could start.");
        }
        abort(screenStream);
        return;
      }
      if (stale()) {
        abort(screenStream);
        return;
      }

      // Chrome's native "Stop sharing" bar ends the screen track → finish up.
      const screenTrack = screenStream.getVideoTracks()[0];
      if (screenTrack) {
        const onEnded = () => {
          if (phaseRef.current === "countdown") cancelCountdownRef.current?.();
          else if (
            phaseRef.current === "recording" ||
            phaseRef.current === "paused"
          ) {
            stopRecordingRef.current?.();
          }
        };
        screenTrackEndedRef.current = onEnded;
        screenTrack.addEventListener("ended", onEnded);
      }

      // No awaits past this point, so the synchronous tail can't interleave.
      if (!prepareRecorder()) {
        setErrorMessage("Could not start recording. Please try again.");
        abort(screenStream);
        return;
      }
      beginCountdown();
    } finally {
      startingRef.current = false;
    }
  }, [
    acquireCamera,
    prepareRecorder,
    beginCountdown,
    teardownCapture,
    stopStream,
  ]);

  const stopRecording = useCallback(() => {
    const recorder = recorderRef.current;
    clearElapsedTimer();
    if (recorder && recorder.state !== "inactive") {
      recorder.stop(); // → finalizeRecording → review
    } else if (!recorderRef.current) {
      // A still-set recorderRef with an "inactive" recorder means stop() already
      // ran and its onstop is queued — let that finalize so the final chunk
      // isn't dropped. Only finalize here when there's genuinely nothing pending.
      finalizeRecording();
    }
  }, [clearElapsedTimer, finalizeRecording]);

  const cancelRecording = useCallback(() => reset(), [reset]);

  const pauseRecording = useCallback(() => {
    const recorder = recorderRef.current;
    if (recorder?.state !== "recording") return;
    recorder.pause();
    elapsedBaseMsRef.current += performance.now() - segmentStartRef.current;
    clearElapsedTimer();
    goPhase("paused");
  }, [clearElapsedTimer, goPhase]);

  const resumeRecording = useCallback(() => {
    const recorder = recorderRef.current;
    if (recorder?.state !== "paused") return;
    recorder.resume();
    goPhase("recording");
    startElapsedTimer();
  }, [goPhase, startElapsedTimer]);

  const restartRecording = useCallback(() => {
    // Drop the in-progress take but keep screen/mic/camera/canvas live, then
    // build a fresh recorder on the same composited stream and count down again.
    discardRecorder();
    clearElapsedTimer();
    elapsedBaseMsRef.current = 0;
    setElapsedSec(0);

    const mixed = mixedStreamRef.current;
    if (!mixed) {
      reset();
      return;
    }
    buildRecorder(mixed);
    beginCountdown();
  }, [
    discardRecorder,
    clearElapsedTimer,
    reset,
    buildRecorder,
    beginCountdown,
  ]);

  const cancelCountdown = useCallback(() => {
    clearCountdownTimer();
    discardRecorder();
    teardownCapture(); // keeps camera preview alive
    setCountdownValue(0);
    goPhase("preview");
  }, [clearCountdownTimer, discardRecorder, teardownCapture, goPhase]);

  // `startRecording`'s screen-ended handler needs the latest stop/cancel without
  // recreating the listener; route through refs.
  const stopRecordingRef = useRef(stopRecording);
  const cancelCountdownRef = useRef(cancelCountdown);
  useEffect(() => {
    stopRecordingRef.current = stopRecording;
    cancelCountdownRef.current = cancelCountdown;
  }, [stopRecording, cancelCountdown]);

  // Tear everything down if the provider unmounts mid-session.
  useEffect(() => {
    return () => {
      mountedRef.current = false; // so any in-flight start aborts post-await
      runIdRef.current += 1;
      discardRecorder();
      clearCountdownTimer();
      clearElapsedTimer();
      teardownCapture();
      stopStream(cameraStreamRef.current);
      cameraStreamRef.current = null;
      revokeRecordedUrl();
    };
  }, [
    discardRecorder,
    clearCountdownTimer,
    clearElapsedTimer,
    teardownCapture,
    stopStream,
    revokeRecordedUrl,
  ]);

  return useMemo<RecorderEngine>(
    () => ({
      phase,
      isOpen: phase !== "idle",
      open,
      close,
      cameraOn,
      micOn,
      setCameraOn,
      setMicOn,
      cameraStream,
      cameraError,
      startRecording: () => void startRecording(),
      stopRecording,
      cancelRecording,
      pauseRecording,
      resumeRecording,
      restartRecording,
      cancelCountdown,
      elapsedSec,
      countdownValue,
      recordedUrl,
      recordedType,
      errorMessage,
    }),
    [
      phase,
      open,
      close,
      cameraOn,
      micOn,
      setCameraOn,
      setMicOn,
      cameraStream,
      cameraError,
      startRecording,
      stopRecording,
      cancelRecording,
      pauseRecording,
      resumeRecording,
      restartRecording,
      cancelCountdown,
      elapsedSec,
      countdownValue,
      recordedUrl,
      recordedType,
      errorMessage,
    ],
  );
}
