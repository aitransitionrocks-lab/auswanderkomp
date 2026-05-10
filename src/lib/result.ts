import type { QuizData, Segment, RiskProfile } from "./quiz-logic";

export interface ResultData extends QuizData {
  id: string | null;
  segment: Segment;
  risk: RiskProfile;
  planScore: number;
}

export function isValidResult(x: unknown): x is ResultData {
  if (!x || typeof x !== "object") return false;
  const v = x as Record<string, unknown>;
  return (
    typeof v.segment === "string" &&
    typeof v.risk === "object" &&
    v.risk !== null &&
    typeof v.planScore === "number"
  );
}
