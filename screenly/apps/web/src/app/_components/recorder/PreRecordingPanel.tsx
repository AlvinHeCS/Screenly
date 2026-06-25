import { EffectsRow } from "./EffectsRow";
import { PanelHeader } from "./PanelHeader";
import { RecorderOptionRow } from "./RecorderOptionRow";
import { RecordingLimitNote } from "./RecordingLimitNote";
import { StartRecordingButton } from "./StartRecordingButton";
import { MicrophoneIcon } from "./icons/MicrophoneIcon";
import { ScreenWindowIcon } from "./icons/ScreenWindowIcon";
import { VideoCameraIcon } from "./icons/VideoCameraIcon";

interface PreRecordingPanelProps {
  onClose: () => void;
}

/**
 * The pre-recording options dialog (`content-3yh8pl`, 280px wide). Header tabs,
 * the Window / Camera / Microphone source rows, the Start Recording CTA, the
 * recording-limit note, and the effects row. Card chrome (radius, shadow) is
 * reconstructed; the body text/colours come from the resolved tokens.
 */
export function PreRecordingPanel({ onClose }: PreRecordingPanelProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="recorder-dialog-title"
      className="w-[280px] overflow-hidden rounded-[12px] bg-white text-[hsla(228,6%,17%,1)] shadow-[0_12px_40px_rgba(0,0,0,0.2)]"
    >
      <h2 id="recorder-dialog-title" className="sr-only">
        Record a video
      </h2>
      <PanelHeader onClose={onClose} />

      <div className="px-[16px] pb-[16px]">
        <div className="flex flex-col gap-[8px]">
          <RecorderOptionRow
            ariaLabel="Recording options"
            label="Window"
            icon={<ScreenWindowIcon className="h-[16px] w-[16px]" />}
          />
          <RecorderOptionRow
            ariaLabel="Camera options"
            label="MacBook Air Camera (0000:0001)"
            icon={<VideoCameraIcon className="h-[16px] w-[16px]" />}
            on
          />
          <RecorderOptionRow
            ariaLabel="Microphone options"
            label="MacBook Air Microphone (Built-in)"
            icon={<MicrophoneIcon className="h-[16px] w-[16px]" />}
            on
          />
        </div>

        <div className="mt-[12px]">
          <StartRecordingButton />
        </div>

        <div className="mt-[8px]">
          <RecordingLimitNote />
        </div>

        <EffectsRow />
      </div>
    </div>
  );
}
