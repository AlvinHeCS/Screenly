"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Script from "next/script";

import type { RouterOutputs } from "~/trpc/react";
import { api } from "~/trpc/react";

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
  const [sdkReady, setSdkReady] = useState(false);

  const videoPending = data.status === "UPLOADING" || data.status === "PROCESSING";
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

  // Build (once) the Stream player handle from the iframe + SDK global. Stable so
  // it can live in effect deps; returns null until both the iframe and SDK exist.
  const attachPlayer = useCallback((): StreamPlayer | null => {
    if (playerRef.current) return playerRef.current;
    const iframe = iframeRef.current;
    const factory = window.Stream;
    if (!iframe || !factory) return null;
    playerRef.current = factory(iframe);
    return playerRef.current;
  }, []);

  // If the SDK was already loaded by a prior mount, next/script's onLoad won't
  // refire — pick it up here so sdkReady reflects reality.
  useEffect(() => {
    if (window.Stream) setSdkReady(true);
  }, []);

  // Attach eagerly once the player iframe is mounted and the SDK is present, so
  // the postMessage handshake is done before the first transcript click.
  useEffect(() => {
    if (isReady && sdkReady) attachPlayer();
  }, [isReady, sdkReady, attachPlayer]);

  const handleSeek = (startMs: number) => {
    const player = attachPlayer();
    if (!player) return;
    player.currentTime = Math.max(0, startMs / 1000 - SEEK_LEAD_SEC);
    void player.play().catch(() => {
      // play() can reject if a rapid second click interrupts it — safe to ignore.
    });
  };

  return (
    <main className="flex min-h-screen flex-col bg-[hsla(228,6%,17%,1)] text-white">
      <Script
        src={STREAM_SDK_SRC}
        onLoad={() => setSdkReady(true)}
      />
      <header className="flex items-center justify-between px-[24px] py-[16px]">
        <Link
          href="/videos"
          className="text-[14px] font-medium text-[hsla(0,0%,100%,0.7)] transition-colors hover:text-white"
        >
          ← Library
        </Link>
      </header>

      <div className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-[24px] px-[24px] pb-[48px] lg:flex-row">
        <div className="min-w-0 flex-1">
          <div className="overflow-hidden rounded-[12px] bg-black shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
            {isReady ? (
              <iframe
                ref={iframeRef}
                src={`https://iframe.videodelivery.net/${data.cloudflareUid}`}
                title={data.title}
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen
                className="aspect-video w-full border-0"
              />
            ) : (
              <div className="flex aspect-video w-full items-center justify-center text-[14px] text-[hsla(0,0%,100%,0.7)]">
                {data.status === "ERRORED"
                  ? "This recording failed to process."
                  : "This recording is still processing — hang tight…"}
              </div>
            )}
          </div>

          <h1 className="mt-[16px] text-[20px] font-semibold">{data.title}</h1>
          <p className="mt-[4px] text-[13px] text-[hsla(0,0%,100%,0.6)]">
            {data.owner.name ?? "Unknown"}
          </p>
        </div>

        <TranscriptPanel
          videoReady={data.status === "READY"}
          transcript={data.transcript}
          onSeek={handleSeek}
        />
      </div>
    </main>
  );
}

function TranscriptPanel({
  videoReady,
  transcript,
  onSeek,
}: {
  videoReady: boolean;
  transcript: WatchData["transcript"];
  onSeek: (startMs: number) => void;
}) {
  const terminalGenerated = transcript.status === "READY";
  const unavailable =
    transcript.status === "FAILED" || transcript.status === "UNAVAILABLE";

  return (
    <aside className="flex w-full shrink-0 flex-col overflow-hidden rounded-[12px] border border-[hsla(0,0%,100%,0.12)] bg-[hsla(0,0%,100%,0.03)] lg:h-[calc(100vh-140px)] lg:w-[360px]">
      <div className="shrink-0 border-b border-[hsla(0,0%,100%,0.12)] px-[16px] py-[12px] text-[14px] font-semibold">
        Transcript
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-[16px] py-[12px]">
        {!videoReady ? (
          <p className="text-[13px] text-[hsla(0,0%,100%,0.55)]">
            The transcript appears once the recording finishes processing.
          </p>
        ) : terminalGenerated && transcript.cues.length > 0 ? (
          <ul className="flex flex-col gap-[10px]">
            {transcript.cues.map((cue, i) => (
              <li key={i} className="flex gap-[10px] text-[14px] leading-[1.5]">
                <button
                  type="button"
                  onClick={() => onSeek(cue.startMs)}
                  aria-label={`Jump to ${formatTimestamp(cue.startMs)}`}
                  className="shrink-0 cursor-pointer border-0 bg-transparent px-0 pb-0 pt-[1px] font-mono text-[12px] text-[hsla(210,90%,72%,1)] transition-colors hover:text-[hsla(210,95%,82%,1)] hover:underline focus-visible:underline focus-visible:outline-none"
                >
                  {formatTimestamp(cue.startMs)}
                </button>
                <span className="text-[hsla(0,0%,100%,0.92)]">{cue.text}</span>
              </li>
            ))}
          </ul>
        ) : unavailable ? (
          <p className="text-[13px] text-[hsla(0,0%,100%,0.55)]">
            Transcript unavailable for this video.
          </p>
        ) : (
          <div className="flex items-center gap-[10px] text-[13px] text-[hsla(0,0%,100%,0.7)]">
            <span className="h-[16px] w-[16px] animate-spin rounded-full border-[2px] border-[hsla(0,0%,100%,0.2)] border-t-white" />
            Generating transcript…
          </div>
        )}
      </div>
    </aside>
  );
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
