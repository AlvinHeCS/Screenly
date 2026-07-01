import type { LibraryVideo } from "./types";
import { EmptyState } from "./EmptyState";
import { VideoCard } from "./VideoCard";

/**
 * The responsive card grid for the Loom Library page.
 *
 * Renders the `my-library_ul_tWu` `<ul>` — an UNREADABLE module class (not in
 * `loom_style_guide.css`). Reconstructed as Loom's known library grid: a
 * responsive CSS grid of fixed-min-width cards using
 * `repeat(auto-fill, minmax(260px, 1fr))` columns, a 16px (`--lns-space-medium`)
 * gap, and zero list styling. Each video maps to a bare `<li>` (no class in
 * source) wrapping a `<VideoCard>` (built separately).
 *
 * When `videos` is empty, renders `<EmptyState />` instead of the `<ul>`.
 */
interface VideoGridProps {
  videos: LibraryVideo[];
  searchQuery?: string;
}

export function VideoGrid({ videos, searchQuery }: VideoGridProps) {
  if (videos.length === 0) {
    return <EmptyState searchQuery={searchQuery} />;
  }

  return (
    // my-library_ul_tWu — UNREADABLE module class; reconstructed as responsive
    // card grid (auto-fill minmax(260px,1fr), 16px gap, no list styling).
    <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-[16px] p-0">
      {videos.map((video) => (
        // bare <li> — no class in source
        <li key={video.id} className="m-0 p-0">
          <VideoCard video={video} />
        </li>
      ))}
    </ul>
  );
}
