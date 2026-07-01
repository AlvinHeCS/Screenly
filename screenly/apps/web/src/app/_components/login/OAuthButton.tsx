import type { ReactNode } from "react";

interface OAuthButtonProps {
  icon: ReactNode;
  label: string;
  ariaLabel: string;
  type?: "button" | "submit";
}

// Full-width OAuth provider button: icon pinned to the left, label centered.
// Mirrors the original markup where the icon wrapper and the label are
// siblings of the button rather than inline-flowed.
export function OAuthButton({
  icon,
  label,
  ariaLabel,
  type = "button",
}: OAuthButtonProps) {
  return (
    <button
      type={type}
      aria-label={ariaLabel}
      className="relative flex h-[48px] w-full items-center justify-center rounded-[8px] border border-[#DCDCE3] bg-white text-[15px] font-medium text-[#16161D] transition-colors duration-150 hover:bg-[#F4F5F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1868DB]"
    >
      <span className="absolute left-[16px] flex items-center text-[#16161D]">
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
}
