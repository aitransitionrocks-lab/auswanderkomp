"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CompassGlyph } from "@/components/brand/CompassGlyph";
import { Progress } from "./Progress";
import { QUESTIONS, TOTAL_QUESTIONS } from "@/lib/questions";
import { loadAnswers, saveAnswers } from "@/lib/answers";
import { track } from "@/lib/track";

interface Props {
  step: number;
}

export function QuestionStep({ step }: Props) {
  const router = useRouter();
  const question = QUESTIONS[step - 1];
  const [selected, setSelected] = useState<number | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!question) return;
    const stored = loadAnswers();
    setSelected(stored.answers[step - 1] ?? null);
    setHydrated(true);

    if (step === 1 && stored.answers.length === 0) {
      track("diagnose_start", {});
    }
  }, [step, question]);

  if (!question) {
    return (
      <main className="min-h-screen px-6 flex items-center justify-center">
        <p className="text-muted">Frage existiert nicht.</p>
      </main>
    );
  }

  function pick(score: number) {
    setSelected(score);
  }

  function next() {
    if (selected === null) return;
    const stored = loadAnswers();
    const updated = [...stored.answers];
    updated[step - 1] = selected;
    const trimmed = updated.slice(0, step);
    saveAnswers({ answers: trimmed, step: step + 1 });

    track("q_answered", { q_num: step, score: selected });

    // Nach Frage 10 → Country-Picker (Schritt 11), dann Ergebnis.
    router.push(`/check/${step + 1}`);
  }

  function back() {
    if (step > 1) router.push(`/check/${step - 1}`);
  }

  return (
    <main className="min-h-screen bg-paper text-ink">
      {/* Nav */}
      <header className="border-b border-line">
        <div className="max-w-page mx-auto px-6 md:px-16 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <CompassGlyph size={28} stroke="#1E3A34" accent="#C4926B" />
            <span className="font-serif text-[17px] tracking-tight">
              Auswander-Kompass
            </span>
          </Link>
          <div className="text-[12px] text-muted uppercase tracking-[0.08em]">
            Einschätzung
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="border-b border-line">
        <div className="max-w-page mx-auto px-6 md:px-16 py-4 flex items-center justify-between gap-6">
          <div className="text-[12px] uppercase tracking-[0.12em] text-muted">
            Frage {step} von {TOTAL_QUESTIONS} · {question.dimension}
          </div>
          <Progress current={step} total={TOTAL_QUESTIONS} />
        </div>
      </div>

      <section className="max-w-page mx-auto px-6 md:px-16 py-12 md:py-20">
        <div className="max-w-[760px]">
          <h1 className="font-serif font-normal text-[28px] md:text-[40px] leading-[1.15] tracking-[-0.02em] mb-3 text-balance">
            {question.question}
          </h1>
          {question.helpText && (
            <p className="text-inkSoft text-[15px] mb-6">{question.helpText}</p>
          )}
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-3">
          {hydrated &&
            question.answers.map((ans) => {
              const isSelected = selected === ans.score;
              return (
                <button
                  key={ans.option}
                  onClick={() => pick(ans.score)}
                  className={`text-left p-5 rounded-card border transition-colors ${
                    isSelected
                      ? "bg-fir text-paper border-fir"
                      : "bg-paper text-ink border-line hover:bg-paperAlt hover:border-fir"
                  }`}
                >
                  <div
                    className={`text-[10.5px] uppercase tracking-[0.14em] font-medium mb-2 ${
                      isSelected ? "text-copper" : "text-muted"
                    }`}
                  >
                    {ans.option}
                  </div>
                  <div className="font-serif text-[17px] md:text-[19px] leading-[1.35] tracking-tight">
                    {ans.text}
                  </div>
                </button>
              );
            })}
        </div>

        <div className="mt-12 flex items-center justify-between">
          <button
            onClick={back}
            disabled={step === 1}
            className="text-[14px] text-inkSoft hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Zurück
          </button>
          <button
            onClick={next}
            disabled={selected === null}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-fir text-paper rounded-pill font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-fir-deep transition-colors"
          >
            Weiter →
          </button>
        </div>
      </section>
    </main>
  );
}
