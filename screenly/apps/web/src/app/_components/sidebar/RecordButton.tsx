import { RecordLogoIcon } from "./icons/RecordLogoIcon";

/**
 * The persistent "Record a video" call-to-action pinned to the bottom of the
 * sidebar (`record-button_persistentRecordButton_VJT`).
 *
 * The button styling is taken verbatim from the captured matched-CSS for that
 * class, with `var(--…)` resolved from the design-token table:
 *   background `--lns-color-blurple` → hsla(215.4,80%,47.65%,1)
 *   color `--lns-color-white` → #fff
 *   height 3rem (48px), max-width 12rem (192px)
 *   padding-left/right `--lns-space-medium` (16px)
 *   border-radius 0 / 0.75rem / 0.75rem / 0 (rounded right side only)
 *   box-shadow `--lns-shadow-large` → 0 6px 24px rgba(0,0,0,0.1)
 *   transition max-width `--navSidebarTransitionDuration` (300ms) ease
 * The outer `flex flexDirection:column grow:1 justify:flexEnd` wrapper and
 * `css-1i2wqfo` (relative, pt 8px, pb 12px, left -8px — pulls the button flush
 * to the sidebar's left edge) were resolved from `loom_style_guide.css`. The
 * `record-button_animate_vOd` keyframe was not recorded, so no entrance
 * animation is applied. The inner `navigation_root_mPG` flex row holds the
 * `css-1iwdxph` logo (max-width 24px) and the `css-1xi9xlt` label (14px/medium).
 */
export function RecordButton() {
  return (
    <div className="flex grow flex-col justify-end pl-0">
      {/* css-1i2wqfo */}
      <div className="relative left-[-8px] pb-[12px] pt-[8px]">
        <button
          id="LoomRecordAVideoButton"
          className="m-0 box-border flex h-[48px] max-w-[192px] cursor-pointer items-center overflow-hidden rounded-r-[12px] bg-[hsla(215.4,80%,47.65%,1)] px-[16px] text-white shadow-[0_6px_24px_rgba(0,0,0,0.1)] outline-[hsla(216.1,81.4%,60%,1)] transition-[max-width] duration-300"
        >
          {/* navigation_root_mPG */}
          <span className="flex items-center">
            {/* css-1iwdxph */}
            <span className="block max-w-[24px]">
              <RecordLogoIcon className="h-auto w-[24px]" />
            </span>
            {/* css-1w3ibup: 8px spacer */}
            <span aria-hidden className="block pr-[8px]" />
            {/* navigation_text_JrS > css-1xi9xlt */}
            <span className="block">
              <span className="block whitespace-nowrap text-[14px] font-medium leading-[1.57]">
                Record a video
              </span>
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}
