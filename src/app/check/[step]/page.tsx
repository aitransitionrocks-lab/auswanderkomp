import { notFound } from "next/navigation";
import { QuestionStep } from "@/components/check/QuestionStep";
import { TOTAL_QUESTIONS } from "@/lib/questions";

export const metadata = {
  title: "Einschätzung",
  robots: { index: false, follow: false },
};

interface Params {
  step: string;
}

export default function CheckStepPage({ params }: { params: Params }) {
  const n = Number(params.step);
  if (!Number.isInteger(n) || n < 1 || n > TOTAL_QUESTIONS) notFound();
  return <QuestionStep step={n} />;
}
