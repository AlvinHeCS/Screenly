interface LibraryIconProps {
  className?: string;
}

export function LibraryIcon({ className }: LibraryIconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 16 16" role="presentation"><path fill="currentColor" fillRule="evenodd" d="M13 2.5H3V1h10zM1 6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2zm2-.5a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V6a.5.5 0 0 0-.5-.5zm8 3H5V7h6z" clipRule="evenodd"></path></svg>
  );
}
