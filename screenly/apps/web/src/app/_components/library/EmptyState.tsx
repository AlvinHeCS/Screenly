/**
 * Empty state for the Loom Library grid, shown when there are no videos or no
 * search results.
 *
 * There is NO empty-state markup in the source HTML (the captured page had 18
 * videos), so this is designed to be consistent with the page tokens from
 * `loom_style_guide.css`:
 *   - radius 8px        = `--lns-radius-100` / `--lns-radius-medium`
 *   - padding 24/40px   = `--lns-space-large` / `--lns-space-xlarge`
 *   - gap 8px           = `--lns-space-small`
 *   - border            = `--lns-color-border` literal hsla(225.5,57%,10%,0.14)
 *   - title  18px/1.44, weight 653 (bold), tracking -0.2px, grey8 body text
 *   - body   14px/1.57, weight 400 (regular), grey6 bodyDimmed text
 *
 * Server component: no handlers, no state.
 */
export function EmptyState({ searchQuery }: { searchQuery?: string }) {
  const hasSearchQuery = Boolean(searchQuery?.trim());

  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center gap-[8px] rounded-[8px] border border-dashed border-[hsla(225.5,57%,10%,0.14)] px-[24px] py-[40px] text-center">
      <h3 className="block text-[18px] font-[653] leading-[1.44] tracking-[-0.2px] text-[hsla(228,6%,17%,1)]">
        {hasSearchQuery ? "No matching videos" : "No videos yet"}
      </h3>
      <p className="block text-[14px] font-[400] leading-[1.57] text-[hsla(224,5%,44%,1)]">
        {hasSearchQuery
          ? "Try searching for a different title, owner, or sharing status."
          : "Record or upload a video and it will show up here."}
      </p>
    </div>
  );
}
