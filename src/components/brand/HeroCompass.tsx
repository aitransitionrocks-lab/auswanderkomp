// Hero-Compass — 1:1 Übersetzung aus docs/variant-cartographic.jsx
// Farben aus Forest-Palette: ink/inkSoft/line/accent/primary/bg
export function HeroCompass() {
  return (
    <div className="aspect-square w-full flex items-center justify-center">
      <svg
        viewBox="0 0 400 400"
        className="w-full h-auto"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* outer ticks */}
        <g stroke="#1F2A24" strokeWidth="0.8" opacity="0.35">
          {Array.from({ length: 60 }).map((_, i) => {
            const a = (i / 60) * Math.PI * 2;
            const r1 = 190;
            const r2 = i % 5 === 0 ? 178 : 184;
            const x1 = 200 + Math.cos(a) * r1;
            const y1 = 200 + Math.sin(a) * r1;
            const x2 = 200 + Math.cos(a) * r2;
            const y2 = 200 + Math.sin(a) * r2;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
          })}
        </g>

        <circle cx="200" cy="200" r="170" fill="none" stroke="#D8CDB8" strokeWidth="1" />
        <circle
          cx="200"
          cy="200"
          r="140"
          fill="none"
          stroke="#D8CDB8"
          strokeWidth="1"
          strokeDasharray="2 4"
        />
        <circle cx="200" cy="200" r="100" fill="none" stroke="#D8CDB8" strokeWidth="1" />
        <circle cx="200" cy="200" r="60" fill="none" stroke="#C4926B" strokeWidth="1" opacity="0.6" />

        {[
          ["N", 200, 34],
          ["E", 366, 206],
          ["S", 200, 374],
          ["W", 34, 206],
        ].map(([l, x, y], i) => (
          <text
            key={i}
            x={x as number}
            y={y as number}
            textAnchor="middle"
            fontFamily="var(--ak-serif), Georgia, serif"
            fontSize="16"
            fill={i === 0 ? "#1E3A34" : "#44504A"}
            fontWeight={i === 0 ? 600 : 400}
          >
            {l}
          </text>
        ))}

        <g transform="translate(200 200) rotate(-14)">
          <path d="M0 -130 L12 0 L0 -8 L-12 0 Z" fill="#C4926B" />
          <path d="M0 130 L-12 0 L0 8 L12 0 Z" fill="#1F2A24" opacity="0.65" />
          <circle cx="0" cy="0" r="6" fill="#F3EDE2" stroke="#1F2A24" strokeWidth="1.2" />
          <circle cx="0" cy="0" r="2" fill="#1F2A24" />
        </g>

        {[
          [100, 140],
          [280, 110],
          [310, 260],
          [150, 290],
        ].map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="3.5"
            fill="#F3EDE2"
            stroke="#1E3A34"
            strokeWidth="1.2"
          />
        ))}
      </svg>
    </div>
  );
}
