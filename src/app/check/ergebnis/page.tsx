"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CompassGlyph } from "@/components/brand/CompassGlyph";
import { RiskCompass } from "@/components/ergebnis/RiskCompass";
import { LockedCard } from "@/components/ergebnis/LockedCard";
import { PaywallCTA } from "@/components/ergebnis/PaywallCTA";
import {
  calculateScore,
  getSegment,
  getRiskProfile,
  RISK_CATEGORY_LABEL,
  type RiskProfile,
  type Segment,
} from "@/lib/scoring";
import { SEGMENTS } from "@/lib/segments";
import { loadAnswers } from "@/lib/answers";
import { track } from "@/lib/track";

export default function ErgebnisPage() {
  const router = useRouter();
  const [state, setState] = useState<{
    answers: number[];
    score: number;
    segment: Segment;
    risk: RiskProfile;
  } | null>(null);

  useEffect(() => {
    const stored = loadAnswers();
    if (stored.answers.length !== 10) {
      router.replace("/check");
      return;
    }
    try {
      const score = calculateScore(stored.answers);
      const segment = getSegment(score);
      const risk = getRiskProfile(stored.answers);
      setState({ answers: stored.answers, score, segment, risk });
      track("diagnose_complete", {
        segment,
        score,
        risk_level: worstRisk(risk),
      });
      track("result_view", { segment, score });
      track("paywall_view", { segment });
    } catch {
      router.replace("/check");
    }
  }, [router]);

  if (!state) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-muted">Wird berechnet...</p>
      </main>
    );
  }

  const seg = SEGMENTS[state.segment];
  const urgent = state.answers[2] >= 3; // Frage 3 score >= 3
  const firstRiskKey = lowestRiskKey(state.risk);

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
          <span className="text-[12px] text-muted uppercase tracking-[0.08em]">
            Ergebnis · 10 von 10
          </span>
        </div>
      </header>

      {/* Zone A — Diagnose */}
      <section className="px-6 md:px-16 py-12 md:py-20">
        <div className="max-w-[840px] mx-auto">
          <div className="text-[12px] uppercase tracking-[0.14em] text-copper mb-3">
            Dein Segment
          </div>
          <h1 className="font-serif text-4xl md:text-[52px] leading-[1.05] tracking-[-0.025em] text-fir mb-3">
            {seg.name}
          </h1>
          <p className="text-[15px] text-muted mb-7">
            Du hast <strong className="text-ink">{state.score} von 40 Punkten</strong> · {seg.scoreRange}
          </p>
          <p className="text-[17px] leading-[1.6] text-inkSoft mb-10 max-w-[60ch]">
            {seg.opening}
          </p>

          <div className="mb-12">
            <div className="text-[12px] uppercase tracking-[0.14em] text-muted mb-4 font-medium">
              Dein Risiko-Kompass
            </div>
            <RiskCompass risk={state.risk} />
          </div>

          {firstRiskKey && (
            <div className="mb-12 p-7 rounded-card border border-line bg-paperAlt">
              <div className="text-[11px] uppercase tracking-[0.14em] text-copper font-medium mb-2">
                Dein erster Risikopunkt
              </div>
              <h3 className="font-serif text-[24px] text-ink tracking-tight mb-3">
                {RISK_CATEGORY_LABEL[firstRiskKey]}
              </h3>
              <p className="text-[15.5px] text-inkSoft leading-[1.6]">
                {seg.bridge}
              </p>
            </div>
          )}

          {urgent && (
            <div className="mb-12 p-5 rounded-card border-l-4 border-copper bg-highlight">
              <p className="text-[15px] text-ink italic font-serif">
                Du planst deinen Wegzug in den nächsten 6–12 Monaten. Das
                bedeutet: die kritischen Punkte oben müssen vor deinem Wegzug
                geklärt sein.
              </p>
            </div>
          )}

          {/* Zone B — Locked */}
          <div className="mb-12">
            <div className="text-[12px] uppercase tracking-[0.14em] text-muted mb-4 font-medium">
              Wir haben weitere kritische Punkte in deiner Situation identifiziert
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <LockedCard
                title="Deine 3 Kernlücken im Detail"
                hint="Persönlich formulierte Lücken-Beschreibung mit konkreten nächsten Schritten."
              />
              <LockedCard
                title="Priorisierter Fahrplan"
                hint="Was zuerst, was zeitkritisch, was kann warten — als Reihenfolge mit Fristen."
              />
            </div>
          </div>

          {/* Zone C — Paywall */}
          <PaywallCTA
            segment={state.segment}
            ctaHeadline={seg.ctaHeadline}
            ctaButton={seg.ctaButton}
            answers={state.answers}
            score={state.score}
          />
        </div>
      </section>
    </main>
  );
}

function worstRisk(r: RiskProfile): "red" | "yellow" | "green" {
  const levels = [r.steuerRecht, r.absicherung, r.planungTiming, r.familieUmfeld];
  if (levels.includes("red")) return "red";
  if (levels.includes("yellow")) return "yellow";
  return "green";
}

function lowestRiskKey(r: RiskProfile): keyof RiskProfile | null {
  const order: (keyof RiskProfile)[] = [
    "steuerRecht",
    "absicherung",
    "planungTiming",
    "familieUmfeld",
  ];
  const red = order.find((k) => r[k] === "red");
  if (red) return red;
  const yellow = order.find((k) => r[k] === "yellow");
  if (yellow) return yellow;
  return order[0];
}
