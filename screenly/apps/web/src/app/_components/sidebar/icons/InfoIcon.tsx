interface InfoIconProps {
  className?: string;
}

export function InfoIcon({ className }: InfoIconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 16 16" role="presentation"><path fill="currentColor" fillRule="evenodd" d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.25.25H6.5v-1.5H8a.75.75 0 0 1 .75.75v5h-1.5z" clipRule="evenodd"></path><path fill="currentColor" d="M9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"></path></svg>
  );
}
