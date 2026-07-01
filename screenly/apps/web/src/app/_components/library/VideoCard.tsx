import type { LibraryVideo } from "./types";
import {
  formatDuration,
  relativeTimeFromNow,
  visibilityLabel,
  initials,
} from "./format";
import { VideoCardStats } from "./VideoCardStats";

interface VideoCardProps {
  video: LibraryVideo;
}

/**
 * A single Loom-style library card: thumbnail with a full-card share link
 * overlay, a dark hover-action overlay, an optional duration badge, then the
 * body (avatar, author + date, visibility, two-line title) and the footer
 * insights row.
 *
 * Many of the source module/Emotion classes are unreadable
 * (`media-card_*`, `video-card_*`, plus the Atlassian badge primitives), so
 * they are RECONSTRUCTED from the resolvable utilities + visible DOM and
 * annotated with `{/* original-classes *\/}` comments for traceability.
 * Spacing/sizing/radius are exact px; colours are exact hsla() tokens
 * (body grey8 = hsla(228,6%,17%,1), bodyDimmed grey6 = hsla(224,5%,44%,1),
 * blueDark = hsla(216.3,69.2%,23%,1), white = hsla(0,0%,100%,1)).
 *
 * Server component: NO 'use client', NO onClick.
 */
export function VideoCard({ video }: VideoCardProps) {
  const duration = formatDuration(video.durationSec);
  const authorName = video.owner.name ?? "Unknown";

  return (
    // media-card_card_R1E video-card_videoCard_vn8 — RECONSTRUCTED: card shell;
    // relative positioning context for the share link, hover overlay and badge.
    // The grey stroke is on the full card shell, not just the thumbnail.
    // The <li> is owned by VideoGrid (source: bare <li> → this card <div>).
    <div
      className="relative rounded-[8px] border border-[hsla(225.5,57%,10%,0.14)]"
      data-videoid={video.id}
    >
      {/* video-card_videoCardLink_Jvt radius:100 — RECONSTRUCTED: full-card share link overlay. */}
      <a
        className="absolute inset-0 z-[1] rounded-[8px]"
        href={`/v/${video.slug}`}
        aria-label={`Open video: ${video.title}`}
      />

      {/* Thumbnail clip box — top corners follow the card radius; bottom edge is flat against the body. */}
      <div className="relative overflow-hidden rounded-t-[8px]">
        {/* media-card_thumbnailWrapper_mO3 video-card_videoCardThumbnailWrapper_ixQ
              — RECONSTRUCTED: 16:9 thumbnail wrapper; group enables hover reveal. */}
        <div className="group relative aspect-video w-full bg-[hsla(240,3%,12.5%,1)]">
          {video.thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt=""
              src={video.thumbnailUrl}
              className="h-full w-full object-cover"
            />
          ) : (
            // Neutral placeholder when no thumbnail is available.
            <div className="h-full w-full bg-[hsla(240,3%,12.5%,1)]" />
          )}

          {/* Pipeline overlay while the upload is still encoding on Cloudflare. */}
          {video.status !== "READY" && (
            <div className="absolute inset-0 flex items-center justify-center bg-[hsla(240,3%,12.5%,0.7)]">
              <span className="rounded-[6px] bg-[hsla(0,0%,100%,0.14)] px-[10px] py-[4px] text-[12px] font-medium text-white">
                {video.status === "ERRORED"
                  ? "Upload failed"
                  : video.status === "UPLOADING"
                    ? "Uploading…"
                    : "Processing…"}
              </span>
            </div>
          )}
        </div>

        {duration && (
          // css-hi7bk6 — duration badge: absolute; right 8px; bottom 8px; dark color-mode.
          <div
            className="absolute bottom-[8px] right-[8px]"
            data-subtree-theme="true"
            data-color-mode="dark"
            data-theme="light:dark dark:dark"
          >
            {/* RECONSTRUCTED from the Atlassian Pressable/Text primitive spans:
                  a dark rounded pill, white 12px text, tight padding. */}
            <span className="inline-flex max-w-full items-center rounded-[4px] bg-[hsla(228,6%,17%,0.9)] px-[6px] py-[2px] text-[12px] font-medium leading-[1.5] text-white">
              {/* inner text span: max-width calc(200px - 8px); truncate. */}
              <span className="block max-w-[192px] overflow-hidden text-ellipsis whitespace-nowrap">
                {duration}
              </span>
            </span>
          </div>
        )}

        {/* empty live region. */}
        <div role="status" aria-live="polite" />
      </div>

      {/* media-card_body_R03 — RECONSTRUCTED: textual body below the thumbnail. */}
      <div className="relative p-[16px]">
        {/* css-1gt4iho — grid grid-flow-col items-center justify-start gap 8px.
            It contains only the avatar and overflow:hidden author/visibility block.
            The title block is a sibling below this grid in the source DOM. */}
        <div className="grid grid-flow-col items-center justify-start gap-[8px]">
          {/* css-l9d9x4 — avatar circle reconstructed with Screenly blue initials. */}
          <span className="relative z-0 flex h-[32px] w-[32px] items-center justify-center overflow-hidden rounded-full bg-[hsla(215.9,79.9%,41%,1)] text-[13px] font-medium leading-none text-white">
            {initials(video.owner.name)}
          </span>

          {/* overflow:hidden — source wrapper around the author/date row and visibility row. */}
          <div className="overflow-hidden">
            {/* video-card_nameRow_UKP — source row containing the author/date cluster only. */}
            <div>
              {/* css-z67cp9 — source is 16px, but the text primitives render an
                  18px line box. Keep the author and date in the same centered row. */}
              <div className="h-[18px]">
                {/* css-1wmcmtc — grid grid-flow-col items-center justify-start. */}
                <div className="flex h-[18px] items-center justify-start">
                  <span>
                    <div>
                      <span className="relative z-[1] flex h-[18px] items-center border-none bg-transparent p-0 text-left">
                        {/* css-2yt1u — height 1.125rem. */}
                        <div className="flex h-[1.125rem] items-center">
                          {/* css-xgmh0l — block, 12px, line-height 1.5, fw 500, truncate (author name). */}
                          <span className="block overflow-hidden text-ellipsis whitespace-nowrap text-[12px] font-medium leading-[18px] text-[hsla(228,6%,17%,1)]">
                            {authorName}
                          </span>
                        </div>
                      </span>
                    </div>
                  </span>
                  {/* css-103pznj — 12px, line-height 1.5, fw 400, bodyDimmed (the "・6 days"). */}
                  <p className="m-0 flex h-[18px] items-center text-[12px] font-normal leading-[18px] text-[hsla(224,5%,44%,1)]">
                    ・{relativeTimeFromNow(video.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* css-103pznj — source uses a paragraph wrapper for the visibility cluster.
                Rendered as a <div> to avoid invalid HTML from nesting block elements in <p>. */}
            <div className="block text-[12px] font-normal leading-[1.5] text-[hsla(224,5%,44%,1)]">
              {/* video-card_videoVisibility_jH9 — "Not shared" + chevron on its own line. */}
              <span>
                <div>
                  {/* css-nez7wg — inline-block, vertical-align middle; tabIndex 0. */}
                  <div className="inline-block align-middle">
                    <span className="relative z-[1] border-none bg-transparent p-0">
                      {/* css-9nto4f — grid grid-flow-col items-center justify-start gap 4px. */}
                      <div className="grid grid-flow-col items-center justify-start gap-[4px]">
                        {/* css-6ta4y4 — block, 12px, line-height 1.5, fw 400, bodyDimmed, truncate. */}
                        <span
                          data-visibility-text="true"
                          className="block overflow-hidden text-ellipsis whitespace-nowrap text-[12px] font-normal leading-[1.5] text-[hsla(224,5%,44%,1)]"
                        >
                          {visibilityLabel(video.visibility)}
                        </span>
                      </div>
                    </span>
                  </div>
                </div>
              </span>
            </div>
          </div>
        </div>

        {/* css-1h483it — title block. In the source DOM this is a sibling after
            css-1gt4iho, so it renders full-width below the avatar/name grid. */}
        <div className="block pb-[12px] pt-[8px] align-middle">
          {/* css-34ugkb — height 2.75rem (two-line clamp box); aria-hidden. */}
          <div className="h-[2.75rem]" aria-hidden="true">
            {/* css-pmyn0g — 14px, line-height 1.57, fw 500, line-clamp 2 (the title). */}
            <h3 className="line-clamp-2 overflow-hidden text-[14px] font-medium leading-[1.57] text-[hsla(228,6%,17%,1)]">
              {video.title}
            </h3>
          </div>
        </div>

        {/* video-card_videoCardFooter_Mly — RECONSTRUCTED: footer row, insights left + tags right. */}
        <div className="flex items-center justify-between">
          <VideoCardStats
            viewCount={video.viewCount}
            commentCount={video.commentCount}
            reactionCount={video.reactionCount}
          />
        </div>
      </div>
    </div>
  );
}
