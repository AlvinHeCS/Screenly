import type { Ref } from "react";

interface VideoFrameProps {
  /** Cloudflare Stream embed URL. When absent the Loom-style poster shows. */
  embedUrl?: string;
  title: string;
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
          <div className="absolute inset-0 flex items-center justify-center">
            {posterMessage && (
              <span className="px-[16px] text-center text-[13px] font-medium text-[rgba(255,255,255,0.7)]">
                {posterMessage}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
