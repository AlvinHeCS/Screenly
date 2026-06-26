import type { LibraryVideo } from "./types";
import {
  formatDuration,
  relativeTimeFromNow,
  visibilityLabel,
  initials,
} from "./format";
import { VideoCardHoverActions } from "./VideoCardHoverActions";
import { VideoCardStats } from "./VideoCardStats";
import { ChevronDownIcon } from "./icons/ChevronDownIcon";

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
 * Server component: NO 'use client', NO onClick. The bulk-select checkbox and
 * action buttons are decorative.
 */
export function VideoCard({ video }: VideoCardProps) {
  const duration = formatDuration(video.durationSec);
  const authorName = video.owner.name ?? "Unknown";

  return (
    // media-card_card_R1E video-card_videoCard_vn8 — RECONSTRUCTED: card shell;
    // relative positioning context for the share link, hover overlay and badge.
    // The <li> is owned by VideoGrid (source: bare <li> → this card <div>).
    <div className="relative" data-videoid={video.id} draggable>
      {/* video-card_videoCardLink_Jvt radius:100 — RECONSTRUCTED: full-card share link overlay. */}
      <a
        className="absolute inset-0 z-[1] rounded-[8px]"
        href={`/v/${video.slug}`}
        aria-label={`Open video: ${video.title}`}
      />

      {/* radius:100 overflow:hidden relative — the thumbnail clip box. */}
      <div className="relative overflow-hidden rounded-[8px]">
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

          {/* media-card_hoverShow_EyS video-card_videoCardHoverShow_nGE
                — RECONSTRUCTED: overlay revealed on card hover. */}
          <div className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
            {/* theme-dark wrapper carrying dark color-mode for the overlay controls (decorative attrs). */}
            <div
              className="h-full w-full"
              data-lens-theme="dark"
              data-subtree-theme="true"
              data-color-mode="dark"
              data-theme="light:dark dark:dark"
            >
              <VideoCardHoverActions videoId={video.id} title={video.title} />
            </div>
          </div>

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
      <div className="relative pt-[12px]">
        {/* css-1gt4iho — grid grid-flow-col items-center justify-start gap 8px (avatar + name/title). */}
        <div className="grid grid-flow-col items-center justify-start gap-[8px]">
          {/* css-l9d9x4 — avatar circle: blueDark text on white, rounded-full, 32×32, 16px text, fw 653. */}
          <span className="relative z-0 flex h-[32px] w-[32px] items-center justify-center overflow-hidden rounded-full bg-[hsla(0,0%,100%,1)] text-[16px] font-[653] leading-none text-[hsla(216.3,69.2%,23%,1)]">
            {video.owner.image ? (
              // css-st051q — gravatar img: 32×32, max-w-full.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt=""
                src={video.owner.image}
                className="h-[32px] w-[32px] max-w-full"
              />
            ) : (
              initials(video.owner.name)
            )}
          </span>

          {/* overflow:hidden — wraps the name row + title. */}
          <div className="overflow-hidden">
            {/* video-card_nameRow_UKP — RECONSTRUCTED: author/date/visibility row. */}
            <div className="flex min-w-0 items-center justify-between gap-[8px]">
              {/* css-z67cp9 — height 16px (author + date group). */}
              <div className="h-[16px]">
                {/* css-1wmcmtc — grid grid-flow-col items-center justify-start. */}
                <div className="grid grid-flow-col items-center justify-start">
                  <span>
                    <div>
                      {/* profile-card_textLink_GSY — RECONSTRUCTED: bare author button (decorative). */}
                      <button
                        type="button"
                        className="relative z-[1] cursor-pointer border-none bg-transparent p-0 text-left"
                        aria-expanded="false"
                        aria-haspopup="dialog"
                        aria-label={`${authorName}'s profile`}
                        aria-hidden="false"
                        tabIndex={0}
                      >
                        {/* css-2yt1u — height 1.125rem. */}
                        <div className="h-[1.125rem]">
                          {/* css-xgmh0l — block, 12px, line-height 1.5, fw 500, truncate (author name). */}
                          <span className="block overflow-hidden text-ellipsis whitespace-nowrap text-[12px] font-medium leading-[1.5] text-[hsla(228,6%,17%,1)]">
                            {authorName}
                          </span>
                        </div>
                      </button>
                    </div>
                  </span>
                  {/* css-103pznj — 12px, line-height 1.5, fw 400, bodyDimmed (the "・6 days"). */}
                  <p className="block text-[12px] font-normal leading-[1.5] text-[hsla(224,5%,44%,1)]">
                    ・{relativeTimeFromNow(video.createdAt)}
                  </p>
                </div>
              </div>

              {/* css-103pznj wrapper for the visibility cluster — a <div>, not a
                  <p>, because it nests block elements (a <p> can't contain a <div>). */}
              <div className="block text-[12px] font-normal leading-[1.5] text-[hsla(224,5%,44%,1)]">
                {/* video-card_videoVisibility_jH9 — RECONSTRUCTED: "Not shared" + chevron; shrink-0. */}
                <span className="shrink-0">
                  <div>
                    {/* css-nez7wg — inline-block, vertical-align middle; tabIndex 0. */}
                    <div className="inline-block align-middle" tabIndex={0}>
                      {/* video-card_visibilityButton_qqT — RECONSTRUCTED: bare visibility button. */}
                      <button
                        type="button"
                        className="relative z-[1] cursor-pointer border-none bg-transparent p-0"
                      >
                        {/* css-9nto4f — grid grid-flow-col items-center justify-start gap 4px. */}
                        <div className="grid grid-flow-col items-center justify-start gap-[4px]">
                          {/* css-6ta4y4 — block, 12px, line-height 1.5, fw 400, bodyDimmed, truncate. */}
                          <span
                            data-visibility-text="true"
                            className="block overflow-hidden text-ellipsis whitespace-nowrap text-[12px] font-normal leading-[1.5] text-[hsla(224,5%,44%,1)]"
                          >
                            {visibilityLabel(video.visibility)}
                          </span>
                          {/* css-1ri22re — block, color body; 12×12 chevron. */}
                          <span className="block text-[hsla(228,6%,17%,1)]">
                            <ChevronDownIcon className="block h-[12px] w-[12px]" />
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                </span>
              </div>
            </div>

            {/* css-1h483it — block, vertical-align middle, pt 8px, pb 12px (title wrapper). */}
            <div className="block pb-[12px] pt-[8px] align-middle">
              {/* css-34ugkb — height 2.75rem (two-line clamp box); aria-hidden. */}
              <div className="h-[2.75rem]" aria-hidden="true">
                {/* css-pmyn0g — 14px, line-height 1.57, fw 500, line-clamp 2 (the title). */}
                <h3 className="line-clamp-2 overflow-hidden text-[14px] font-medium leading-[1.57] text-[hsla(228,6%,17%,1)]">
                  {video.title}
                </h3>
              </div>
            </div>
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

        {/* css-181vo1z — absolute; bg white; right 16px; bottom 16px; z-index 2 (empty corner). */}
        <div className="absolute bottom-[16px] right-[16px] z-[2] bg-[hsla(0,0%,100%,1)]" />
      </div>
    </div>
  );
}
