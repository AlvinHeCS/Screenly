import { CopyLinkIcon } from "./icons/CopyLinkIcon";
import { ShareIcon } from "./icons/ShareIcon";

/**
 * The blurple split button from the header: "Share" on the left, a copy-link
 * icon on the right, joined by a thin divider. Blurple `#625df5` is inferred.
 */
export function ShareButton() {
  return (
    <div className="flex h-[32px] items-stretch overflow-hidden rounded-[8px] bg-[#625df5] text-white">
      <button
        type="button"
        data-testid="share-modal-button"
        className="flex items-center gap-[6px] px-[12px] text-[14px] font-medium transition-colors duration-[150ms] hover:bg-[#4f4ae6]"
      >
        <ShareIcon className="h-[16px] w-[16px]" />
        Share
      </button>
      <span className="w-px self-stretch bg-[rgba(255,255,255,0.25)]" />
      <button
        type="button"
        aria-label="Copy link"
        className="flex items-center px-[10px] transition-colors duration-[150ms] hover:bg-[#4f4ae6]"
      >
        <CopyLinkIcon className="h-[16px] w-[16px]" />
      </button>
    </div>
  );
}
