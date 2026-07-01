/**
 * The Loom "Videos" library header row (css-1jds50g): an H2 "Videos" heading on
 * the left.
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

    </div>
  );
}
