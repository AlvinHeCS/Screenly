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
 * Transcript panel body: a header row with a (disabled) Download action, then
 * the list of phrase rows. Empty / loading / unavailable states mirror the
 * watch-room's transcript lifecycle.
 */
export function TranscriptTab({ state, cues, onSeek }: TranscriptTabProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center justify-end border-b border-[rgba(255,255,255,0.1)] px-[16px] py-[10px]">
        <button
          type="button"
          disabled
          className="cursor-not-allowed text-[13px] font-medium text-[rgba(255,255,255,0.35)]"
        >
          Download
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-[8px] py-[8px]">
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
          <p className="px-[8px] py-[8px] text-[13px] text-[rgba(255,255,255,0.5)]">
            Transcript unavailable for this video.
          </p>
        ) : state === "waiting" ? (
          <p className="px-[8px] py-[8px] text-[13px] text-[rgba(255,255,255,0.5)]">
            The transcript appears once the recording finishes processing.
          </p>
        ) : (
          <div className="flex items-center gap-[10px] px-[8px] py-[8px] text-[13px] text-[rgba(255,255,255,0.7)]">
            <span className="h-[16px] w-[16px] animate-spin rounded-full border-[2px] border-[rgba(255,255,255,0.2)] border-t-white" />
            Generating transcript…
          </div>
        )}
      </div>
    </div>
  );
}
