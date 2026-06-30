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
  /** Clicking a transcript timestamp seeks the player to that cue. */
  onSeek?: (startMs: number) => void;
}

/**
 * Loom share-page layout: a light page with the title/metadata row above a dark
 * rounded "theater" that holds the video (left) and the tabbed panel (right).
 */
export function WatchRoom({
  title,
  ownerName,
  ownerInitials,
  ownerFirstName,
  dateLabel,
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
      <div className="mx-auto w-full max-w-[1400px] px-[24px] pb-[48px] pt-[24px]">
        <TitleBar
          title={title}
          ownerName={ownerName}
          dateLabel={dateLabel}
          viewsLabel={viewsLabel}
        />

        <div className="flex flex-col overflow-hidden rounded-[12px] bg-[#1b1b1f] shadow-[0_12px_40px_rgba(0,0,0,0.18)] lg:flex-row">
          <VideoFrame
            embedUrl={embedUrl}
            title={title}
            durationLabel={durationLabel}
            posterMessage={posterMessage}
            iframeRef={iframeRef}
          />
          <RightPanel
            ownerFirstName={ownerFirstName}
            transcriptState={transcriptState}
            cues={cues}
            onSeek={onSeek}
          />
        </div>
      </div>
    </main>
  );
}
