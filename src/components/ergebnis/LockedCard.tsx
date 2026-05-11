interface Props {
  title: string;
  hint: string;
}

export function LockedCard({ title, hint }: Props) {
  return (
    <div className="relative p-5 rounded-card border border-line bg-paperAlt overflow-hidden">
      <div className="flex items-center gap-2.5 mb-2">
        <span className="w-2.5 h-2.5 rounded-pill bg-line" />
        <span className="text-[11px] uppercase tracking-[0.12em] text-muted font-medium">
          Vorgeschlagen
        </span>
      </div>
      <h3 className="font-serif text-[18px] text-ink tracking-tight mb-1">
        {title}
      </h3>
      <div className="text-[13.5px] text-inkSoft leading-[1.5]">
        <span className="blur-[3px] select-none" aria-hidden>
          {hint}
        </span>
      </div>
      <div className="absolute inset-0 bg-paperAlt/40 backdrop-blur-[2px] flex items-center justify-center">
        <div className="px-4 py-2 bg-paper border border-line rounded-pill text-[12px] text-muted flex items-center gap-2">
          <Lock /> Im vollständigen Bericht
        </div>
      </div>
    </div>
  );
}

function Lock() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5 7V5a3 3 0 116 0v2" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
