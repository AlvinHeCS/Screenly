interface UsageMeterProps {
  label: string;
}

/**
 * The "20/25 videos" usage label + progress bar from the navbar upgrade prompt.
 * The fill is fixed at the scrape's 80% (Tailwind can't take a runtime width
 * without an inline style); wire it to real usage when the data exists.
 * Track color is Loom "grey4", fill is "blurpleDark" — both inferred.
 */
export function UsageMeter({ label }: UsageMeterProps) {
  return (
    <div className="hidden flex-col gap-[4px] sm:flex">
      <span className="whitespace-nowrap text-[13px] font-normal text-[#6a6a73]">
        {label}
      </span>
      <div className="h-[6px] w-[80px] overflow-hidden rounded-full bg-[#dfdfe4]">
        <div className="h-full w-[80%] rounded-full bg-[#4b46d9]" />
      </div>
    </div>
  );
}
