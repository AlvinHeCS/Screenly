interface AvatarProps {
  initials: string;
  className?: string;
}

/**
 * Circular initials avatar. Size/background come from `className` so callers
 * control the design-token color (e.g. the views badge uses Loom "blueDark").
 */
export function Avatar({ initials, className }: AvatarProps) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-bold uppercase leading-none text-white ${className ?? ""}`}
    >
      {initials}
    </span>
  );
}
