interface VideoUsageMeterProps {
  used?: number;
  total?: number;
}

/**
 * "18/25 videos" usage counter with a progress bar. The text styling is from
 * `.css-1yzfkad` (block, 14px/1.57, weight 400, colour bodyDimmed, centred).
 * The original `<meter value="72">` relied on `.upgrade-prompt_progressBar_wLa`
 * — an external class that could not be read — so the bar is reconstructed as a
 * track + fill div using the meter's own custom-property colours
 * (`--progress-bar-bar-color` = grey4 track, `--progress-bar-inner-color` =
 * blurpleDark fill). The fill width is the original `value="72"` (`w-[72%]`).
 */
export function VideoUsageMeter({
  used = 18,
  total = 25,
}: VideoUsageMeterProps) {
  return (
    <div className="px-[8px]">
      <div className="flex flex-col gap-[4px]">
        <span className="block text-center text-[14px] font-normal leading-[1.57] tracking-normal text-[hsla(224,5%,44%,1)]">
          {used}/{total} videos
        </span>
        <div className="h-[6px] w-full overflow-hidden rounded-full bg-[hsla(223,5%,73%,1)]">
          <div className="h-full w-[72%] rounded-full bg-[hsla(215.9,79.9%,41%,1)]" />
        </div>
      </div>
    </div>
  );
}
