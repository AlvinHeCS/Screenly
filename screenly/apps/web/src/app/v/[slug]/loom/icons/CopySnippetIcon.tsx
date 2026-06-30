interface CopySnippetIconProps {
  className?: string;
}

export function CopySnippetIcon({ className }: CopySnippetIconProps) {
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
        d="M1 3a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2zm2-.5a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5zM16 6v6.75A3.25 3.25 0 0 1 12.75 16H6v-1.5h6.75a1.75 1.75 0 0 0 1.75-1.75V6z"
        clipRule="evenodd"
      />
    </svg>
  );
}
