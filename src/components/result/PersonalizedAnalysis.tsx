import { analysisTemplates } from "@/content/analysis-templates";
import {
  buildTemplateKeys,
  fillTemplate,
  getTemplate,
} from "@/lib/templates";
import { getEmploymentType } from "@/lib/quiz-logic";
import type { ResultData } from "@/lib/result";

export function PersonalizedAnalysis({ result }: { result: ResultData }) {
  const empType = getEmploymentType(result.employment);
  const keys = buildTemplateKeys(result.country || "andere", empType, result.segment);
  const template = getTemplate(
    analysisTemplates,
    keys,
    analysisTemplates.default
  );
  const text = fillTemplate(template, result);

  return (
    <section className="max-w-2xl mx-auto px-6 py-12">
      <h2 className="font-display font-bold text-xl text-navy mb-4">
        Deine persönliche Einschätzung
      </h2>
      <p className="text-gray-700 leading-relaxed text-lg">{text}</p>
    </section>
  );
}
