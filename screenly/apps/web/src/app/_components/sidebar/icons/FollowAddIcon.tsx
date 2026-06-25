interface FollowAddIconProps {
  className?: string;
}

export function FollowAddIcon({ className }: FollowAddIconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 16 16" role="presentation"><path fill="currentColor" fillRule="evenodd" d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.25.682v3.25h1.5v-3.25H12v-1.5H8.75v-3.25h-1.5v3.25H4v1.5z" clipRule="evenodd"></path></svg>
  );
}
