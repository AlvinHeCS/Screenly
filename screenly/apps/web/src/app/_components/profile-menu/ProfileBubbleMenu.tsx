import { signOutAction } from "./actions";
import { CloseIcon } from "./icons/CloseIcon";

interface ProfileBubbleMenuProps {
  onClose: () => void;
}

/**
 * The narrow profile dropdown card (`profile-bubble_bubbleMenu`). Reconstructed
 * as a 320px white popover card (`--lns-radius-large` 16px, `--lns-color-border`,
 * `--lns-shadow-large`). Stacks: the close button (`button[aria-label="Close"]`,
 * top-right, reusing the resolved `.css-1q1s5qm` 32px icon-button rule), the
 * Sign Out row.
 */
export function ProfileBubbleMenu({ onClose }: ProfileBubbleMenuProps) {
  return (
    <div className="relative w-[320px] overflow-hidden rounded-[16px] border border-[hsla(225.5,57%,10%,0.14)] bg-white pb-[8px] shadow-[0_6px_24px_hsla(0,0%,0%,0.1)]">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute right-[12px] top-[12px] inline-flex h-[32px] w-[32px] cursor-pointer items-center justify-center rounded-[6px] bg-transparent p-0 text-[hsla(228,6%,17%,1)] transition-colors duration-[600ms] hover:bg-[hsla(209,75.6%,8%,0.08)]"
      >
        <CloseIcon className="h-[16px] w-[16px]" />
      </button>

      <div className="mt-[44px] px-[8px] pt-[8px]">
        <form action={signOutAction}>
          <button
            type="submit"
            className="flex w-full cursor-pointer rounded-[8px] bg-transparent px-[8px] py-[8px] text-left transition-colors duration-[600ms] hover:bg-[hsla(209,75.6%,8%,0.08)]"
          >
            <span className="text-[14px] font-normal leading-[1.57] text-[hsla(228,6%,17%,1)]">
              Sign Out
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
