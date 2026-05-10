"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { QUIZ_QUESTIONS } from "@/data/questions";
import { QuizQuestion } from "./QuizQuestion";
import { track } from "@/lib/track";

const STORAGE_KEY = "ak_quiz_answers";

export function QuizShell() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setAnswers(parsed.answers ?? {});
        setStep(parsed.step ?? 1);
      } catch {
        /* ignore */
      }
    }
    track("diagnose_start");
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, step }));
  }, [answers, step]);

  const question = QUIZ_QUESTIONS[step - 1];

  async function handleSelect(value: unknown) {
    const updated = { ...answers, [question.field]: value };
    setAnswers(updated);
    track("q_answered", { q_num: step, field: question.field });

    if (step < QUIZ_QUESTIONS.length) {
      setStep(step + 1);
    } else {
      await submitQuiz(updated);
    }
  }

  async function submitQuiz(finalAnswers: Record<string, unknown>) {
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalAnswers),
      });

      if (!res.ok) {
        throw new Error(`API Error ${res.status}`);
      }

      const data = await res.json();
      track("diagnose_complete", {
        country: finalAnswers.country,
        segment: data.segment,
      });

      localStorage.setItem(
        "ak_quiz_result",
        JSON.stringify({ id: data.id, ...finalAnswers, ...data })
      );
      localStorage.removeItem(STORAGE_KEY);

      router.push("/ergebnis");
    } catch (err) {
      console.error(err);
      setError(
        "Wir konnten Ihre Antworten gerade nicht speichern. Bitte versuchen Sie es in einem Moment erneut."
      );
      setSubmitting(false);
    }
  }

  if (submitting) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="w-12 h-12 border-4 border-teal border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <p className="text-gray-600">
            Ihre Einschätzung wird vorbereitet...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => submitQuiz(answers)}
            className="px-6 py-3 bg-teal text-white rounded-xl font-semibold"
          >
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

  if (!question) return null;

  return (
    <QuizQuestion
      question={question}
      current={step}
      total={QUIZ_QUESTIONS.length}
      onSelect={handleSelect}
    />
  );
}
