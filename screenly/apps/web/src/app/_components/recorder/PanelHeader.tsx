import { ActionTab } from "./ActionTab";
import { CaptureIcon } from "./icons/CaptureIcon";
import { CloseIcon } from "./icons/CloseIcon";
import { LibraryIcon } from "./icons/LibraryIcon";
import { VideoCameraIcon } from "./icons/VideoCameraIcon";

interface PanelHeaderProps {
  onClose: () => void;
}

/**
 * Panel header row (`content-2m39qo`: grid, space-between): Close button, the
 * Record/Capture tablist, and the Library button. The Close/Library buttons use
 * the resolved `.css-1q1s5qm` icon-button rule (32px, transparent, radius 6px,
 * 600ms colour transition).
 */
export function PanelHeader({ onClose }: PanelHeaderProps) {
  return (
    <div className="flex items-center justify-between px-[8px] py-[8px]">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="inline-flex h-[32px] w-[32px] cursor-pointer items-center justify-center rounded-[6px] bg-transparent p-0 text-[hsla(228,6%,17%,1)] transition-colors duration-[600ms] hover:bg-[hsla(209,75.6%,8%,0.08)]"
      >
        <CloseIcon className="h-[16px] w-[16px]" />
      </button>

      <div role="tablist" aria-label="Capture mode" className="flex items-center gap-[4px]">
        <ActionTab
          id="recorder-record-tab"
          ariaLabel="Record button"
          selected
          icon={<VideoCameraIcon className="h-[16px] w-[16px]" />}
        />
        <ActionTab
          ariaLabel="Capture button"
          selected={false}
          icon={<CaptureIcon className="h-[16px] w-[16px]" />}
        />
      </div>

      <button
        type="button"
        aria-label="Library"
        className="inline-flex h-[32px] w-[32px] cursor-pointer items-center justify-center rounded-[6px] bg-transparent p-0 text-[hsla(228,6%,17%,1)] transition-colors duration-[600ms] hover:bg-[hsla(209,75.6%,8%,0.08)]"
      >
        <LibraryIcon className="h-[16px] w-[16px]" />
      </button>
    </div>
  );
}
