import type { ResultData } from "@/lib/result";

export function TimelinePreview({ result }: { result: ResultData }) {
  if (result.dDayMonths === null) return null;

  const months = result.dDayMonths;
  const today = new Date();
  const move = new Date(today);
  move.setMonth(move.getMonth() + months);
  const after = new Date(move);
  after.setMonth(after.getMonth() + 6);

  const fmt = (d: Date) =>
    d.toLocaleDateString("de-DE", { month: "long", year: "numeric" });

  return (
    <section className="max-w-2xl mx-auto px-6 py-10">
      <div className="relative">
        <div className="h-0.5 bg-gray-200 w-full mt-6" />
        <div className="flex justify-between -mt-[9px]">
          <Marker label="Heute" sub={fmt(today)} />
          <Marker label="Umzug" sub={`in ${months} Monaten`} highlight />
          <Marker label="+6 Monate" sub={fmt(after)} />
        </div>
      </div>
      <p className="text-gray-500 text-sm mt-8 leading-relaxed">
        In den ersten Wochen passieren die Schritte, die nicht mehr nachholbar
        sind. Unten sehen Sie, welche.
      </p>
    </section>
  );
}

function Marker({
  label,
  sub,
  highlight,
}: {
  label: string;
  sub: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div
        className={`w-4 h-4 rounded-full border-2 ${
          highlight ? "bg-teal border-teal" : "bg-white border-gray-300"
        }`}
      />
      <p className="text-xs font-semibold text-navy mt-3">{label}</p>
      <p className="text-xs text-gray-400">{sub}</p>
    </div>
  );
}
