/**
 * Shape of a single video row rendered by the Library grid. Produced by the
 * `video.list` tRPC query (packages/api/src/router/video.ts) and threaded down
 * through LibraryView → VideoGrid → VideoCard.
 */
export type LibraryVisibility = "LINK" | "PASSWORD" | "WORKSPACE" | "PRIVATE";

/**
 * Mirrors the Prisma `VideoStatus` enum (so the `video.list` output stays
 * assignable). DELETED rows are filtered out by the query, so a card never
 * renders one in practice.
 */
export type LibraryVideoStatus =
  | "UPLOADING"
  | "PROCESSING"
  | "READY"
  | "ERRORED"
  | "DELETED";

export interface LibraryVideo {
  id: string;
  /** Public share route param (/v/{slug}). */
  slug: string;
  title: string;
  /** Cloudflare pipeline state; non-READY rows show a status overlay. */
  status: LibraryVideoStatus;
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
