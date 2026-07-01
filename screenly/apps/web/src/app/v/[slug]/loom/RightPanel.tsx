"use client";

import { TranscriptTab, type TranscriptCue } from "./TranscriptTab";

interface RightPanelProps {
  transcriptState: "loading" | "ready" | "unavailable" | "waiting";
  cues: TranscriptCue[];
  onSeek?: (startMs: number) => void;
}

/**
 * Right sidebar for the watch route. Only transcript is rendered because the
 * edit/activity/settings controls are not implemented.
 */
export function RightPanel({
  transcriptState,
  cues,
  onSeek,
}: RightPanelProps) {
  return (
    <aside className="flex w-full min-w-0 shrink-0 flex-col border-t border-[#ececef] bg-white lg:sticky lg:top-[56px] lg:h-[calc(100vh-56px)] lg:w-[435px] lg:border-l lg:border-t-0">
      <TranscriptTab state={transcriptState} cues={cues} onSeek={onSeek} />
    </aside>
  );
}
