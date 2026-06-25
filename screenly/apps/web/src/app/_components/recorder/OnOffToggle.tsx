interface OnOffToggleProps {
  on: boolean;
}

/**
 * The On/Off pill shown on the camera and microphone rows (`on_off_button_class`
 * / `content-1ck302i`). Reconstructed; the "on" state uses blurple
 * (`hsla(215.4,80%,47.65%,1)`) with inverse (white) text, matching the source's
 * `color="bodyInverse" font-weight="bold"` label.
 */
export function OnOffToggle({ on }: OnOffToggleProps) {
  return (
    <span
      data-qa="on-off-button"
      className={`inline-flex h-[20px] shrink-0 items-center rounded-[10px] px-[8px] text-[11px] font-bold ${
        on
          ? "bg-[hsla(215.4,80%,47.65%,1)] text-white"
          : "bg-[hsla(209,76%,8%,0.08)] text-[hsla(224,5%,44%,1)]"
      }`}
    >
      {on ? "On" : "Off"}
    </span>
  );
}
