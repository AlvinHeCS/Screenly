interface PlusIconProps {
  className?: string;
}

export function PlusIcon({ className }: PlusIconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 16 16" role="presentation"><path fill="currentColor" d="M8.75 1.5v5.75h5.75v1.5H8.75v5.75h-1.5V8.75H1.5v-1.5h5.75V1.5z"></path></svg>
  );
}
