export function RouteDivider({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 40"
      preserveAspectRatio="none"
      className={`block w-full h-7 ${className ?? ""}`}
      aria-hidden="true"
    >
      <path
        d="M0 20 Q 100 4 200 20 T 400 20 T 600 20 T 800 20"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        strokeDasharray="2 4"
        opacity="0.5"
      />
    </svg>
  );
}
