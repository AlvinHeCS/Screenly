/**
 * Loom Library title block (server component) — the header SECTION (css-1c4s23w
 * B): the "Library" eyebrow + "Videos" heading on the left, then the
 * css-1t2kzyo spacer.
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
      <div className="grid grid-flow-row items-center justify-stretch gap-[16px]">
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

      </div>

      {/* css-1t2kzyo — 16px top-pad spacer (sibling of css-1men5lx, closes the header section). */}
      <div className="block pt-[16px] align-middle" />
    </div>
  );
}
