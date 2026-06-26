interface PlayIconProps {
  className?: string;
}

export function PlayIcon({ className }: PlayIconProps) {
  return (
    <svg fill="none" viewBox="0 0 16 16" role="presentation" className={className}>
      <path
        fill="currentcolor"
        d="M4 2.892c0-.77.83-1.255 1.5-.876l8.018 4.538a1 1 0 0 1 0 1.74L5.5 12.832c-.67.38-1.5-.106-1.5-.876z"
      />
    </svg>
  );
}
