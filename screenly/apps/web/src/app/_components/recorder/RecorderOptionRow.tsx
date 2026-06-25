import type { ReactNode } from "react";

import { OnOffToggle } from "./OnOffToggle";

interface RecorderOptionRowProps {
  icon: ReactNode;
  label: string;
  ariaLabel: string;
  /** When provided, renders an On/Off pill at the end of the row. */
  on?: boolean;
}

/**
 * A source-selector row (Window / Camera / Microphone). Reconstructed as a
 * full-width bordered button; the label reuses the resolved body-md type
 * (14px / 1.57 / medium) and the row border uses the `--lns-color-border`
 * token (`hsla(225.5,57%,10%,0.14)`).
 */
export function RecorderOptionRow({
  icon,
  label,
  ariaLabel,
  on,
}: RecorderOptionRowProps) {
  return (
    <button
      type="button"
      data-qa="recorder-button"
      aria-label={ariaLabel}
      className="flex h-[44px] w-full cursor-pointer items-center gap-[8px] rounded-[8px] border border-[hsla(225.5,57%,10%,0.14)] bg-white px-[12px] text-left text-[hsla(228,6%,17%,1)] transition-colors duration-200 hover:bg-[hsla(209,75.6%,8%,0.08)]"
    >
      <span className="flex shrink-0 items-center text-[hsla(228,6%,17%,1)]">
        {icon}
      </span>
      <span
        data-qa="active-button-text"
        className="min-w-0 flex-1 truncate text-[14px] font-medium leading-[1.57]"
      >
        {label}
      </span>
      {on !== undefined ? <OnOffToggle on={on} /> : null}
    </button>
  );
}
