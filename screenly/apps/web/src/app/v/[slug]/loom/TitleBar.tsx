import { Avatar } from "./Avatar";
import { EditIcon } from "./icons/EditIcon";

interface TitleBarProps {
  title: string;
  ownerName: string;
  dateLabel: string;
  viewsLabel: string;
  ownerInitials: string;
}

/**
 * The metadata row above the video: editable title, owner · date, and a views
 * badge pinned to the right. Mirrors Loom's `titleBarContainer` +
 * `titleBarViewsContainer`.
 */
export function TitleBar({
  title,
  ownerName,
  dateLabel,
  viewsLabel,
  ownerInitials,
}: TitleBarProps) {
  return (
    <div className="flex items-start justify-between gap-[16px] pb-[16px]">
      <div className="flex min-w-0 flex-col gap-[4px]">
        <div className="group flex items-center gap-[8px]">
          <h1 className="truncate text-[18px] font-bold leading-[24px] text-[#1d1c20]">
            {title}
          </h1>
          <button
            type="button"
            aria-label="Edit title"
            className="shrink-0 text-[#625df5] opacity-0 transition-opacity duration-[150ms] group-hover:opacity-100"
          >
            <EditIcon className="h-[16px] w-[16px]" />
          </button>
        </div>

        <div className="flex items-center gap-[6px] text-[13px] font-normal text-[#6a6a73]">
          <button
            type="button"
            className="text-[#6a6a73] hover:underline"
          >
            {ownerName}
          </button>
          <span className="text-[#c7c7cd]">・</span>
          <span>{dateLabel}</span>
        </div>
      </div>

      <button
        type="button"
        className="flex h-fit shrink-0 items-center gap-[8px] rounded-[8px] px-[8px] py-[6px] transition-colors duration-[150ms] hover:bg-[#f4f4f6]"
      >
        <Avatar
          initials={ownerInitials}
          className="h-[24px] w-[24px] bg-[#2c6ae4] text-[11px]"
        />
        <span className="whitespace-nowrap text-[13px] font-medium text-[#33333b]">
          {viewsLabel}
        </span>
      </button>
    </div>
  );
}
