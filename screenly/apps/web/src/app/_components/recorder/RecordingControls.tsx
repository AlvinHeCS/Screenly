"use client";

import { useRecorder } from "./RecorderContext";
import { PauseIcon } from "./icons/PauseIcon";
import { PlayIcon } from "./icons/PlayIcon";
import { RestartIcon } from "./icons/RestartIcon";
import { RewindTrimIcon } from "./icons/RewindTrimIcon";
import { StopSquareIcon } from "./icons/StopSquareIcon";
import { TrashIcon } from "./icons/TrashIcon";

/**
 * The recorder controls rail (Loom's extension `bubble-controls-*` markup),
 * shown beside the camera bubble while recording or paused. Stop, Pause/Resume,
 * Restart and Cancel are wired to the recorder engine; the timer counts up
 * elapsed recorded time (frozen while paused). Rewind/Trim stays disabled
 * (editing is out of scope).
 *
 * Styling RESOLVED from `loom_style_guide.css` tokens + inline styles + ADS
 * attrs (surface grey8, radius-250, bodyDimmed bold timer, 16px icons); the
 * `bubble-controls-*` structural classes are absent from the captured CSS, so
 * the vertical layout / 28×28 buttons / shadow are best-effort reconstructions.
 * Page placement stays owned by RecorderOverlay.
 */
export function RecordingControls() {
  const {
    phase,
    elapsedSec,
    stopRecording,
    pauseRecording,
    resumeRecording,
    restartRecording,
    cancelRecording,
  } = useRecorder();

  const isPaused = phase === "paused";

  const buttonClass =
    "inline-flex h-[28px] w-[28px] cursor-pointer items-center justify-center rounded-[6px] bg-transparent p-0 text-white transition-colors duration-200 hover:bg-[hsla(0,0%,100%,0.1)]";
  const disabledClass =
    "inline-flex h-[28px] w-[28px] cursor-not-allowed items-center justify-center bg-transparent p-0 text-[hsla(225,5%,33%,1)]";

  const minutes = Math.floor(elapsedSec / 60);
  const seconds = elapsedSec % 60;
  const timeLabel = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div
      role="group"
      aria-label="Recorder controls"
      className="pointer-events-auto flex flex-col items-center gap-[10px] rounded-[16px] bg-[hsla(228,6%,17%,1)] px-[6px] py-[8px] text-white shadow-[0_6px_24px_rgba(0,0,0,0.25)]"
    >
      {/* End/record — the distinct primary control. */}
      <button
        type="button"
        aria-label="End Recording"
        data-testid="start-finish-button"
        onClick={stopRecording}
        className="inline-flex h-[28px] w-[28px] cursor-pointer items-center justify-center rounded-[6px] bg-transparent p-0 text-[hsla(11.2,100%,58%,1)] transition-colors duration-200 hover:bg-[hsla(0,0%,100%,0.1)]"
      >
        <StopSquareIcon className="h-[16px] w-[16px]" />
      </button>

      {/* Elapsed recorded time (counts up; frozen while paused). */}
      <div
        tabIndex={0}
        aria-label={`Elapsed time ${timeLabel}`}
        className="cursor-default select-none rounded-[6px] font-[sans-serif] text-[12px] font-bold text-[hsla(217.5,4%,60.4%,1)] outline-none focus-visible:ring-1 focus-visible:ring-[hsla(0,0%,100%,0.3)]"
      >
        {timeLabel}
      </div>

      <button
        type="button"
        aria-label={isPaused ? "Resume Recording" : "Pause Recording"}
        onClick={isPaused ? resumeRecording : pauseRecording}
        className={buttonClass}
      >
        {isPaused ? (
          <PlayIcon className="h-[16px] w-[16px]" />
        ) : (
          <PauseIcon className="h-[16px] w-[16px]" />
        )}
      </button>

      <button
        type="button"
        aria-label="Restart Recording"
        onClick={restartRecording}
        className={buttonClass}
      >
        <RestartIcon className="h-[16px] w-[16px]" />
      </button>

      <button
        type="button"
        aria-label="Cancel Recording"
        data-testid="cancel-button"
        onClick={cancelRecording}
        className={buttonClass}
      >
        <TrashIcon className="h-[16px] w-[16px]" />
      </button>

      {/* Divider separating Rewind/Trim (disabled — editing is out of scope). */}
      <div className="h-[1px] w-[28px] bg-[hsla(0,0%,100%,0.1)]" />

      <button
        type="button"
        disabled
        aria-label="Rewind and Trim Recording"
        className={disabledClass}
      >
        <RewindTrimIcon className="h-[16px] w-[16px]" />
      </button>
    </div>
  );
}
