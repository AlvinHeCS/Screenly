import type { ReactNode } from "react";

interface EffectButtonProps {
  icon: ReactNode;
  label: string;
  ariaLabel: string;
}

/**
 * An icon button with a caption beneath it, used in the effects row. The icon
 * button reuses the resolved `.css-1q1s5qm` treatment; the caption reuses
 * `.css-103pznj` (body-sm, regular, dimmed `hsla(224,5%,44%,1)`).
 */
export function EffectButton({ icon, label, ariaLabel }: EffectButtonProps) {
  return (
    <div className="flex flex-col items-center gap-[6px]">
      <button
        type="button"
        aria-label={ariaLabel}
        className="inline-flex h-[32px] w-[32px] cursor-pointer items-center justify-center rounded-[6px] bg-transparent p-0 text-[hsla(228,6%,17%,1)] transition-colors duration-[600ms] hover:bg-[hsla(209,75.6%,8%,0.08)]"
      >
        {icon}
      </button>
      <span className="text-[12px] font-normal leading-[1.5] text-[hsla(224,5%,44%,1)]">
        {label}
      </span>
    </div>
  );
}
