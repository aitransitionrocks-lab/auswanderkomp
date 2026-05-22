"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CompassGlyph } from "@/components/brand/CompassGlyph";
import { Progress } from "./Progress";
import { COUNTRIES, type CountryCode } from "@/lib/questions";
import { loadAnswers, setCountry } from "@/lib/answers";
import { track } from "@/lib/track";

export function CountryStep() {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [selected, setSelected] = useState<CountryCode | null>(null);

  useEffect(() => {
    const stored = loadAnswers();
    // Schutz: ohne 10 Antworten zurück zum Quiz
    if (stored.answers.length < 10) {
      router.replace("/check");
      return;
    }
    setSelected(stored.country ?? null);
    setHydrated(true);
  }, [router]);

  function choose(code: CountryCode) {
    setSelected(code);
    setCountry(code);
    track("country_selected", { country: code });
    router.push("/check/ergebnis");
  }

  function skip() {
    setCountry("unklar");
    track("country_selected", { country: "unklar" });
    router.push("/check/ergebnis");
  }

  if (!hydrated) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-muted">Wird geladen...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper text-ink">
      <header className="border-b border-line">
        <div className="max-w-page mx-auto px-6 md:px-16 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <CompassGlyph size={28} stroke="#1E3A34" accent="#C4926B" />
            <span className="font-serif text-[17px] tracking-tight">
              Auswander-Kompass
            </span>
          </Link>
          <span className="text-[12px] text-muted uppercase tracking-[0.08em]">
            Letzter Schritt
          </span>
        </div>
      </header>

      <div className="border-b border-line">
        <div className="max-w-page mx-auto px-6 md:px-16 py-4 flex items-center justify-between gap-6">
          <div className="text-[12px] uppercase tracking-[0.12em] text-muted">
            Fast geschafft · Zielland
          </div>
          <Progress current={11} total={11} />
        </div>
      </div>

      <section className="max-w-page mx-auto px-6 md:px-16 py-12 md:py-20">
        <div className="max-w-[760px]">
          <h1 className="font-serif font-normal text-[28px] md:text-[40px] leading-[1.15] tracking-[-0.02em] mb-3 text-balance">
            Wohin soll es gehen?
          </h1>
          <p className="text-inkSoft text-[15px] mb-2">
            Dein Zielland bestimmt, welche konkreten Schritte in deinem Fahrplan
            stehen.
          </p>
          <p className="text-muted text-[14px] mb-8">
            Noch unklar? Kein Problem — dann bekommst du die wichtigsten
            länderübergreifenden Schritte.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {COUNTRIES.map((c) => {
            const isSelected = selected === c.code;
            return (
              <button
                key={c.code}
                onClick={() => choose(c.code)}
                className={`text-left p-5 rounded-card border transition-colors ${
                  isSelected
                    ? "bg-fir text-paper border-fir"
                    : "bg-paper text-ink border-line hover:bg-paperAlt hover:border-fir"
                }`}
              >
                <span className="font-serif text-[18px] tracking-tight">
                  {c.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-10 flex items-center justify-between">
          <button
            onClick={() => router.push("/check/10")}
            className="text-[14px] text-inkSoft hover:text-ink"
          >
            ← Zurück
          </button>
          <button
            onClick={skip}
            className="text-[14px] text-muted hover:text-ink underline underline-offset-2"
          >
            Überspringen
          </button>
        </div>
      </section>
    </main>
  );
}
