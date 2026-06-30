"use client";

import { useState } from "react";

import { CommentsEmptyState } from "./CommentsEmptyState";
import { TranscriptTab, type TranscriptCue } from "./TranscriptTab";

const TABS = ["Activity", "Chapters", "Summary", "Transcript"] as const;
type Tab = (typeof TABS)[number];

interface RightPanelProps {
  ownerFirstName: string;
  transcriptState: "loading" | "ready" | "unavailable" | "waiting";
  cues: TranscriptCue[];
  onSeek?: (startMs: number) => void;
}

/**
 * The dark panel on the right of the theater with Loom's four tabs. Sits inside
 * the player's dark frame, so text is light. Defaults to Transcript.
 */
export function RightPanel({
  ownerFirstName,
  transcriptState,
  cues,
  onSeek,
}: RightPanelProps) {
  const [active, setActive] = useState<Tab>("Transcript");

  return (
    <div className="flex w-full shrink-0 flex-col border-t border-[rgba(255,255,255,0.1)] bg-[#1b1b1f] lg:w-[400px] lg:border-l lg:border-t-0">
      <div
        role="tablist"
        className="flex shrink-0 items-center gap-[4px] border-b border-[rgba(255,255,255,0.1)] px-[12px]"
      >
        {TABS.map((tab) => {
          const isActive = tab === active;
          return (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(tab)}
              className={`relative px-[10px] py-[12px] text-[14px] font-medium transition-colors duration-[150ms] ${
                isActive
                  ? "text-white"
                  : "text-[rgba(255,255,255,0.55)] hover:text-[rgba(255,255,255,0.85)]"
              }`}
            >
              {tab}
              {isActive && (
                <span className="absolute inset-x-[10px] bottom-0 h-[2px] rounded-full bg-[#8c87ff]" />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        {active === "Transcript" ? (
          <TranscriptTab state={transcriptState} cues={cues} onSeek={onSeek} />
        ) : active === "Activity" ? (
          <CommentsEmptyState ownerFirstName={ownerFirstName} />
        ) : active === "Summary" ? (
          <p className="px-[16px] py-[16px] text-[13px] text-[rgba(255,255,255,0.5)]">
            No summary yet.
          </p>
        ) : (
          <p className="px-[16px] py-[16px] text-[13px] text-[rgba(255,255,255,0.5)]">
            No chapters yet.
          </p>
        )}
      </div>
    </div>
  );
}
