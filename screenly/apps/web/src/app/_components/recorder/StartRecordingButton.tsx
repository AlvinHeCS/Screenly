interface StartRecordingButtonProps {
  onClick?: () => void;
}

/**
 * The primary "Start Recording" CTA (`content-9hyjhq`). Reconstructed as a
 * full-width record-red button using the resolved record tokens:
 * base `hsla(11.2,100%,58%,1)`, hover `hsla(11.2,100%,49%,1)`, active
 * `hsla(11.2,100%,40%,1)`.
 */
export function StartRecordingButton({ onClick }: StartRecordingButtonProps) {
  return (
    <button
      type="button"
      data-qa="recorder-button"
      aria-label="Start recording"
      onClick={onClick}
      className="flex h-[44px] w-full cursor-pointer items-center justify-center rounded-[8px] bg-[hsla(11.2,100%,58%,1)] text-[14px] font-medium text-white transition-colors duration-200 hover:bg-[hsla(11.2,100%,49%,1)] active:bg-[hsla(11.2,100%,40%,1)]"
    >
      <span>Start Recording</span>
    </button>
  );
}
