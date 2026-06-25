interface LibraryTabsProps {
  videoCount: number;
}

/**
 * The Library tabs bar: a horizontal tab strip (Videos / Screenshots / Archive)
 * with a "{videoCount} videos" count pinned to the top-right.
 *
 * Reconstructed from the recorded Emotion classes in `loom_style_guide.css`:
 * the relatively-positioned wrapper `css-1p06xqf` (bottom border + 40px margin),
 * the negative-margin bleed `css-51kc9t` (margin 0 calc(-1 * var(--pagePadding))),
 * the scrollable `css-145mif8` tablist (it sets `--activeIndicatorHeight: 3px`,
 * which the tab `::after` underline reads, plus a trailing `::after` page-padding
 * spacer), the active tab `css-iodqv7` (body colour + blue `::after` underline =
 * --lns-color-primary) and the unselected tab `css-1ve0qel` (dimmed colour, and
 * an `::after` track with NO background so its underline is invisible). The count
 * lives in `css-nqbqdt` (absolute, top 8px, right 0) with text `css-1qbegcj`
 * (14px / 400 / bodyDimmed) and an empty `css-1ivmu3u` spacer (pb 12px).
 *
 * `var(--pagePadding)` is an ancestor-set custom property from the page layout,
 * so it is preserved verbatim as a CSS var rather than resolved to px.
 */
export function LibraryTabs({ videoCount }: LibraryTabsProps) {
  return (
    // css-1p06xqf
    <div className="relative mb-[40px] border-b border-b-[hsla(225.5,57%,10%,0.14)]">
      {/* css-51kc9t */}
      <div className="mx-[calc(-1*var(--pagePadding))] my-0">
        {/* css-145mif8 */}
        <div
          role="tablist"
          aria-label="Library"
          className="flex gap-[16px] overflow-auto pl-[var(--pagePadding)] [--activeIndicatorHeight:3px] [scrollbar-width:none] after:w-[var(--pagePadding)] after:shrink-0 after:content-[''] [&::-webkit-scrollbar]:hidden"
        >
          {/* css-iodqv7 (active tab) */}
          <button
            type="button"
            role="tab"
            aria-selected={true}
            tabIndex={0}
            className="relative inline-flex shrink-0 cursor-pointer appearance-none items-center justify-center whitespace-nowrap rounded-[8px] border-0 bg-transparent px-0 pb-[11px] pt-0 align-middle font-sans text-[14px] font-[500] leading-[1.57] text-[hsla(228,6%,17%,1)] no-underline transition-[color] duration-[0.6s] after:absolute after:bottom-0 after:h-[var(--activeIndicatorHeight)] after:w-full after:rounded-none after:bg-[hsla(215.4,80%,47.65%,1)] after:content-[''] hover:text-[hsla(228,6%,17%,1)] focus:outline focus:outline-1 focus:outline-transparent focus-visible:shadow-[inset_0_0_0_2px_hsla(216.1,81.4%,60%,1)]"
          >
            <a aria-current="page" tabIndex={-1} href="/looms/videos">
              {/* pt:small pb:small block */}
              <span className="block pb-[8px] pt-[8px]">Videos</span>
            </a>
          </button>

          {/* css-1ve0qel (unselected tab) */}
          <button
            type="button"
            role="tab"
            aria-selected={false}
            tabIndex={-1}
            className="relative inline-flex shrink-0 cursor-pointer appearance-none items-center justify-center whitespace-nowrap rounded-[8px] border-0 bg-transparent px-0 pb-[11px] pt-0 align-middle font-sans text-[14px] font-[500] leading-[1.57] text-[hsla(224,5%,44%,1)] no-underline transition-[color] duration-[0.6s] after:absolute after:bottom-0 after:h-[var(--activeIndicatorHeight)] after:w-full after:rounded-none after:content-[''] hover:text-[hsla(228,6%,17%,1)] focus:outline focus:outline-1 focus:outline-transparent focus-visible:shadow-[inset_0_0_0_2px_hsla(216.1,81.4%,60%,1)]"
          >
            <a tabIndex={-1} href="/looms/screenshots">
              {/* pt:small pb:small block */}
              <span className="block pb-[8px] pt-[8px]">Screenshots</span>
            </a>
          </button>

          {/* css-1ve0qel (unselected tab) */}
          <button
            type="button"
            role="tab"
            aria-selected={false}
            tabIndex={-1}
            className="relative inline-flex shrink-0 cursor-pointer appearance-none items-center justify-center whitespace-nowrap rounded-[8px] border-0 bg-transparent px-0 pb-[11px] pt-0 align-middle font-sans text-[14px] font-[500] leading-[1.57] text-[hsla(224,5%,44%,1)] no-underline transition-[color] duration-[0.6s] after:absolute after:bottom-0 after:h-[var(--activeIndicatorHeight)] after:w-full after:rounded-none after:content-[''] hover:text-[hsla(228,6%,17%,1)] focus:outline focus:outline-1 focus:outline-transparent focus-visible:shadow-[inset_0_0_0_2px_hsla(216.1,81.4%,60%,1)]"
          >
            <a tabIndex={-1} href="/looms/archive">
              {/* pt:small pb:small block */}
              <span className="block pb-[8px] pt-[8px]">Archive</span>
            </a>
          </button>
        </div>
      </div>

      {/* css-nqbqdt */}
      <div className="absolute right-0 top-[8px]">
        {/* css-1qbegcj */}
        <span className="block text-[14px] font-[400] leading-[1.57] tracking-normal text-[hsla(224,5%,44%,1)] [font-feature-settings:'normal']">
          {videoCount} videos
        </span>
        {/* css-1ivmu3u */}
        <div className="block pb-[12px] align-middle" />
      </div>
    </div>
  );
}
