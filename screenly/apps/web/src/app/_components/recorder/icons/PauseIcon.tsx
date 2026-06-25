interface PauseIconProps {
  className?: string;
}

export function PauseIcon({ className }: PauseIconProps) {
  return (
    <svg fill="none" viewBox="0 0 16 16" role="presentation" className={className}>
      <path
        fill="currentcolor"
        fillRule="evenodd"
        d="M2 3a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zm7 0a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2z"
        clipRule="evenodd"
      />
    </svg>
  );
}
