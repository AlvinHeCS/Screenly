import { PauseIcon } from "./icons/PauseIcon";
import { RestartIcon } from "./icons/RestartIcon";
import { RewindTrimIcon } from "./icons/RewindTrimIcon";
import { StopSquareIcon } from "./icons/StopSquareIcon";
import { TrashIcon } from "./icons/TrashIcon";

/**
 * The recorder controls rail (Loom's extension `bubble-controls-*` markup),
 * shown beside the camera bubble. Captured in the pre-recording state: every
 * control is disabled and the timer shows the 5:00 limit.
 *
 * RESOLVED from `loom_style_guide.css` tokens + inline styles + ADS attrs:
 *  - surface `bgc:grey8` → hsla(228,6%,17%,1)
 *  - padding `pt/pb:small` (--lns-space-small) → py-[8px]; inline
 *    `padding-right:6px` → px-[6px]
 *  - `radius="250"` (--lns-radius-250 → --ds-radius-xxlarge) → rounded-[16px]
 *  - timer `color="bodyDimmed"` (dark) → hsla(217.5,4%,60.4%,1), bold, sans
 *  - buttons `color="disabledContent"` (dark) → hsla(225,5%,33%,1)
 *  - `size="3"` icons → 16px; divider spacer inline → w-[28px] h-[1px]
 *
 * RECONSTRUCTED (best-effort, not pixel-exact): the `bubble-controls-*`
 * structural classes and the ADS atomic classes (`_1e0c1o8l`, …) are generated
 * in Loom's extension bundle and are absent from `loom_style_guide.css`, so the
 * following are reasonable choices, not measured values:
 *  - vertical layout, 10px gaps, 28×28 buttons, drop shadow
 *  - the timer's focusable wrapper (tabIndex 0) and 12px font-size
 *  - the divider colour (faint white) between Cancel and Rewind
 *  - the empty End-button badge slot (`bubble-controls-vgmi1o`) is omitted
 * Page placement stays owned by RecorderOverlay, not the inline absolute pos.
 */
export function RecordingControls() {
  const buttonClass =
    "inline-flex h-[28px] w-[28px] cursor-not-allowed items-center justify-center bg-transparent p-0 text-[hsla(225,5%,33%,1)]";

  return (
    <div
      role="group"
      aria-label="Recorder controls"
      className="pointer-events-auto flex flex-col items-center gap-[10px] rounded-[16px] bg-[hsla(228,6%,17%,1)] px-[6px] py-[8px] text-white shadow-[0_6px_24px_rgba(0,0,0,0.25)]"
    >
      {/* End/record — the distinct primary control (`bubble-controls-1y9t1qa`),
          dimmed while pre-recording. */}
      <button
        type="button"
        disabled
        aria-label="End Recording"
        data-testid="start-finish-button"
        className={buttonClass}
      >
        <StopSquareIcon className="h-[16px] w-[16px]" />
      </button>

      {/* Limit countdown — focusable in the original (tabIndex 0); bodyDimmed bold text. */}
      <div
        tabIndex={0}
        className="cursor-default select-none rounded-[6px] font-[sans-serif] text-[12px] font-bold text-[hsla(217.5,4%,60.4%,1)] outline-none focus-visible:ring-1 focus-visible:ring-[hsla(0,0%,100%,0.3)]"
      >
        5:00
      </div>

      <button type="button" disabled aria-label="Pause Recording" className={buttonClass}>
        <PauseIcon className="h-[16px] w-[16px]" />
      </button>

      <button type="button" disabled aria-label="Restart Recording" className={buttonClass}>
        <RestartIcon className="h-[16px] w-[16px]" />
      </button>

      <button
        type="button"
        disabled
        aria-label="Cancel Recording"
        data-testid="cancel-button"
        className={buttonClass}
      >
        <TrashIcon className="h-[16px] w-[16px]" />
      </button>

      {/* Divider separating Rewind/Trim from the group above
          (`bubble-controls-13h9i8a`, 28×1px). */}
      <div className="h-[1px] w-[28px] bg-[hsla(0,0%,100%,0.1)]" />

      <button type="button" disabled aria-label="Rewind and Trim Recording" className={buttonClass}>
        <RewindTrimIcon className="h-[16px] w-[16px]" />
      </button>
    </div>
  );
}
