import { ShareButton } from "./ShareButton";

interface TitleBarProps {
  videoId: string;
  title: string;
  ownerName: string;
  dateLabel: string;
  dateTime: string;
  canCreateShareLink: boolean;
}

/**
 * The metadata row above the video: editable title, owner · date, and a views
 * badge pinned to the right. Mirrors Loom's `titleBarContainer` +
 * `titleBarViewsContainer`.
 */
export function TitleBar({
  videoId,
  title,
  ownerName,
  dateLabel,
  dateTime,
  canCreateShareLink,
}: TitleBarProps) {
  return (
    <div className="flex items-start justify-between gap-[16px] pb-[24px]">
      <div className="min-w-0 flex-1">
        <div className="contents">
          <div className="group flex min-w-0 items-center">
            <h1 className="min-w-0 truncate text-[28px] font-bold leading-[34px] text-[#24242b] max-sm:text-[20px] max-sm:leading-[28px]">
              {title}
            </h1>
          </div>
        </div>

        <div className="mt-[2px] flex flex-wrap items-center gap-x-[6px] gap-y-[2px] text-[15px] font-normal leading-[22px] text-[#6a6a73] max-sm:text-[13px] max-sm:leading-[20px]">
          <span className="text-[#6a6a73]">{ownerName}</span>
          <span className="text-[#c7c7cd]">・</span>
          <time dateTime={dateTime}>{dateLabel}</time>
        </div>
      </div>

      <ShareButton videoId={videoId} canCreateShareLink={canCreateShareLink} />
    </div>
  );
}
