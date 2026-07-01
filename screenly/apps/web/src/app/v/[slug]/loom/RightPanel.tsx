"use client";

import { TranscriptTab, type TranscriptCue } from "./TranscriptTab";

interface RightPanelProps {
  hasPublicHeader?: boolean;
  transcriptState: "loading" | "ready" | "unavailable" | "waiting";
  cues: TranscriptCue[];
  onSeek?: (startMs: number) => void;
}

/**
 * Right sidebar for the watch route. Only transcript is rendered because the
 * edit/activity/settings controls are not implemented.
 */
export function RightPanel({
  hasPublicHeader = true,
  transcriptState,
  cues,
  onSeek,
}: RightPanelProps) {
  const stickyGeometry = hasPublicHeader
    ? "lg:top-[56px] lg:h-[calc(100vh-56px)]"
    : "lg:top-0 lg:h-[calc(100vh-64px)]";

  return (
    <aside
      className={`flex w-full min-w-0 shrink-0 flex-col border-t border-[#ececef] bg-white lg:sticky ${stickyGeometry} lg:w-[435px] lg:border-l lg:border-t-0`}
    >
      <TranscriptTab state={transcriptState} cues={cues} onSeek={onSeek} />
    </aside>
  );
}
