import type { ResultData } from "@/lib/result";
import type { Segment } from "@/lib/quiz-logic";

const HEADLINES: Record<Segment, string> = {
  unklar: "Sie sind noch in der Orientierungsphase.",
  plant: "Ihr Plan hat erste Konturen — aber noch offene Stellen.",
  konkret: "Ihr Plan ist konkret. Jetzt entscheidet die Reihenfolge.",
  ready: "Sie sind kurz vor dem Umzug. Der Zeitplan ist jetzt kritisch.",
};

const SUBLINES: Record<Segment, string> = {
  unklar:
    "Bevor Sie Fristen vergleichen, müssen Sie Zielland und Zeitraum klären.",
  plant:
    "Noch ist genug Zeit — wenn die richtigen Schritte in den richtigen Wochen passieren.",
  konkret:
    "Bei Ihrem Zeitplan sind zwei Bereiche überdurchschnittlich häufig die Bruchstelle.",
  ready:
    "Bei dieser Vorlaufzeit sind manche Entscheidungen nicht mehr verhandelbar.",
};

export function ResultHeader({ result }: { result: ResultData }) {
  return (
    <section className="bg-navy text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-teal-mid font-display font-semibold text-xs tracking-[0.25em] uppercase mb-4">
          Ihre persönliche Einschätzung
        </p>
        <h1 className="font-display font-bold text-3xl md:text-4xl leading-tight mb-4">
          {HEADLINES[result.segment]}
        </h1>
        <p className="text-gray-300 text-lg leading-relaxed">
          {SUBLINES[result.segment]}
        </p>
      </div>
    </section>
  );
}
