import { ChevronDownIcon } from "./icons/ChevronDownIcon";

/**
 * The Loom "Videos" library header row (css-1jds50g): an H2 "Videos" heading on
 * the left and three decorative filter controls ("Video type", "Upload date",
 * and a "Sort by / Newest to Oldest" control) on the right, each ending in a
 * ChevronDownIcon.
 *
 * This component owns ONLY the css-1jds50g header row. The section wrapper
 * (css-1c4s23w) and the trailing css-13bsqo spacer are owned by `LibraryView`,
 * matching the source DOM where css-13bsqo, the insights banner and the video
 * `<ul>` are flat SIBLINGS of css-1jds50g (not nested inside it).
 *
 * Resolved from `loom_style_guide.css`: css-1jds50g (grid, items-center,
 * justify-between, gap 10px, grid-flow-col), the title cell css-2m39qo, the
 * `css-jm1sr2` heading (18px / 1.44 / -0.2px / 653), the `css-13yqqo` /
 * `css-1xt45hq` flex groups (gap 16px / 8px), the button base `css-1delz3x`
 * (32px tall, 12px horizontal padding, 14px / 500, 6px radius, buttonBorder,
 * body colour, focusRing), the icon padding `css-1puqwlo` (pl 6px), and the icon
 * box `css-svtqel` (block, 16x16 child, 8% svg padding).
 *
 * SOURCE NESTING (verified against the HTML): css-13yqqo wraps ONLY css-1xt45hq
 * (the "Video type" group); the "Upload date" wrapper and the css-cssveg "Sort
 * by" wrapper are SIBLINGS of css-13yqqo, directly under the reconstructed
 * my-library_scrollingButtonsBar_UvQ flex row. The Emotion classes css-je45kk /
 * css-vgmi1o and the module classes scrollingButtonsBar / filter-bar_filterButton
 * are not in the style guide and are reconstructed faithfully.
 *
 * Server component: no 'use client', no handlers — buttons are decorative.
 */
export function LibraryFilterBar() {
  return (
    // css-1jds50g (justify-between + grid-flow-col)
    <div className="grid grid-flow-col items-center justify-between gap-[10px]">
      {/* css-2m39qo */}
      <div className="grid grid-flow-col items-center justify-between">
        {/* css-jm1sr2 (dropped non-standard font-weight / font-family attrs) */}
        <h2 className="block text-[18px] font-[653] leading-[1.44] tracking-[-0.2px]">
          Videos
        </h2>
      </div>

      {/* my-library_scrollingButtonsBar_UvQ — reconstructed: 16px-gap flex row holding
          css-13yqqo, the Upload-date wrapper and css-cssveg as three flat siblings. */}
      <div className="flex flex-wrap items-center gap-[16px]">
        {/* css-13yqqo (had wrap="wrap") — wraps ONLY the Video type group */}
        <div className="flex flex-wrap items-center gap-[16px]">
          {/* css-1xt45hq (had wrap="wrap") */}
          <div className="flex flex-wrap items-center gap-[8px]">
            {/* css-je45kk (reconstructed: plain wrapper, no styles) */}
            <div>
              {/* unclassed structural wrapper */}
              <div>
                {/* filter-bar_filterButton_EEC (reconstructed no-op) css-1delz3x; had width="auto" */}
                <button
                  type="button"
                  aria-label="Video type"
                  aria-expanded="false"
                  aria-haspopup="dialog"
                  className="inline-flex h-[32px] min-w-[32px] cursor-pointer appearance-none items-center justify-center whitespace-nowrap rounded-[6px] border border-[hsla(252,13%,46%,0.25)] bg-transparent px-[12px] py-0 align-middle text-[14px] font-medium leading-[1.57] tracking-normal text-[hsla(228,6%,17%,1)] no-underline transition-[background,border-color] duration-[600ms] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[1px] focus-visible:outline-[hsla(216.1,81.4%,60%,1)]"
                >
                  {/* css-vgmi1o (reconstructed: plain label span) */}
                  <span>Video type</span>
                  {/* css-1puqwlo */}
                  <span className="pl-[6px]">
                    {/* css-svtqel (had color="currentColor" size="2") */}
                    <span className="block text-current">
                      {/* original: <span aria-hidden="true" data-testid="ads-refreshed-icon"><svg viewBox="-2 -2 16 16">...</svg></span> */}
                      <ChevronDownIcon className="block h-[16px] w-[16px] p-[8%]" />
                    </span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* "Upload date" wrapper — sibling of css-13yqqo */}
        <div>
          {/* css-1delz3x; had width="auto" (no aria-label in source) */}
          <button
            type="button"
            className="inline-flex h-[32px] min-w-[32px] cursor-pointer appearance-none items-center justify-center whitespace-nowrap rounded-[6px] border border-[hsla(252,13%,46%,0.25)] bg-transparent px-[12px] py-0 align-middle text-[14px] font-medium leading-[1.57] tracking-normal text-[hsla(228,6%,17%,1)] no-underline transition-[background,border-color] duration-[600ms] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[1px] focus-visible:outline-[hsla(216.1,81.4%,60%,1)]"
          >
            {/* css-vgmi1o (reconstructed) */}
            <span>Upload date</span>
            {/* css-1puqwlo */}
            <span className="pl-[6px]">
              {/* css-svtqel */}
              <span className="block text-current">
                <ChevronDownIcon className="block h-[16px] w-[16px] p-[8%]" />
              </span>
            </span>
          </button>
        </div>

        {/* css-cssveg — sibling of css-13yqqo */}
        <div className="relative">
          {/* unclassed presentation wrapper (source: downshift listbox toggle) */}
          {/* eslint-disable-next-line jsx-a11y/role-supports-aria-props -- faithful copy of source markup */}
          <div
            role="presentation"
            aria-haspopup="listbox"
            aria-labelledby="downshift-1-label"
          >
            {/* unclassed structural wrapper */}
            <div>
              {/* css-1delz3x; had width="auto" */}
              <button
                type="button"
                role="button"
                aria-label="Sort by, selected value is Newest to Oldest"
                aria-haspopup="true"
                data-toggle="true"
                aria-expanded="false"
                className="inline-flex h-[32px] min-w-[32px] cursor-pointer appearance-none items-center justify-center whitespace-nowrap rounded-[6px] border border-[hsla(252,13%,46%,0.25)] bg-transparent px-[12px] py-0 align-middle text-[14px] font-medium leading-[1.57] tracking-normal text-[hsla(228,6%,17%,1)] no-underline transition-[background,border-color] duration-[600ms] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[1px] focus-visible:outline-[hsla(216.1,81.4%,60%,1)]"
              >
                {/* css-vgmi1o (reconstructed) */}
                <span>Newest to Oldest</span>
                {/* css-1puqwlo */}
                <span className="pl-[6px]">
                  {/* css-svtqel */}
                  <span className="block text-current">
                    <ChevronDownIcon className="block h-[16px] w-[16px] p-[8%]" />
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
