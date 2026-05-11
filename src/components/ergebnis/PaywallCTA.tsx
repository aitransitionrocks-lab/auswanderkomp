"use client";

import { useState } from "react";
import { track } from "@/lib/track";
import type { Segment } from "@/lib/scoring";

interface Props {
  segment: Segment;
  ctaHeadline: string;
  ctaButton: string;
  answers: number[];
  score: number;
}

export function PaywallCTA({ segment, ctaHeadline, ctaButton, answers, score }: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError(null);
    track("checkout_start", { segment, score });

    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ segment, answers, score, email }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(
          data.error ??
            "Der Zahlungsanbieter ist gerade nicht erreichbar. Bitte versuche es später erneut."
        );
        setLoading(false);
      }
    } catch {
      setError("Verbindungsproblem. Bitte versuche es erneut.");
      setLoading(false);
    }
  }

  return (
    <section className="bg-fir text-paper rounded-card overflow-hidden">
      <div className="px-7 md:px-12 py-12 md:py-14">
        <div className="text-[11px] uppercase tracking-[0.14em] text-copper mb-4 font-medium">
          08 — Jetzt freischalten
        </div>
        <h2 className="font-serif text-3xl md:text-[36px] leading-[1.1] tracking-[-0.02em] mb-6 text-balance">
          {ctaHeadline}
        </h2>

        <ul className="space-y-2.5 mb-8 text-[15px]">
          <li className="flex items-start gap-2.5">
            <Check />
            <span>Vollständige Risiko-Karte — alle 4 Kategorien aufgedeckt</span>
          </li>
          <li className="flex items-start gap-2.5">
            <Check />
            <span>Priorisierter Fahrplan: Was zuerst, was kann warten, was hat Fristen</span>
          </li>
          <li className="flex items-start gap-2.5">
            <Check />
            <span>PDF-Download mit deinem persönlichen Profil</span>
          </li>
        </ul>

        <div className="flex items-baseline gap-3 mb-7">
          <span className="font-serif text-[42px] leading-none">27 €</span>
          <span className="text-paper/70 text-[14px]">einmalig · ohne Abo</span>
        </div>

        <form onSubmit={startCheckout} className="space-y-3 max-w-md">
          <div>
            <label htmlFor="email" className="block text-[13px] text-paper/80 mb-1.5">
              E-Mail für den Bericht
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@beispiel.de"
              className="w-full px-4 py-3 rounded-card bg-paper text-ink border-2 border-transparent focus:border-copper focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !email}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-[16px] bg-copper text-fir rounded-pill font-medium hover:bg-copper-deep hover:text-paper disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Weiterleitung zu Stripe..." : ctaButton}
          </button>
          {error && <p className="text-[13px] text-copper">{error}</p>}
        </form>

        <p className="text-[12.5px] text-paper/70 mt-6">
          Sofortiger Zugang nach Zahlung · keine Mitgliedschaft · keine
          Abo-Falle. Zahlung sicher über Stripe.
        </p>
      </div>
    </section>
  );
}

function Check() {
  return (
    <svg
      className="mt-1 shrink-0 text-copper"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 7l3 3 7-7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
