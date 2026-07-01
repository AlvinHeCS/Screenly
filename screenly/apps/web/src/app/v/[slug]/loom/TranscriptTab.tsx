import { TranscriptRow } from "./TranscriptRow";

export interface TranscriptCue {
  startMs: number;
  timestamp: string;
  text: string;
}

type TranscriptState = "loading" | "ready" | "unavailable" | "waiting";

interface TranscriptTabProps {
  state: TranscriptState;
  cues: TranscriptCue[];
  onSeek?: (startMs: number) => void;
}

/**
 * Transcript panel body: a small toolbar with Loom-style action buttons, then
 * phrase rows. Empty / loading / unavailable states mirror the watch-room's
 * transcript lifecycle.
 */
export function TranscriptTab({ state, cues, onSeek }: TranscriptTabProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white">
      <div className="flex shrink-0 items-center justify-between border-b border-[#f0f0f2] px-[24px] py-[14px]">
        <span className="text-[13px] font-semibold leading-[20px] text-[#6a6a73]">
          Transcript
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-[16px] py-[12px]">
        {state === "ready" && cues.length > 0 ? (
          <div className="flex flex-col">
            {cues.map((cue, i) => (
              <TranscriptRow
                key={i}
                timestamp={cue.timestamp}
                text={cue.text}
                startMs={cue.startMs}
                onSeek={onSeek}
              />
            ))}
          </div>
        ) : state === "unavailable" ? (
          <p className="rounded-[12px] bg-[#f7f7f8] px-[16px] py-[14px] text-[13px] leading-[20px] text-[#6a6a73]">
            Transcript unavailable for this video.
          </p>
        ) : state === "waiting" ? (
          <p className="rounded-[12px] bg-[#f7f7f8] px-[16px] py-[14px] text-[13px] leading-[20px] text-[#6a6a73]">
            The transcript appears once the recording finishes processing.
          </p>
        ) : (
          <div className="flex items-center gap-[10px] rounded-[12px] bg-[#f7f7f8] px-[16px] py-[14px] text-[13px] leading-[20px] text-[#6a6a73]">
            <span className="h-[16px] w-[16px] animate-spin rounded-full border-[2px] border-[#d9d9de] border-t-[#0c66e4]" />
            Generating transcript...
          </div>
        )}
      </div>
    </div>
  );
}
