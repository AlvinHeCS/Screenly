"use client";

import { useRecorder } from "./RecorderContext";
import { PanelHeader } from "./PanelHeader";
import { RecorderOptionRow } from "./RecorderOptionRow";
import { RecordingLimitNote } from "./RecordingLimitNote";
import { StartRecordingButton } from "./StartRecordingButton";
import { MicrophoneIcon } from "./icons/MicrophoneIcon";
import { VideoCameraIcon } from "./icons/VideoCameraIcon";

interface PreRecordingPanelProps {
  onClose: () => void;
}

/**
 * The pre-recording options dialog (`content-3yh8pl`, 280px wide). Header tabs,
 * the Window / Camera / Microphone source rows, the Start Recording CTA, the
 * recording-limit note, and the effects row. The Camera and Microphone rows
 * toggle their tracks; Start kicks off the screen picker → countdown → capture.
 * The Window row stays cosmetic: in the browser the OS/Chrome picker (raised by
 * `getDisplayMedia` on Start) owns screen-source selection.
 */
export function PreRecordingPanel({ onClose }: PreRecordingPanelProps) {
  const {
    cameraOn,
    micOn,
    setCameraOn,
    setMicOn,
    startRecording,
    errorMessage,
  } = useRecorder();

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
            ariaLabel="Toggle camera"
            label="MacBook Air Camera (0000:0001)"
            icon={<VideoCameraIcon className="h-[16px] w-[16px]" />}
            on={cameraOn}
            onClick={() => setCameraOn(!cameraOn)}
          />
          <RecorderOptionRow
            ariaLabel="Toggle microphone"
            label="MacBook Air Microphone (Built-in)"
            icon={<MicrophoneIcon className="h-[16px] w-[16px]" />}
            on={micOn}
            onClick={() => setMicOn(!micOn)}
          />
        </div>

        {errorMessage ? (
          <p
            role="alert"
            className="mt-[12px] rounded-[8px] bg-[hsla(11.2,100%,58%,0.1)] px-[12px] py-[8px] text-[12px] font-medium text-[hsla(11.2,100%,40%,1)]"
          >
            {errorMessage}
          </p>
        ) : null}

        <div className="mt-[12px]">
          <StartRecordingButton onClick={startRecording} />
        </div>

        <div className="mt-[8px]">
          <RecordingLimitNote />
        </div>
      </div>
    </div>
  );
}
