import type { Ref } from "react";

import { RightPanel } from "./RightPanel";
import { TitleBar } from "./TitleBar";
import { VideoFrame } from "./VideoFrame";
import { WatchHeader } from "./WatchHeader";
import type { TranscriptCue } from "./TranscriptTab";

export interface WatchRoomProps {
  videoId: string;
  title: string;
  ownerName: string;
  dateLabel: string;
  dateTime: string;
  canCreateShareLink: boolean;
  showHeader?: boolean;
  canEditTitle?: boolean;
  onTitleChange?: (title: string) => Promise<void> | void;
  embedUrl?: string;
  posterMessage?: string;
  transcriptState: "loading" | "ready" | "unavailable" | "waiting";
  cues: TranscriptCue[];
  /** Forwarded to the player iframe so the parent can drive seeks. */
  iframeRef?: Ref<HTMLIFrameElement>;
  /** Notifies the parent when the player iframe has loaded. */
  onPlayerLoad?: () => void;
  /** Clicking a transcript timestamp seeks the player to that cue. */
  onSeek?: (startMs: number) => void;
}

/**
 * Loom share-page layout: a light page with the title/metadata row and video on
 * the left, plus Loom's fixed right sidebar for edit/activity/transcript tabs.
 */
export function WatchRoom({
  videoId,
  title,
  ownerName,
  dateLabel,
  dateTime,
  canCreateShareLink,
  showHeader = true,
  canEditTitle,
  onTitleChange,
  embedUrl,
  posterMessage,
  transcriptState,
  cues,
  iframeRef,
  onPlayerLoad,
  onSeek,
}: WatchRoomProps) {
  const contentMinHeight = showHeader
    ? "min-h-[calc(100vh-56px)]"
    : "min-h-[calc(100vh-64px)]";

  return (
    <main
      className={`${showHeader ? "min-h-screen" : "min-h-[calc(100vh-64px)]"} bg-white text-[#1d1c20]`}
    >
      {showHeader ? <WatchHeader /> : null}
      <div className={`flex ${contentMinHeight} flex-col lg:flex-row`}>
        <section
          id="mainContent"
          className="min-w-0 flex-1 px-[24px] pb-[48px] pt-[24px] lg:px-[28px]"
        >
          <TitleBar
            videoId={videoId}
            title={title}
            ownerName={ownerName}
            dateLabel={dateLabel}
            dateTime={dateTime}
            canCreateShareLink={canCreateShareLink}
            canEditTitle={canEditTitle}
            onTitleChange={onTitleChange}
          />

          <div className="mx-auto w-full max-w-[1280px]">
            <div className="overflow-hidden rounded-[12px] bg-black">
              <VideoFrame
                embedUrl={embedUrl}
                title={title}
                posterMessage={posterMessage}
                iframeRef={iframeRef}
                onPlayerLoad={onPlayerLoad}
              />
            </div>
          </div>
        </section>

        <RightPanel
          hasPublicHeader={showHeader}
          transcriptState={transcriptState}
          cues={cues}
          onSeek={onSeek}
        />
      </div>
    </main>
  );
}
