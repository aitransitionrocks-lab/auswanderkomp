import type { DashboardData } from "@/lib/dashboard";
import { countryLabel, segmentLabel } from "@/lib/quiz-logic";

export function DashboardHeader({ data }: { data: DashboardData }) {
  return (
    <section className="bg-navy text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <p className="text-teal-mid font-display font-semibold text-xs tracking-[0.25em] uppercase mb-3">
          Ihr Fahrplan
        </p>
        <h1 className="font-display font-bold text-2xl md:text-3xl mb-6">
          {countryLabel(data.country)} · {segmentLabel(data.segment)}
        </h1>

        <div className="grid sm:grid-cols-3 gap-4">
          <Stat
            label="Zeitplan"
            value={
              data.dDayMonths !== null
                ? `in ${data.dDayMonths} Monaten`
                : "offen"
            }
          />
          <Stat
            label="Risikoniveau"
            value={
              data.risk.level === "hoch"
                ? "hoch"
                : data.risk.level === "mittel"
                ? "mittel"
                : "niedrig"
            }
          />
          <Stat label="Plan-Status" value={`${data.planScore} / 100`} />
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-navy-light/60 rounded-lg px-4 py-3">
      <p className="text-xs uppercase tracking-wider text-gray-400">{label}</p>
      <p className="font-display font-semibold text-white mt-0.5">{value}</p>
    </div>
  );
}
