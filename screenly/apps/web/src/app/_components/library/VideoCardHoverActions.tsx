import { CheckIcon } from "./icons/CheckIcon";
import { MinusIcon } from "./icons/MinusIcon";
import { PinIcon } from "./icons/PinIcon";
import { LinkIcon } from "./icons/LinkIcon";
import { KebabIcon } from "./icons/KebabIcon";

interface VideoCardHoverActionsProps {
  videoId: string;
  title: string;
}

/**
 * Contents of the dark hover overlay shown over a card thumbnail. Two clusters:
 * a top-left bulk-select checkbox and a top-right Pin / Copy-link / More action
 * group. All buttons are decorative (server component — no handlers).
 *
 * Colours here resolve in DARK theme (the overlay carries
 * `data-color-mode="dark"`): body = hsla(225,4.3%,81.6%,1),
 * hover bg = hsla(240,12.6%,83%,0.07), active bg = hsla(236,36.6%,92%,0.12),
 * surface (icon fill on checked box) = hsla(240,3%,12.5%,1).
 *
 * The checkbox reproduces the `.css-hz2860 ~ .CheckboxBox` rules with
 * peer-* variants: both icons hidden by default, IconCheck on :checked,
 * IconMinus on :indeterminate, and the box fills with body colour when
 * checked/indeterminate.
 */
export function VideoCardHoverActions({
  videoId,
  title,
}: VideoCardHoverActionsProps) {
  return (
    <>
      {/* css-jxc24p — absolute; top 16px; left 16px; z-index 2 (bulk-select cluster). */}
      <div className="absolute left-[16px] top-[16px] z-[2]">
        {/* css-7zhfhb — NOT in style guide; RECONSTRUCTED from direction="column": a flex column. */}
        <div className="flex flex-col">
          {/* css-1nmhbsv — block; margin-bottom 4px; cursor pointer (the label). */}
          <label
            htmlFor={`bulk-action-${videoId}`}
            className="mb-[4px] block cursor-pointer"
          >
            {/* srOnly — visually hidden. */}
            <span className="absolute -m-px h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]">
              Add {title} for bulk actions
            </span>
          </label>

          {/* css-kvu093 — block; position relative (checkbox wrapper). */}
          <div className="relative block">
            {/* css-hz2860 — the real input: absolute, h/w 100%, margin 0, opacity 0, cursor pointer. */}
            <input
              type="checkbox"
              aria-checked="false"
              id={`bulk-action-${videoId}`}
              className="peer absolute m-0 h-full w-full cursor-pointer opacity-0"
            />
            {/* CheckboxBox css-1ypw23w — 18×18; radius 4px; flex center; border 2px solid body;
                fills with body colour on checked/indeterminate (peer-* variants). */}
            <span className="CheckboxBox flex h-[18px] w-[18px] cursor-pointer select-none items-center justify-center rounded-[4px] border-2 border-solid border-[hsla(225,4.3%,81.6%,1)] peer-checked:bg-[hsla(225,4.3%,81.6%,1)] peer-indeterminate:bg-[hsla(225,4.3%,81.6%,1)]">
              {/* IconMinus — hidden by default; shown only when indeterminate. */}
              <MinusIcon className="hidden h-[2px] w-[12px] text-[hsla(240,3%,12.5%,1)] peer-indeterminate:block" />
              {/* IconCheck — hidden by default; shown only when checked. */}
              <CheckIcon className="hidden h-[9px] w-[12px] text-[hsla(240,3%,12.5%,1)] peer-checked:block" />
            </span>
          </div>
        </div>
        {/* trailing srOnly live region from source. */}
        <span
          aria-atomic="true"
          aria-live="polite"
          className="absolute -m-px h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]"
        />
      </div>

      {/* css-1j21e04 — absolute; top 16px; right 16px (action buttons cluster). */}
      <div className="absolute right-[16px] top-[16px] z-[2]">
        {/* css-128ernj — grid; items-center; justify-start; gap 8px; grid-auto-flow row. */}
        <div className="grid grid-flow-row items-center justify-start gap-[8px]">
          {/* video-card_videoCardButton_pWs — RECONSTRUCTED: button wrapper. */}
          <div>
            {/* css-nez7wg — inline-block, vertical-align middle; tabIndex -1. */}
            <div className="inline-block align-middle" tabIndex={-1}>
              {/* css-1c39lxe — 24px icon button; rounded 4px; transparent bg; hover/active bg (DARK theme). */}
              <button
                type="button"
                aria-label="Pin button"
                className="relative inline-flex h-[24px] w-[24px] cursor-pointer items-center justify-center rounded-[4px] border-none bg-transparent p-0 align-middle outline outline-1 outline-transparent transition-colors duration-[600ms] hover:bg-[hsla(240,12.6%,83%,0.07)] hover:duration-[300ms] active:bg-[hsla(236,36.6%,92%,0.12)]"
              >
                {/* css-1y53iih (size 2.25) > css-15wwpue (size 2) — color body; the Pin
                    icon resolves to 16×16 (css-15wwpue's [data-testid] width wins by
                    equal specificity + later source order over css-1y53iih's 18px). */}
                <span className="block text-[hsla(225,4.3%,81.6%,1)]">
                  <span className="block">
                    <PinIcon className="block h-[16px] w-[16px] p-[8%]" />
                  </span>
                </span>
              </button>
            </div>
          </div>

          {/* video-card_videoCardButton_pWs role="presentation" — Copy-link button. */}
          <div role="presentation">
            <div className="inline-block align-middle" tabIndex={-1}>
              <button
                type="button"
                aria-label={`Copy link to ${title}`}
                className="relative inline-flex h-[24px] w-[24px] cursor-pointer items-center justify-center rounded-[4px] border-none bg-transparent p-0 align-middle outline outline-1 outline-transparent transition-colors duration-[600ms] hover:bg-[hsla(240,12.6%,83%,0.07)] hover:duration-[300ms] active:bg-[hsla(236,36.6%,92%,0.12)]"
              >
                <span className="block text-[hsla(225,4.3%,81.6%,1)]">
                  <LinkIcon className="block h-[18px] w-[18px] p-[8%]" />
                </span>
              </button>
              {/* srOnly live region from source. */}
              <span
                role="status"
                aria-live="polite"
                className="absolute -m-px h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]"
              >
                Copy link
              </span>
            </div>
          </div>

          {/* More/kebab — source wraps it in two bare divs then the presentation wrapper. */}
          <div>
            <div>
              <div role="presentation">
                <div className="inline-block align-middle" tabIndex={-1}>
                  <button
                    type="button"
                    aria-label="More actions"
                    role="button"
                    aria-haspopup="true"
                    data-toggle="true"
                    aria-expanded="false"
                    className="relative inline-flex h-[24px] w-[24px] cursor-pointer items-center justify-center rounded-[4px] border-none bg-transparent p-0 align-middle outline outline-1 outline-transparent transition-colors duration-[600ms] hover:bg-[hsla(240,12.6%,83%,0.07)] hover:duration-[300ms] active:bg-[hsla(236,36.6%,92%,0.12)]"
                  >
                    <span className="block text-[hsla(225,4.3%,81.6%,1)]">
                      <KebabIcon className="block h-[18px] w-[18px] p-[8%]" />
                    </span>
                  </button>
                </div>
              </div>
            </div>
            <div />
          </div>
        </div>
      </div>
    </>
  );
}
