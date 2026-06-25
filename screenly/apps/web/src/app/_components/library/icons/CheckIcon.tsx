interface CheckIconProps {
  className?: string;
}

export function CheckIcon({ className }: CheckIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 12 9"
      fill="none"
      color="currentColor"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.707.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-3-3a1 1 0 011.414-1.414L4 6.586 10.293.293a1 1 0 011.414 0z"
        fill="currentColor"
      ></path>
    </svg>
  );
}
