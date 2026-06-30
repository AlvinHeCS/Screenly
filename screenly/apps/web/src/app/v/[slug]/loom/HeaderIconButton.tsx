import type { ReactNode } from "react";

interface HeaderIconButtonProps {
  label: string;
  children: ReactNode;
  onClick?: () => void;
  ariaControls?: string;
  ariaExpanded?: boolean;
}

/**
 * Ghost icon button used across the share-video header (main-nav, actions,
 * search, notifications). 32px square with a subtle hover fill.
 */
export function HeaderIconButton({
  label,
  children,
  onClick,
  ariaControls,
  ariaExpanded,
}: HeaderIconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-controls={ariaControls}
      aria-expanded={ariaExpanded}
      onClick={onClick}
      className="flex h-[32px] w-[32px] items-center justify-center rounded-[8px] text-[#42424a] transition-colors duration-[150ms] hover:bg-[#f4f4f6]"
    >
      {children}
    </button>
  );
}
