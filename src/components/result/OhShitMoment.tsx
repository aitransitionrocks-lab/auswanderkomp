import { ohShitMap, segmentWowMap } from "@/content/ohshit-map";
import type { ResultData } from "@/lib/result";

export function OhShitMoment({ result }: { result: ResultData }) {
  if (result.segment === "unklar") return null;

  const country = result.country || "andere";
  const text = ohShitMap[country] ?? segmentWowMap[result.segment];
  if (!text) return null;

  return (
    <section className="max-w-2xl mx-auto px-6 py-6">
      <div className="bg-amber-light border-l-4 border-amber-brand px-6 py-5 rounded-r-lg">
        <p className="text-navy italic text-lg leading-relaxed">{text}</p>
      </div>
    </section>
  );
}
