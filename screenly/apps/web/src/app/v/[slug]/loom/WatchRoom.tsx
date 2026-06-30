import type { Ref } from "react";

import { RightPanel } from "./RightPanel";
import { TitleBar } from "./TitleBar";
import { VideoFrame } from "./VideoFrame";
import { WatchHeader } from "./WatchHeader";
import type { TranscriptCue } from "./TranscriptTab";

export interface WatchRoomProps {
  title: string;
  ownerName: string;
  ownerInitials: string;
  ownerFirstName: string;
  dateLabel: string;
  dateTime: string;
  viewsLabel: string;
  durationLabel: string;
  embedUrl?: string;
  posterMessage?: string;
  avatarSrc?: string;
  usageLabel?: string;
  notificationsLabel?: string;
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
  title,
  ownerName,
  ownerInitials,
  ownerFirstName,
  dateLabel,
  dateTime,
  viewsLabel,
  durationLabel,
  embedUrl,
  posterMessage,
  avatarSrc,
  usageLabel = "20/25 videos",
  notificationsLabel = "9+",
  transcriptState,
  cues,
  iframeRef,
  onPlayerLoad,
  onSeek,
}: WatchRoomProps) {
  return (
    <main className="min-h-screen bg-white text-[#1d1c20]">
      <WatchHeader
        usageLabel={usageLabel}
        notificationsLabel={notificationsLabel}
        avatarSrc={avatarSrc}
        avatarAlt={ownerName}
        avatarInitials={ownerInitials}
      />
      <div className="flex min-h-[calc(100vh-56px)] flex-col lg:flex-row">
        <section
          id="mainContent"
          className="min-w-0 flex-1 px-[24px] pb-[48px] pt-[24px] lg:px-[28px]"
        >
          <TitleBar
            title={title}
            ownerName={ownerName}
            dateLabel={dateLabel}
            dateTime={dateTime}
            viewsLabel={viewsLabel}
          />

          <div className="mx-auto w-full max-w-[1280px]">
            <div className="overflow-hidden rounded-[12px] bg-black">
              <VideoFrame
                embedUrl={embedUrl}
                title={title}
                durationLabel={durationLabel}
                posterMessage={posterMessage}
                iframeRef={iframeRef}
                onPlayerLoad={onPlayerLoad}
              />
            </div>
          </div>
        </section>

        <RightPanel
          ownerFirstName={ownerFirstName}
          transcriptState={transcriptState}
          cues={cues}
          onSeek={onSeek}
        />
      </div>
    </main>
  );
}
