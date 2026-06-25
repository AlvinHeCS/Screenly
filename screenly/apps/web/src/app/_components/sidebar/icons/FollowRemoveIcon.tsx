interface FollowRemoveIconProps {
  className?: string;
}

export function FollowRemoveIcon({ className }: FollowRemoveIconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 16 16" role="presentation"><path fill="currentColor" d="M14.5 8a6.5 6.5 0 1 0-13 0 6.5 6.5 0 0 0 13 0M12 7.25v1.5H4v-1.5zM16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0"></path></svg>
  );
}
