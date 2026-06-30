interface SearchIconProps {
  className?: string;
}

export function SearchIcon({ className }: SearchIconProps) {
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
        d="M7 2.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9M1 7a6 6 0 1 1 10.74 3.68l3.29 3.29-1.06 1.06-3.29-3.29A6 6 0 0 1 1 7"
        clipRule="evenodd"
      />
    </svg>
  );
}
