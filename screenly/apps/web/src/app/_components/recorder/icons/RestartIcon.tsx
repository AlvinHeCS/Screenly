interface RestartIconProps {
  className?: string;
}

export function RestartIcon({ className }: RestartIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.5769 5.67818H7.45487V7.92818H2.15157C1.53025 7.92818 1.02657 7.4245 1.02657 6.80318V1.49988H3.27657V3.75984C5.46322 1.44593 8.56258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 11.5817 0.0214503 11.168 0.0633789 10.76L2.30159 10.99C2.2675 11.3217 2.25 11.6586 2.25 12C2.25 17.3848 6.61522 21.75 12 21.75C17.3848 21.75 21.75 17.3848 21.75 12C21.75 6.61522 17.3848 2.25 12 2.25C9.02825 2.25 6.36648 3.57881 4.5769 5.67818Z"
        fill="currentColor"
      />
    </svg>
  );
}
