import type { LibraryVideo } from "./types";
import { LibraryFilterBar } from "./LibraryFilterBar";
import { LibraryHeader } from "./LibraryHeader";
import { LibraryTabs } from "./LibraryTabs";
import { ProcessingWatcher } from "./ProcessingWatcher";
import { VideoGrid } from "./VideoGrid";

/**
 * Composition root for the Loom Library page body — the inner content of
 * `<main id="mainContent">`. The `<main>`, `Header`, and `Sidebar` are page
 * chrome owned by the route's `page.tsx`; `--pagePadding` (read by the tab bar's
 * negative-margin bleed in `LibraryTabs`) is also defined on that `<main>`.
 *
 * Reproduces the source section chain as flat children, with each leaf
 * component owning EXACTLY its own section wrapper so nothing is rendered twice:
 *   css-1c4s23w (A)  decorative spacer row (css-o4n90g)
 *   <LibraryHeader/> owns css-1c4s23w (B): css-1men5lx + css-1t2kzyo spacer
 *   css-178a3ox      8px spacer
 *   <LibraryTabs/>   owns css-1p06xqf: the tablist + the "{n} videos" count
 *   css-1c4s23w (D)  grid section: css-1jds50g header row (= LibraryFilterBar),
 *                    a css-13bsqo spacer, then VideoGrid. (The source insights
 *                    banner that sat between the spacer and the grid is omitted.)
 *
 * css-1c4s23w (A and D) is one of the four Emotion classes the style guide could
 * not record; reconstructed as a plain `block` section wrapper.
 */
interface LibraryViewProps {
  videos: LibraryVideo[];
  searchQuery?: string;
}

export function LibraryView({ videos, searchQuery }: LibraryViewProps) {
  // Videos still encoding on Cloudflare — polled client-side so they flip to
  // Ready without a manual refresh (dev fallback for the Stream webhook).
  const pendingIds = videos
    .filter((v) => v.status === "UPLOADING" || v.status === "PROCESSING")
    .map((v) => v.id);

  return (
    <>
      <ProcessingWatcher idsKey={pendingIds.join(",")} />
      {/* css-1c4s23w (A) — reconstructed block section wrapper; decorative spacer row. */}
      <div className="block">
        <div>
          {/* css-o4n90g */}
          <div className="grid grid-flow-row items-center justify-start gap-[16px]" />
        </div>
      </div>

      <LibraryHeader />

      {/* css-178a3ox — 8px top-pad spacer */}
      <div className="block pt-[8px] align-middle" />

      <LibraryTabs videoCount={videos.length} />

      {/* css-1c4s23w (D) — reconstructed block section wrapper; the grid section. */}
      <div className="block">
        <LibraryFilterBar />
        {/* css-13bsqo — 16px spacer between the header row and the grid. */}
        <div className="block pb-[16px] align-middle" />
        <VideoGrid videos={videos} searchQuery={searchQuery} />
      </div>
    </>
  );
}
