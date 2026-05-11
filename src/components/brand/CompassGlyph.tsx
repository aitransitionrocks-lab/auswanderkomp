interface Props {
  size?: number;
  stroke?: string;
  accent?: string;
  className?: string;
}

export function CompassGlyph({
  size = 44,
  stroke = "currentColor",
  accent,
  className,
}: Props) {
  const acc = accent ?? stroke;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="30" cy="30" r="27" stroke={stroke} strokeWidth="1" opacity="0.45" />
      <circle cx="30" cy="30" r="22" stroke={stroke} strokeWidth="1" opacity="0.25" />
      <line x1="30" y1="3" x2="30" y2="7" stroke={stroke} strokeWidth="1.2" />
      <line x1="30" y1="53" x2="30" y2="57" stroke={stroke} strokeWidth="1" opacity="0.5" />
      <line x1="3" y1="30" x2="7" y2="30" stroke={stroke} strokeWidth="1" opacity="0.5" />
      <line x1="53" y1="30" x2="57" y2="30" stroke={stroke} strokeWidth="1" opacity="0.5" />
      <path d="M30 10 L34 30 L30 28 L26 30 Z" fill={acc} />
      <path d="M30 50 L26 30 L30 32 L34 30 Z" fill={stroke} opacity="0.55" />
      <circle cx="30" cy="30" r="1.8" fill={stroke} />
    </svg>
  );
}
