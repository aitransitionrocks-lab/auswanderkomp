export type Segment = "dreamer" | "planer" | "fortgeschrittener" | "starter";
export type RiskLevel = "green" | "yellow" | "red";

export interface RiskProfile {
  steuerRecht: RiskLevel;
  absicherung: RiskLevel;
  planungTiming: RiskLevel;
  familieUmfeld: RiskLevel;
}

export function calculateScore(answers: number[]): number {
  if (answers.length !== 10) {
    throw new Error(`Expected 10 answers, got ${answers.length}`);
  }
  return answers.reduce((sum, score) => sum + score, 0);
}

export function getSegment(score: number): Segment {
  if (score < 10 || score > 40) {
    throw new Error(`Score ${score} out of valid range (10–40)`);
  }
  if (score <= 18) return "dreamer";
  if (score <= 27) return "planer";
  if (score <= 35) return "fortgeschrittener";
  return "starter";
}

export function getRiskProfile(answers: number[]): RiskProfile {
  if (answers.length !== 10) {
    throw new Error(`Expected 10 answers, got ${answers.length}`);
  }
  const q = (n: number) => answers[n - 1];
  return {
    steuerRecht: scoreToRisk(q(4), q(9)),
    absicherung: scoreToRisk(q(8)),
    planungTiming: scoreToRisk(q(3), q(5)),
    familieUmfeld: scoreToRisk(q(6), q(7), q(10)),
  };
}

function scoreToRisk(...scores: number[]): RiskLevel {
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  if (avg <= 1.5) return "red";
  if (avg <= 2.5) return "yellow";
  return "green";
}

export const RISK_LABEL: Record<RiskLevel, string> = {
  red: "Kritisch — unmittelbarer Handlungsbedarf",
  yellow: "Prüfen — Lücke vorhanden, noch kein Notfall",
  green: "Solide — weiter beobachten",
};

export const RISK_CATEGORY_LABEL = {
  steuerRecht: "Steuern & Recht",
  absicherung: "Absicherung",
  planungTiming: "Planung & Timing",
  familieUmfeld: "Familie & Umfeld",
} as const;

export const RISK_CATEGORY_HINT = {
  steuerRecht:
    "Wegzugsbesteuerung, Abmeldefristen, steuerliche Ansässigkeit, Verträge & Verpflichtungen.",
  absicherung:
    "Krankenversicherung im Ausland, Übergangsschutz, Notfall-Absicherung.",
  planungTiming:
    "Zeitplan, Dringlichkeit, finanzieller Puffer, Reihenfolge der Schritte.",
  familieUmfeld:
    "Schulplanung, Familieneinigkeit, Netzwerk und Community vor Ort.",
} as const;
