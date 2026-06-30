import type { Ref } from "react";

import { PlayIcon } from "./icons/PlayIcon";

interface VideoFrameProps {
  /** Cloudflare Stream embed URL. When absent the Loom-style poster shows. */
  embedUrl?: string;
  title: string;
  /** Total duration shown in the control bar, e.g. "2:34". */
  durationLabel: string;
  /** Message shown over the poster while the recording is still encoding. */
  posterMessage?: string;
  /** Forwarded to the iframe so the parent can drive the Stream player (seek). */
  iframeRef?: Ref<HTMLIFrameElement>;
  /** Notifies the parent when the iframe has loaded so queued seeks can flush. */
  onPlayerLoad?: () => void;
}

/**
 * The black video area on the left of the theater. When the Cloudflare embed is
 * ready it renders the iframe (which carries its own controls); otherwise it
 * reproduces Loom's poster: centered play button + a static control bar.
 */
export function VideoFrame({
  embedUrl,
  title,
  durationLabel,
  posterMessage,
  iframeRef,
  onPlayerLoad,
}: VideoFrameProps) {
  return (
    <div className="relative min-w-0 flex-1 bg-black">
      <div className="relative aspect-video w-full">
        {embedUrl ? (
          <iframe
            ref={iframeRef}
            src={embedUrl}
            title={title}
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            allowFullScreen
            onLoad={onPlayerLoad}
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <>
            <button
              type="button"
              aria-label="Play the video, keyboard shortcut K"
              className="absolute left-1/2 top-1/2 h-[72px] w-[72px] -translate-x-1/2 -translate-y-1/2 transition-transform duration-[150ms] hover:scale-[1.05]"
            >
              <PlayIcon className="h-full w-full" />
            </button>

            {posterMessage && (
              <span className="absolute inset-x-0 bottom-[64px] text-center text-[13px] font-medium text-[rgba(255,255,255,0.7)]">
                {posterMessage}
              </span>
            )}

            {/* Static control bar — layout reproduction, not yet wired. */}
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-[8px] bg-gradient-to-t from-[rgba(0,0,0,0.55)] to-transparent px-[16px] pb-[12px] pt-[40px]">
              <div className="h-[4px] w-full rounded-full bg-[rgba(255,255,255,0.25)]">
                <div className="h-full w-0 rounded-full bg-[#625df5]" />
              </div>
              <div className="flex items-center justify-between text-[12px] font-medium text-white">
                <span>0:00 / {durationLabel}</span>
                <span className="rounded-[4px] bg-[rgba(255,255,255,0.14)] px-[6px] py-[2px]">
                  1×
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
