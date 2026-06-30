"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Script from "next/script";

import type { RouterOutputs } from "~/trpc/react";
import { api } from "~/trpc/react";
import { WatchRoom } from "./loom/WatchRoom";

export type WatchData = RouterOutputs["video"]["getBySlug"];

const POLL_INTERVAL_MS = 4000;
/** Backstop: stop polling after ~30min (server timeouts resolve well before). */
const MAX_POLLS = 450;

const TRANSCRIPT_TERMINAL = ["READY", "FAILED", "UNAVAILABLE"];

const STREAM_SDK_SRC = "https://embed.cloudflarestream.com/embed/sdk.latest.js";
/** Small run-up so a seek lands just before the cue's first word, never mid-word. */
const SEEK_LEAD_SEC = 0.3;

/** Minimal surface of the Cloudflare Stream player handle we use. */
interface StreamPlayer {
  currentTime: number;
  play: () => Promise<void>;
  destroy?: () => void;
}

declare global {
  interface Window {
    Stream?: (iframe: HTMLIFrameElement) => StreamPlayer;
  }
}

export function WatchView({
  slug,
  initial,
}: {
  slug: string;
  initial: WatchData;
}) {
  const [data, setData] = useState<WatchData>(initial);
  const [timedOut, setTimedOut] = useState(false);

  const utils = api.useUtils();
  const syncTranscript = api.video.syncTranscript.useMutation();

  // Stable refs so the polling effect (which only re-subscribes on `pending`)
  // always sees the latest data + mutate fn instead of a stale closure.
  const syncRef = useRef(syncTranscript.mutateAsync);
  syncRef.current = syncTranscript.mutateAsync;
  const dataRef = useRef(data);
  dataRef.current = data;
  const pollCountRef = useRef(0);

  // Cloudflare Stream player wiring: the iframe element + the player handle the
  // embed SDK builds from it. Transcript clicks seek/play through this handle.
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const playerRef = useRef<StreamPlayer | null>(null);
  const playerIframeRef = useRef<HTMLIFrameElement | null>(null);
  const pendingSeekMsRef = useRef<number | null>(null);
  const [sdkReady, setSdkReady] = useState(false);

  const videoPending =
    data.status === "UPLOADING" || data.status === "PROCESSING";
  const transcriptPending =
    data.status === "READY" &&
    !TRANSCRIPT_TERMINAL.includes(data.transcript.status);
  const pending = !timedOut && (videoPending || transcriptPending);

  useEffect(() => {
    if (!pending) return;
    let active = true;

    const tick = async () => {
      if (pollCountRef.current >= MAX_POLLS) {
        if (active) setTimedOut(true);
        return;
      }
      pollCountRef.current += 1;
      try {
        const current = dataRef.current;
        if (
          current.status === "READY" &&
          !TRANSCRIPT_TERMINAL.includes(current.transcript.status)
        ) {
          // Video is ready — drive transcript generation/polling.
          const transcript = await syncRef.current({ slug });
          if (active) setData((d) => ({ ...d, transcript }));
        } else {
          // Still encoding — refresh status (driven READY by webhook/library).
          // staleTime 0 so the poll actually refetches instead of returning the
          // cached payload for the query client's default 30s window.
          const fresh = await utils.video.getBySlug.fetch(
            { slug },
            { staleTime: 0 },
          );
          if (active) setData(fresh);
        }
      } catch {
        // transient — the next interval tick retries
      }
    };

    void tick();
    const id = setInterval(() => void tick(), POLL_INTERVAL_MS);
    return () => {
      active = false;
      clearInterval(id);
    };
    // data.status / transcript.status are captured fresh via setData callbacks
    // and the `pending` gate; re-subscribe only when polling should start/stop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending, slug]);

  const isReady = data.status === "READY" && Boolean(data.cloudflareUid);

  const setIframeRef = useCallback((node: HTMLIFrameElement | null) => {
    if (iframeRef.current === node) return;
    playerRef.current?.destroy?.();
    playerRef.current = null;
    playerIframeRef.current = null;
    iframeRef.current = node;
  }, []);

  // Build (once) the Stream player handle from the iframe + SDK global. Stable so
  // it can live in effect deps; returns null until both the iframe and SDK exist.
  const attachPlayer = useCallback((): StreamPlayer | null => {
    const iframe = iframeRef.current;
    const factory = window.Stream;
    if (!iframe || !factory) return null;
    if (playerRef.current && playerIframeRef.current === iframe) {
      return playerRef.current;
    }
    try {
      playerRef.current = factory(iframe);
      playerIframeRef.current = iframe;
      return playerRef.current;
    } catch {
      return null;
    }
  }, []);

  const seekPlayer = useCallback((player: StreamPlayer, startMs: number) => {
    player.currentTime = Math.max(0, startMs / 1000 - SEEK_LEAD_SEC);
    void player.play().catch(() => {
      // play() can reject if a rapid second click interrupts it — safe to ignore.
    });
  }, []);

  const flushPendingSeek = useCallback(() => {
    const startMs = pendingSeekMsRef.current;
    if (startMs === null) return;
    const player = attachPlayer();
    if (!player) return;
    pendingSeekMsRef.current = null;
    seekPlayer(player, startMs);
  }, [attachPlayer, seekPlayer]);

  // If the SDK was already loaded by a prior mount, next/script's onLoad won't
  // refire — pick it up here so sdkReady reflects reality.
  useEffect(() => {
    if (window.Stream) setSdkReady(true);
  }, []);

  // Attach eagerly once the player iframe is mounted and the SDK is present, so
  // the postMessage handshake is done before the first transcript click.
  useEffect(() => {
    if (!isReady || !sdkReady) return;
    attachPlayer();
    flushPendingSeek();
  }, [isReady, sdkReady, attachPlayer, flushPendingSeek]);

  const handlePlayerLoad = useCallback(() => {
    if (!window.Stream) return;
    setSdkReady(true);
    attachPlayer();
    flushPendingSeek();
  }, [attachPlayer, flushPendingSeek]);

  const handleSeek = useCallback((startMs: number) => {
    const player = attachPlayer();
    if (!player) {
      pendingSeekMsRef.current = startMs;
      return;
    }
    pendingSeekMsRef.current = null;
    seekPlayer(player, startMs);
  }, [attachPlayer, seekPlayer]);

  const ownerName = data.owner.name ?? "Unknown";
  const transcriptState: "loading" | "ready" | "unavailable" | "waiting" =
    data.status !== "READY"
      ? "waiting"
      : data.transcript.status === "READY"
        ? "ready"
        : data.transcript.status === "FAILED" ||
            data.transcript.status === "UNAVAILABLE"
          ? "unavailable"
          : "loading";

  return (
    <>
      <Script src={STREAM_SDK_SRC} onLoad={() => setSdkReady(true)} />
      <WatchRoom
        title={data.title}
        ownerName={ownerName}
        ownerInitials={initialsOf(ownerName)}
        ownerFirstName={firstNameOf(ownerName)}
        dateLabel={formatRelativeDate(data.createdAt)}
        dateTime={toIsoDateTime(data.createdAt)}
        viewsLabel="1 view"
        durationLabel={formatDuration(data.durationSec)}
        avatarSrc={data.owner.image ?? undefined}
        embedUrl={
          isReady
            ? `https://iframe.videodelivery.net/${data.cloudflareUid}`
            : undefined
        }
        posterMessage={
          isReady
            ? undefined
            : data.status === "ERRORED"
              ? "This recording failed to process."
              : "This recording is still processing — hang tight…"
        }
        transcriptState={transcriptState}
        cues={data.transcript.cues.map((cue) => ({
          startMs: cue.startMs,
          timestamp: formatTimestamp(cue.startMs),
          text: cue.text,
        }))}
        iframeRef={setIframeRef}
        onPlayerLoad={handlePlayerLoad}
        onSeek={handleSeek}
      />
    </>
  );
}

function initialsOf(name: string): string {
  return name.trim().charAt(0).toUpperCase() || "?";
}

function firstNameOf(name: string): string {
  return name.trim().split(/\s+/)[0] ?? name;
}

function toIsoDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString();
}

function formatRelativeDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const diffMs = Date.now() - d.getTime();
  const absMs = Math.abs(diffMs);
  const minuteMs = 60 * 1000;
  const hourMs = 60 * minuteMs;
  const dayMs = 24 * hourMs;

  if (absMs < minuteMs) return "just now";

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  if (absMs < hourMs) {
    return rtf.format(-Math.round(diffMs / minuteMs), "minute");
  }
  if (absMs < dayMs) {
    return rtf.format(-Math.round(diffMs / hourMs), "hour");
  }
  return rtf.format(-Math.round(diffMs / dayMs), "day");
}

function formatDuration(durationSec: number | null): string {
  const total = Math.max(0, Math.floor(durationSec ?? 0));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function formatTimestamp(ms: number): string {
  const total = Math.floor(ms / 1000);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const mm = hours > 0 ? String(minutes).padStart(2, "0") : String(minutes);
  const ss = String(seconds).padStart(2, "0");
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
}
