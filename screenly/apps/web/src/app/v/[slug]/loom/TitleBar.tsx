import { EditIcon } from "./icons/EditIcon";

interface TitleBarProps {
  title: string;
  ownerName: string;
  dateLabel: string;
  dateTime: string;
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
  dateTime,
  viewsLabel,
}: TitleBarProps) {
  return (
    <div className="flex items-start justify-between gap-[16px] pb-[24px]">
      <div className="min-w-0">
        <div className="contents">
          <div className="group flex min-w-0 items-center">
            <h1 className="min-w-0 truncate text-[28px] font-bold leading-[34px] text-[#24242b] max-sm:text-[20px] max-sm:leading-[28px]">
              {title}
            </h1>
            <button
              type="button"
              aria-label="Edit title"
              className="ml-[8px] shrink-0 text-[#0c66e4] opacity-100 transition-opacity duration-[150ms] sm:opacity-0 sm:focus-visible:opacity-100 sm:group-hover:opacity-100"
            >
              <span className="block size-[16px]">
                <span aria-hidden="true" className="block size-full">
                  <EditIcon className="block size-full" />
                </span>
              </span>
            </button>
          </div>
        </div>

        <div className="mt-[2px] flex flex-wrap items-center gap-x-[6px] gap-y-[2px] text-[15px] font-normal leading-[22px] text-[#6a6a73] max-sm:text-[13px] max-sm:leading-[20px]">
          <button
            type="button"
            aria-haspopup="dialog"
            aria-label={`${ownerName}'s profile`}
            className="text-[#6a6a73] hover:underline"
          >
            {ownerName}
          </button>
          <span className="text-[#c7c7cd]">・</span>
          <time dateTime={dateTime}>{dateLabel}</time>
        </div>
      </div>

      <button
        type="button"
        className="mt-[4px] hidden h-fit shrink-0 items-center rounded-[8px] border border-[#d9d9de] bg-white p-[4px] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors duration-[150ms] hover:bg-[#f7f7f8] sm:flex"
      >
        <span className="flex h-[34px] items-center">
          <span className="mx-[8px] flex items-center gap-[8px]">
            <span
              aria-hidden="true"
              className="block size-[28px] text-[#09326c]"
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
            <span className="whitespace-nowrap pr-[4px] text-[15px] font-semibold leading-[22px] text-[#42424a]">
              {viewsLabel}
            </span>
          </span>
        </span>
      </button>
    </div>
  );
}
