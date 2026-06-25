interface MinusIconProps {
  className?: string;
}

export function MinusIcon({ className }: MinusIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 12 2"
      fill="none"
      color="currentColor"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 1a1 1 0 011-1h10a1 1 0 110 2H1a1 1 0 01-1-1z"
        fill="currentColor"
      ></path>
    </svg>
  );
}
