interface StopSquareIconProps {
  className?: string;
}

export function StopSquareIcon({ className }: StopSquareIconProps) {
  return (
    <svg fill="none" viewBox="0 0 16 16" role="presentation" className={className}>
      <path
        fill="currentcolor"
        fillRule="evenodd"
        d="M1 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2zm2-.5a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5z"
        clipRule="evenodd"
      />
      <path
        fill="currentcolor"
        d="M2.5 3a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v10a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5z"
      />
    </svg>
  );
}
