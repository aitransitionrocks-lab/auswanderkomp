import tasksData from "@/data/tasks.json";
import type { RiskProfile, Segment } from "@/lib/scoring";

interface RawTask {
  phase: "prep" | "exit" | "arrival";
  prio: "kritisch" | "wichtig" | "optional";
  title: string;
  deadlineDays: number;
  desc: string;
}

const PRIO_ORDER: Record<RawTask["prio"], number> = {
  kritisch: 0,
  wichtig: 1,
  optional: 2,
};

const SEGMENT_BUDGET: Record<Segment, number> = {
  dreamer: 6,
  planer: 9,
  fortgeschrittener: 12,
  starter: 14,
};

/**
 * Country-agnostic priority list:
 * Merge alle 9 Länder, dedupliziere nach Titel,
 * sortiere nach Priorität, schneide auf Segment-Budget.
 */
export function getPriorityTasks(
  segment: Segment,
  risk: RiskProfile
): RawTask[] {
  const all = Object.values(tasksData as Record<string, RawTask[]>).flat();
  const seen = new Set<string>();
  const dedup: RawTask[] = [];
  for (const t of all) {
    if (seen.has(t.title)) continue;
    seen.add(t.title);
    dedup.push(t);
  }

  // Boost-Faktor: rot in einer Kategorie → relevante Tasks priorisieren
  const boost = (t: RawTask): number => {
    const title = t.title.toLowerCase();
    let b = 0;
    if (risk.steuerRecht === "red" && /steuer|wegzug|gmbh|astg|tin|nif|sozial/.test(title)) b -= 1;
    if (risk.absicherung === "red" && /krankenversicherung|kv|gkv|gesundheit/.test(title)) b -= 1;
    if (risk.planungTiming === "red" && /visum|residenc|emirates|cedula|aufenthalt|dni/.test(title)) b -= 1;
    if (risk.familieUmfeld === "red" && /schule|kind/.test(title)) b -= 1;
    return b;
  };

  dedup.sort((a, b) => {
    const pa = PRIO_ORDER[a.prio] + boost(a);
    const pb = PRIO_ORDER[b.prio] + boost(b);
    if (pa !== pb) return pa - pb;
    return a.deadlineDays - b.deadlineDays;
  });

  return dedup.slice(0, SEGMENT_BUDGET[segment]);
}

export function deadlineLabel(days: number): string {
  if (days < 0) return `ca. ${Math.abs(days)} Tage vor Umzug`;
  if (days === 0) return "Am Umzugstag";
  return `innerhalb ${days} Tage nach Ankunft`;
}

export function phaseLabel(phase: RawTask["phase"]): string {
  switch (phase) {
    case "prep":
      return "Vorbereitung";
    case "exit":
      return "Ausreise";
    case "arrival":
      return "Ankunft";
  }
}

export function prioLabel(prio: RawTask["prio"]): string {
  switch (prio) {
    case "kritisch":
      return "Kritisch";
    case "wichtig":
      return "Wichtig";
    case "optional":
      return "Optional";
  }
}

export type Task = RawTask;
