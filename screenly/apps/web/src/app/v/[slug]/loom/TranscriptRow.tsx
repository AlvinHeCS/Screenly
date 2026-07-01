interface TranscriptRowProps {
  timestamp: string;
  text: string;
  startMs: number;
  onSeek?: (startMs: number) => void;
}

/**
 * One transcript phrase: blue timestamp (click to seek the player), spoken text,
 * and a copy-snippet button revealed on hover.
 */
export function TranscriptRow({
  timestamp,
  text,
  startMs,
  onSeek,
}: TranscriptRowProps) {
  return (
    <div className="group flex gap-[12px] rounded-[10px] px-[8px] py-[9px] transition-colors duration-[150ms] hover:bg-[#f7f7f8]">
      <button
        type="button"
        onClick={() => onSeek?.(startMs)}
        aria-label={`Jump to ${timestamp}`}
        className="shrink-0 cursor-pointer pt-[1px] text-[13px] font-semibold leading-[20px] text-[#0c66e4] transition-colors duration-[150ms] hover:underline focus-visible:underline focus-visible:outline-none"
      >
        {timestamp}
      </button>
      <p className="min-w-0 flex-1 text-[14px] font-normal leading-[21px] text-[#24242b]">
        {text}
      </p>
    </div>
  );
}
