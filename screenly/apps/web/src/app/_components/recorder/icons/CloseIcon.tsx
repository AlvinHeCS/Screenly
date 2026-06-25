interface CloseIconProps {
  className?: string;
}

export function CloseIcon({ className }: CloseIconProps) {
  return (
    <svg fill="none" viewBox="0 0 16 16" role="presentation" className={className}>
      <path
        fill="currentcolor"
        fillRule="evenodd"
        d="m9.06 8 4.97-4.97-1.06-1.06L8 6.94 3.03 1.97 1.97 3.03 6.94 8l-4.97 4.97 1.06 1.06L8 9.06l4.97 4.97 1.06-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}
