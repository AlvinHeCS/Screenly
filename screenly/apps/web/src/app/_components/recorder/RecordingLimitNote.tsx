/**
 * Caption under the Start button (`.css-27rl09`: body-sm 12px / 1.5, weight
 * book, colour bodyDimmed `hsla(224,5%,44%,1)`). No duration cap is enforced
 * yet, so the original "5 min recording limit" copy would be misleading.
 */
export function RecordingLimitNote() {
  return (
    <p className="text-center text-[12px] font-normal leading-[1.5] text-[hsla(224,5%,44%,1)]">
      Records your screen and camera
    </p>
  );
}
