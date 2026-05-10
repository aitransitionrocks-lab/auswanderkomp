export type RiskLevel = "rot" | "gelb" | "gruen";
export type Segment = "unklar" | "plant" | "konkret" | "ready";

export type Country =
  | "portugal"
  | "dubai"
  | "spanien"
  | "suedzypern"
  | "nordzypern"
  | "thailand"
  | "argentinien"
  | "panama"
  | "usa"
  | "andere";

export interface QuizData {
  country: Country | "";
  dDayMonths: number | null;
  childrenCount: number;
  childrenAgeGroup: string;
  employment: string;
  hasGmbh: boolean | null;
  kvType: string;
  hasProperty: boolean;
  taxAdviceStatus: string;
  coParentStatus: string;
  biggestConcern: string;
}

export interface RiskProfile {
  steuer: RiskLevel;
  kv: RiskLevel;
  buerokratie: RiskLevel;
  familie: RiskLevel;
  level: "hoch" | "mittel" | "niedrig";
  rotCount: number;
  gelbCount: number;
}

// ─── AMPEL ────────────────────────────────────────────
export function getRiskProfile(data: QuizData): RiskProfile {
  const steuer: RiskLevel =
    data.employment === "gmbh" ||
    data.hasGmbh === true ||
    (data.hasGmbh === null && data.employment !== "employed")
      ? "rot"
      : data.employment === "freelancer" && data.hasGmbh === false
      ? "gruen"
      : "gelb";

  const kv: RiskLevel =
    data.kvType === "gkv" && data.dDayMonths !== null && data.dDayMonths <= 3
      ? "rot"
      : data.kvType === "gkv" && data.dDayMonths !== null && data.dDayMonths <= 6
      ? "gelb"
      : "gruen";

  const buerokratie: RiskLevel =
    data.dDayMonths !== null && data.dDayMonths <= 2
      ? "rot"
      : data.dDayMonths !== null && data.dDayMonths <= 5
      ? "gelb"
      : "gruen";

  const familie: RiskLevel =
    data.coParentStatus === "separated" && data.childrenCount > 0
      ? "rot"
      : data.childrenCount > 0 &&
        data.dDayMonths !== null &&
        data.dDayMonths <= 4
      ? "gelb"
      : "gruen";

  const risks = [steuer, kv, buerokratie, familie];
  const rotCount = risks.filter((r) => r === "rot").length;
  const gelbCount = risks.filter((r) => r === "gelb").length;

  const level: "hoch" | "mittel" | "niedrig" =
    rotCount >= 2 ||
    (rotCount === 1 &&
      data.dDayMonths !== null &&
      data.dDayMonths <= 4)
      ? "hoch"
      : rotCount === 1 || gelbCount >= 2
      ? "mittel"
      : "niedrig";

  return { steuer, kv, buerokratie, familie, level, rotCount, gelbCount };
}

// ─── SEGMENT ──────────────────────────────────────────
export function getSegment(data: QuizData): Segment {
  if (!data.country || data.country === "andere" || data.dDayMonths === null) {
    return "unklar";
  }
  if (data.dDayMonths <= 3) return "ready";
  if (data.dDayMonths <= 12) return "konkret";
  return "plant";
}

// ─── PLAN-SCORE (0–65 nach Quiz, Rest im Paid) ────────
export function getPlanScore(data: QuizData): number {
  let score = 10;
  if (data.dDayMonths !== null) score += 15;
  if (data.taxAdviceStatus === "advised") score += 15;
  if (data.taxAdviceStatus === "planned") score += 8;
  if (data.kvType === "pkv") score += 10;
  if (data.childrenCount === 0) score += 5;
  if (data.dDayMonths !== null && data.dDayMonths >= 9) score += 10;
  if (data.hasGmbh === false && data.employment !== "gmbh") score += 10;
  return Math.min(score, 65);
}

// ─── EMPLOYMENT HELPER ────────────────────────────────
export function getEmploymentType(employment: string): string {
  if (employment === "gmbh") return "gmbh";
  if (employment === "freelancer" || employment === "mixed") return "freelancer";
  return "employed";
}

// ─── COUNTRY LABEL ────────────────────────────────────
export function countryLabel(country: string): string {
  const labels: Record<string, string> = {
    portugal: "Portugal",
    dubai: "Dubai / VAE",
    spanien: "Spanien",
    suedzypern: "Süd-Zypern",
    nordzypern: "Nord-Zypern",
    thailand: "Thailand",
    argentinien: "Argentinien",
    panama: "Panama",
    usa: "USA",
    andere: "noch unklar",
  };
  return labels[country] ?? country;
}

// ─── SEGMENT LABEL ────────────────────────────────────
export function segmentLabel(segment: Segment): string {
  const labels: Record<Segment, string> = {
    unklar: "Orientierungsphase",
    plant: "Planungsphase",
    konkret: "Konkrete Umsetzung",
    ready: "Kurz vor Umzug",
  };
  return labels[segment];
}
