import { PauseIcon } from "./icons/PauseIcon";
import { RestartIcon } from "./icons/RestartIcon";
import { RewindTrimIcon } from "./icons/RewindTrimIcon";
import { StopSquareIcon } from "./icons/StopSquareIcon";
import { TrashIcon } from "./icons/TrashIcon";

/**
 * The recording-controls rail (`bubble-controls-*`), a vertical stack shown
 * above the camera bubble. In the captured pre-recording state every control is
 * disabled and the timer shows the 5:00 limit; that exact state is reproduced.
 * Dark theme uses the resolved `grey8` token (`hsla(228,6%,17%,1)`); disabled
 * content uses `hsla(223,5%,73%,1)`.
 */
export function RecordingControls() {
  const buttonClass =
    "inline-flex h-[28px] w-[28px] cursor-not-allowed items-center justify-center bg-transparent p-0 text-[hsla(223,5%,73%,1)]";

  return (
    <div
      role="group"
      aria-label="Recorder controls"
      className="pointer-events-auto flex flex-col items-center gap-[10px] rounded-[24px] bg-[hsla(228,6%,17%,1)] px-[8px] py-[12px] text-white shadow-[0_6px_24px_rgba(0,0,0,0.25)]"
    >
      <button
        type="button"
        disabled
        aria-label="End Recording"
        data-testid="start-finish-button"
        className={buttonClass}
      >
        <StopSquareIcon className="h-[16px] w-[16px]" />
      </button>

      <span className="text-[12px] font-bold text-[hsla(223,5%,73%,1)]">5:00</span>

      <button type="button" disabled aria-label="Pause Recording" className={buttonClass}>
        <PauseIcon className="h-[16px] w-[16px]" />
      </button>

      <button type="button" disabled aria-label="Restart Recording" className={buttonClass}>
        <RestartIcon className="h-[16px] w-[16px]" />
      </button>

      <button
        type="button"
        disabled
        aria-label="Cancel Recording"
        data-testid="cancel-button"
        className={buttonClass}
      >
        <TrashIcon className="h-[16px] w-[16px]" />
      </button>

      <button
        type="button"
        disabled
        aria-label="Rewind and Trim Recording"
        className={buttonClass}
      >
        <RewindTrimIcon className="h-[16px] w-[16px]" />
      </button>
    </div>
  );
}
