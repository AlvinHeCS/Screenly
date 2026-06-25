import { EyeIcon } from "./icons/EyeIcon";
import { CommentIcon } from "./icons/CommentIcon";
import { ReactionIcon } from "./icons/ReactionIcon";

interface VideoCardStatsProps {
  viewCount: number;
  commentCount: number;
  reactionCount: number;
}

/**
 * Footer insights cluster for a library card: views / comments / reactions,
 * followed by the (empty in sample) horizontal tag scroller. These render as
 * two siblings so they can sit inside the footer's `justify-between` flex row
 * in VideoCard, hence the fragment.
 *
 * Light-theme colours: count text + icons use `bodyDimmed`
 * (grey6 = hsla(224,5%,44%,1)). Icons are size 2 → 16px with 8% padding,
 * gaps are space-medium (16px) between items and space-xsmall (4px) icon→count.
 */
export function VideoCardStats({
  viewCount,
  commentCount,
  reactionCount,
}: VideoCardStatsProps) {
  return (
    <>
      {/* video-card_videoCardInsights_WOb — RECONSTRUCTED: insights cluster wrapper. */}
      <div>
        {/* css-16wib5o — grid grid-flow-col items-center justify-start gap 16px (space-medium). */}
        <div className="grid grid-flow-col items-center justify-start gap-[16px]">
          {/* css-9nto4f — grid grid-flow-col items-center justify-start gap 4px (views item). */}
          <div className="grid grid-flow-col items-center justify-start gap-[4px]">
            {/* css-1cfse3p (size 2, color bodyDimmed) — block, color bodyDimmed; icon 16×16, padding 8%. */}
            <span
              aria-label="Views"
              className="block text-[hsla(224,5%,44%,1)]"
            >
              <EyeIcon className="block h-[16px] w-[16px] p-[8%]" />
            </span>
            {/* css-103pznj — 12px, line-height 1.5, font-weight 400, bodyDimmed (the count). */}
            <span className="block text-[12px] font-normal leading-[1.5] text-[hsla(224,5%,44%,1)]">
              {viewCount}
            </span>
          </div>

          {/* comments item */}
          <div className="grid grid-flow-col items-center justify-start gap-[4px]">
            <span
              aria-label="Comments"
              className="block text-[hsla(224,5%,44%,1)]"
            >
              <CommentIcon className="block h-[16px] w-[16px] p-[8%]" />
            </span>
            <span className="block text-[12px] font-normal leading-[1.5] text-[hsla(224,5%,44%,1)]">
              {commentCount}
            </span>
          </div>

          {/* reactions item */}
          <div className="grid grid-flow-col items-center justify-start gap-[4px]">
            <span
              aria-label="Reactions"
              className="block text-[hsla(224,5%,44%,1)]"
            >
              <ReactionIcon className="block h-[16px] w-[16px] p-[8%]" />
            </span>
            <span className="block text-[12px] font-normal leading-[1.5] text-[hsla(224,5%,44%,1)]">
              {reactionCount}
            </span>
          </div>
        </div>
      </div>

      {/* video-card_videoCardTags_mNp indiana-scroll-container indiana-scroll-container--hide-scrollbars
          — RECONSTRUCTED: horizontal tag scroller with hidden scrollbars (empty in sample). */}
      <div className="flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* css-9nto4f — empty grid in sample */}
        <div className="grid grid-flow-col items-center justify-start gap-[4px]" />
      </div>
    </>
  );
}
