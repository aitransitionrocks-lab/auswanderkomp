import { errorsMap, type ErrorItem } from "@/content/errors-map";
import { risksMap, type RiskItem } from "@/content/risks-map";
import { fillTemplate } from "@/lib/templates";
import type { ResultData } from "@/lib/result";

export function RiskOrError({ result }: { result: ResultData }) {
  if (result.segment === "unklar") return null;

  const country = result.country || "default";

  if (result.segment === "ready") {
    const items: RiskItem[] = risksMap[country] ?? risksMap.default;
    return (
      <section className="max-w-2xl mx-auto px-6 py-10">
        <h2 className="font-display font-bold text-xl text-navy mb-2">
          Was bei Ihrem Zeitplan jetzt wichtig ist
        </h2>
        <p className="text-gray-500 mb-6">
          Keine Warnung — eine sachliche Einordnung der Fristen, die noch
          greifbar sind.
        </p>
        <div className="space-y-4">
          {items.slice(0, 2).map((item, i) => (
            <Block
              key={i}
              title={item.label}
              text={fillTemplate(item.text, result)}
            />
          ))}
        </div>
      </section>
    );
  }

  // plant = 1 Fehler, konkret = 2 Fehler
  const errors: ErrorItem[] = errorsMap[country] ?? errorsMap.default;
  const count = result.segment === "konkret" ? 2 : 1;
  const shown = errors.slice(0, count);
  const heading =
    count === 2
      ? "Zwei Fehler, die bei Ihrem Zeitplan typisch sind"
      : "Ein Fehler, der bei Ihrem Zeitplan häufig passiert";

  return (
    <section className="max-w-2xl mx-auto px-6 py-10">
      <h2 className="font-display font-bold text-xl text-navy mb-6">
        {heading}
      </h2>
      <div className="space-y-4">
        {shown.map((err, i) => (
          <Block key={i} title={err.title} text={err.text} />
        ))}
      </div>
    </section>
  );
}

function Block({ title, text }: { title: string; text: string }) {
  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
      <h3 className="font-display font-bold text-navy mb-2">{title}</h3>
      <p className="text-gray-700 leading-relaxed">{text}</p>
    </div>
  );
}
