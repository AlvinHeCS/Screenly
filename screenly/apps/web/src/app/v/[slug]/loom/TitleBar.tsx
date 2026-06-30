import { EditIcon } from "./icons/EditIcon";

interface TitleBarProps {
  title: string;
  ownerName: string;
  dateLabel: string;
  viewsLabel: string;
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
}: TitleBarProps) {
  return (
    <div className="flex items-start justify-between gap-[16px] pb-[16px]">
      <div className="min-w-0">
        <div className="contents">
          <div className="group flex min-w-0 items-center">
            <h1 className="min-w-0 truncate text-[18px] font-bold leading-[24px] text-[#1d1c20]">
              {title}
            </h1>
            <button
              type="button"
              aria-label="Edit title"
              className="ml-[6px] shrink-0 text-[#0c66e4]"
            >
              <span className="block size-[16px]">
                <span aria-hidden="true" className="block size-full">
                  <EditIcon className="block size-full" />
                </span>
              </span>
            </button>
          </div>
        </div>

        <div className="mt-[4px] flex flex-wrap items-center gap-x-[6px] gap-y-[2px] text-[13px] font-normal leading-[20px] text-[#6a6a73]">
          <button
            type="button"
            aria-haspopup="dialog"
            aria-label={`${ownerName}'s profile`}
            className="text-[#6a6a73] hover:underline"
          >
            {ownerName}
          </button>
          <span className="text-[#c7c7cd]">・</span>
          <time>{dateLabel}</time>
        </div>
      </div>

      <button
        type="button"
        className="flex h-fit shrink-0 items-center rounded-[8px] p-[4px] transition-colors duration-[150ms] hover:bg-[#f4f4f6]"
      >
        <span className="flex h-[28px] items-center">
          <span className="mx-[8px] flex items-center gap-[8px]">
            <span
              aria-hidden="true"
              className="block size-[24px] text-[#09326c]"
            >
              <svg width="100%" height="100%" viewBox="0 0 40 40" fill="none">
                <circle
                  opacity="0.2"
                  cx="20"
                  cy="20"
                  r="20"
                  fill="currentColor"
                />
                <path
                  d="M10.476 29.889a9.524 9.524 0 0119.047 0H10.476z"
                  fill="currentColor"
                />
                <circle
                  cx="20.001"
                  cy="13.222"
                  r="5.556"
                  transform="rotate(-90 20 13.222)"
                  fill="currentColor"
                />
              </svg>
            </span>
            <span className="whitespace-nowrap text-[13px] font-medium leading-[20px] text-[#6a6a73]">
              {viewsLabel}
            </span>
          </span>
        </span>
      </button>
    </div>
  );
}
