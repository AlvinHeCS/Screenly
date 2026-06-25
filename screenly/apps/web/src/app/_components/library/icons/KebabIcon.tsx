interface KebabIconProps {
  className?: string;
}

export function KebabIcon({ className }: KebabIconProps) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 16 16"
      role="presentation"
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M0 8a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0m6.5 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0M13 8a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}
