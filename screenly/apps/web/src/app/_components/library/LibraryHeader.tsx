import { ChevronDownIcon } from "./icons/ChevronDownIcon";

/**
 * Loom Library title block (server component) — the header SECTION (css-1c4s23w
 * B): the "Library" eyebrow + "Videos" heading on the left, the "New folder" /
 * "New video" actions on the right, then the css-1t2kzyo spacer. All buttons are
 * decorative.
 *
 * Most classes resolve straight out of `loom_style_guide.css` (the `css-*`
 * Emotion classes + `--lns-*` tokens, all on an 8px unit):
 *   css-1men5lx  → grid header (row → column at 31em / 496px, 16px gap)
 *   css-1codye8  → 14px / weight 653 / bodyDimmed eyebrow
 *   css-1xtlft5  → 4px bottom-pad spacer between eyebrow and heading
 *   css-1kb3xog  → 32px / weight 653 / -0.5px tracking heading
 *   css-136pr01  → 8px-gap button group (1fr 1fr → auto auto at 31em / 496px)
 *   css-fc8zw5   → secondary "New folder" button (36px, 1px buttonBorder)
 *   css-1aagpgw  → primary "New video" button (36px, full width)
 *   css-16fyfbd  → 6px left-pad chevron wrapper
 *   css-ilx5r9   → 24px icon box, svg gets 8% internal padding
 *   css-1t2kzyo  → 16px top-pad spacer closing the header section
 *
 * The source media queries for css-1men5lx / css-136pr01 are at `min-width: 31em`
 * (= 496px), which is NOT a Tailwind default step, so they map to `min-[31em]:`
 * rather than `sm:` (640px).
 *
 * Three of the four Emotion classes the style guide could not record are
 * RECONSTRUCTED here and annotated inline:
 *   css-1c4s23w  → reconstructed as a plain `block` section wrapper (width is
 *                  governed by the page `<main>`).
 *   css-vgmi1o   → reconstructed as a bare inline `<span>` label (no own
 *                  typography; the button supplies font).
 *   css-1aagpgw  background → the source gradient/bg-color was stripped to
 *                  empty in the style guide; the primary CTA fill is
 *                  reconstructed as Loom brand blue `--lns-color-blue`.
 *
 * The Uppy upload dashboard that sits between the two buttons in the source is
 * the hidden third-party widget and is intentionally not rendered.
 */
export function LibraryHeader() {
  return (
    // css-1c4s23w (reconstructed: block section wrapper)
    <div className="block">
      {/* css-1men5lx */}
      <div className="min-[31em]:grid-flow-col min-[31em]:justify-between grid grid-flow-row items-center justify-stretch gap-[16px]">
        {/* --- left: title block --- */}
        <div>
          {/* css-1codye8 (source color="bodyDimmed" font-weight="bold" font-family="sans-serif" — encoded by classes) */}
          <h2 className="block text-[14px] font-[653] leading-[1.57] text-[hsla(224,5%,44%,1)]">
            Library
          </h2>
          {/* css-1xtlft5 — empty spacer */}
          <div className="block pb-[4px] align-middle" />
          {/* css-1kb3xog (source font-weight="bold" font-family="sans-serif" — encoded by classes) */}
          <h1 className="block text-[32px] font-[653] leading-[1.125] tracking-[-0.5px]">
            Videos
          </h1>
        </div>

        {/* --- right: actions --- */}
        <div className="relative">
          {/* css-136pr01 */}
          <div className="min-[31em]:grid-cols-[auto_auto] grid grid-cols-[1fr_1fr] items-center justify-start gap-[8px]">
            {/* css-fc8zw5 — "New folder" (source width="auto" — encoded by min-w) */}
            <button
              type="button"
              id="my-library-new-folder-button"
              className="inline-flex h-[36px] min-w-[36px] cursor-pointer items-center justify-center whitespace-nowrap rounded-[8px] border border-[hsla(252,13%,46%,0.25)] bg-transparent px-[12px] text-[14px] font-[500] leading-[1.57] text-[hsla(228,6%,17%,1)] transition-[background,border-color] duration-[600ms] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[hsla(216.1,81.4%,60%,1)]"
            >
              {/* css-vgmi1o (reconstructed: bare inline label) */}
              <span className="inline">New folder</span>
            </button>

            {/* Uppy upload dashboard intentionally not rendered here */}

            {/* css-1aagpgw — "New video" primary (source width="full" role="button" data-toggle="true" — width encoded by w-full; role/data-toggle dropped, aria-* kept) */}
            {/* bg reconstructed: --lns-color-blue (source gradient/bg-color stripped in style guide) */}
            <button
              type="button"
              aria-label=""
              aria-haspopup="true"
              aria-expanded="false"
              className="flex h-[36px] w-full cursor-pointer items-center justify-center whitespace-nowrap rounded-[8px] border-none bg-[hsla(215.4,80%,47.65%,1)] px-[12px] text-[14px] font-[500] leading-[1.57] text-[hsla(0,0%,100%,1)] transition-[background,border-color] duration-[600ms] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[hsla(216.1,81.4%,60%,1)]"
            >
              {/* css-vgmi1o (reconstructed: bare inline label) */}
              <span className="inline">New video</span>
              {/* css-16fyfbd */}
              <span className="pl-[6px]">
                {/* css-ilx5r9 (source color="currentColor" size="3" non-DOM attrs — dropped) */}
                <span className="block size-[24px] text-current">
                  <span
                    aria-hidden="true"
                    data-testid="ads-refreshed-icon"
                    className="block size-full"
                  >
                    <ChevronDownIcon className="block size-full p-[8%]" />
                  </span>
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* css-1t2kzyo — 16px top-pad spacer (sibling of css-1men5lx, closes the header section). */}
      <div className="block pt-[16px] align-middle" />
    </div>
  );
}
