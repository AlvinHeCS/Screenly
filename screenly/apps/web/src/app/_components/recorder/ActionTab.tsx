import type { ReactNode } from "react";

interface ActionTabProps {
  icon: ReactNode;
  ariaLabel: string;
  selected: boolean;
  id?: string;
}

/**
 * One capture-mode tab (Record / Capture). The source `.css-117kd0` /
 * `.css-1d7w2kb` rules were not in `loom_style_guide.css`, so the selected/
 * unselected treatment is reconstructed: selected → blurple highlight
 * (`hsla(215.4,80%,47.65%,…)`), unselected → dimmed body colour
 * (`hsla(224,5%,44%,1)`).
 */
export function ActionTab({
  icon,
  ariaLabel,
  selected,
  id,
}: ActionTabProps) {
  return (
    <span
      id={id}
      role="tab"
      aria-selected={selected}
      aria-label={ariaLabel}
      className={`inline-flex h-[36px] w-[44px] items-center justify-center rounded-[8px] transition-colors duration-200 ${
        selected
          ? "bg-[hsla(215.4,80%,47.65%,0.15)] text-[hsla(215.4,80%,47.65%,1)]"
          : "text-[hsla(224,5%,44%,1)]"
      }`}
    >
      {icon}
    </span>
  );
}
