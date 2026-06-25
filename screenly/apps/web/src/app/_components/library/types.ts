/**
 * Shape of a single video row rendered by the Library grid. Produced by the
 * `video.list` tRPC query (packages/api/src/router/video.ts) and threaded down
 * through LibraryView → VideoGrid → VideoCard.
 */
export type LibraryVisibility = "LINK" | "PASSWORD" | "WORKSPACE" | "PRIVATE";

export interface LibraryVideo {
  id: string;
  /** Public share route param (/v/{slug}). */
  slug: string;
  title: string;
  durationSec: number | null;
  thumbnailUrl: string | null;
  visibility: LibraryVisibility;
  createdAt: Date;
  owner: {
    name: string | null;
    image: string | null;
  };
  viewCount: number;
  commentCount: number;
  /** No reactions model yet — always 0 for now. */
  reactionCount: number;
}
