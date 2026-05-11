interface Props {
  current: number;
  total: number;
}

export function Progress({ current, total }: Props) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => {
        const idx = i + 1;
        const state =
          idx < current ? "done" : idx === current ? "active" : "todo";
        const cls =
          state === "active"
            ? "bg-fir w-7"
            : state === "done"
            ? "bg-fir/50 w-3.5"
            : "bg-line w-3.5";
        return <div key={i} className={`h-[3px] rounded-full ${cls}`} />;
      })}
    </div>
  );
}
