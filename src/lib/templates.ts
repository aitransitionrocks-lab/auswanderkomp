import { QuizData, Segment, countryLabel } from "./quiz-logic";

export function getTemplate(
  templates: Record<string, string>,
  keys: string[],
  fallback: string
): string {
  for (const key of keys) {
    if (templates[key]) return templates[key];
  }
  return fallback;
}

export function buildTemplateKeys(
  country: string,
  employmentType: string,
  segment: Segment
): string[] {
  return [
    `${country}_${employmentType}_${segment}`,
    `${country}_${segment}`,
    `${country}_default`,
    segment,
    "default",
  ];
}

export function fillTemplate(
  template: string,
  data: QuizData & { segment: Segment }
): string {
  return template
    .replace(/\{\{country\}\}/g, countryLabel(data.country))
    .replace(/\{\{dDayMonths\}\}/g, String(data.dDayMonths ?? ""))
    .replace(/\{\{childrenCount\}\}/g, String(data.childrenCount))
    .replace(
      /\{\{kvType\}\}/g,
      data.kvType === "gkv"
        ? "gesetzlich versichert"
        : data.kvType === "pkv"
        ? "privat versichert"
        : "versichert"
    );
}
