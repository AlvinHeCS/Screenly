interface ChevronDownIconProps {
  className?: string;
}

export function ChevronDownIcon({ className }: ChevronDownIconProps) {
  return (
    <svg className={className} viewBox="-2 -2 16 16"><path fill="currentColor" fillRule="evenodd" d="M2.03 3.97 6 7.94l3.97-3.97 1.06 1.06-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5z" clipRule="evenodd"></path></svg>
  );
}
