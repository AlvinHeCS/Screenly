import { CopySnippetIcon } from "./icons/CopySnippetIcon";

interface TranscriptRowProps {
  timestamp: string;
  text: string;
  startMs: number;
  onSeek?: (startMs: number) => void;
}

/**
 * One transcript phrase: blurple timestamp (click to seek the player), the
 * spoken text, and a copy-snippet button revealed on hover. Mirrors Loom's
 * `phrase-list-item_row`.
 */
export function TranscriptRow({
  timestamp,
  text,
  startMs,
  onSeek,
}: TranscriptRowProps) {
  return (
    <div className="group flex gap-[12px] rounded-[8px] px-[8px] py-[8px] transition-colors duration-[150ms] hover:bg-[rgba(255,255,255,0.06)]">
      <button
        type="button"
        onClick={() => onSeek?.(startMs)}
        aria-label={`Jump to ${timestamp}`}
        className="shrink-0 cursor-pointer pt-[1px] text-[13px] font-normal leading-[20px] text-[#8c87ff] transition-colors duration-[150ms] hover:underline focus-visible:underline focus-visible:outline-none"
      >
        {timestamp}
      </button>
      <p className="min-w-0 flex-1 text-[14px] font-normal leading-[20px] text-[rgba(255,255,255,0.88)]">
        {text}
      </p>
      <button
        type="button"
        aria-label="Copy snippet"
        className="shrink-0 self-start pt-[2px] text-[rgba(255,255,255,0.5)] opacity-0 transition-opacity duration-[150ms] hover:text-white group-hover:opacity-100"
      >
        <CopySnippetIcon className="h-[14px] w-[14px]" />
      </button>
    </div>
  );
}
