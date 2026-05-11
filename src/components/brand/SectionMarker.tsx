interface Props {
  number: string;
  label: string;
}

export function SectionMarker({ number, label }: Props) {
  return (
    <div className="flex items-center gap-3.5">
      <div className="w-9 h-9 rounded-pill border border-line bg-paper flex items-center justify-center font-serif text-sm text-fir tracking-tight">
        {number}
      </div>
      <div className="text-xs uppercase tracking-[0.14em] text-muted font-medium">
        {label}
      </div>
      <div className="flex-1 h-px bg-line ml-2" />
    </div>
  );
}
