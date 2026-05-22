import tasksData from "@/data/tasks.json";
import type { RiskProfile, Segment } from "@/lib/scoring";
import type { CountryCode } from "@/lib/questions";

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

// Generische Top-Tasks: kommen in ≥5 Ländern vor (= länderübergreifend relevant).
function genericTopTasks(data: Record<string, RawTask[]>): RawTask[] {
  const count = new Map<string, { task: RawTask; n: number }>();
  for (const tasks of Object.values(data)) {
    for (const t of tasks) {
      const e = count.get(t.title);
      if (e) e.n += 1;
      else count.set(t.title, { task: t, n: 1 });
    }
  }
  const generic = [...count.values()]
    .filter((e) => e.n >= 5)
    .map((e) => e.task);
  // Fallback: falls zu wenige generische, alle dedupliziert
  if (generic.length >= 5) return generic;
  const seen = new Set<string>();
  const all: RawTask[] = [];
  for (const tasks of Object.values(data)) {
    for (const t of tasks) {
      if (seen.has(t.title)) continue;
      seen.add(t.title);
      all.push(t);
    }
  }
  return all;
}

/**
 * Country-spezifische Priority-Liste.
 * country='unklar' → generische länderübergreifende Tasks.
 * Sonst → Tasks des gewählten Landes. Risk-Boost + Cut auf Segment-Budget.
 */
export function getPriorityTasks(
  segment: Segment,
  risk: RiskProfile,
  country: CountryCode
): RawTask[] {
  const data = tasksData as Record<string, RawTask[]>;
  const base =
    country === "unklar" ? genericTopTasks(data) : data[country] ?? [];

  const seen = new Set<string>();
  const dedup: RawTask[] = [];
  for (const t of base) {
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
