"use client";

import { useState } from "react";
import { track } from "@/lib/track";
import type { ResultData } from "@/lib/result";

export function PaywallCTA({ result }: { result: ResultData }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError(null);
    track("checkout_start", { segment: result.segment });

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          country: result.country,
          submission_id: result.id,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(
          data.error ??
            "Der Zahlungsanbieter ist gerade nicht erreichbar. Bitte versuchen Sie es in wenigen Minuten erneut."
        );
        setLoading(false);
      }
    } catch {
      setError("Verbindungsproblem. Bitte versuchen Sie es erneut.");
      setLoading(false);
    }
  }

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-xl mx-auto px-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-10">
          {/* Produktname + Preis */}
          <div className="text-center mb-8">
            <h2 className="font-display font-bold text-2xl text-navy">
              Auswander-Kompass
            </h2>
            <div className="w-12 h-0.5 bg-teal mx-auto my-4" />
            <p className="font-display font-bold text-3xl text-navy">
              29 €/Monat
            </p>
            <p className="text-sm text-gray-400 mt-1">
              weniger als 1 € pro Tag
            </p>
            <p className="text-sm text-gray-400 mt-0.5">
              jederzeit mit einem Klick kündbar
            </p>
          </div>

          {/* Was drin */}
          <div className="mb-6">
            <p className="font-display font-semibold text-xs tracking-wide uppercase text-gray-400 mb-3">
              In Ihrem Zugang enthalten
            </p>
            <ul className="space-y-3 text-gray-700">
              <li>
                <strong className="text-navy">Ihr vollständiger Fahrplan</strong>
                {" "}— alle Aufgaben für Ihr Zielland in der sinnvollen
                Reihenfolge, aufgeteilt in Vorbereitung, Ausreise und Ankunft.
              </li>
              <li>
                <strong className="text-navy">Deadline-Logik</strong> — zu jeder
                Aufgabe ein Zeitrahmen, der sich an Ihrem Umzugstermin orientiert.
              </li>
              <li>
                <strong className="text-navy">Kurzerklärung pro Schritt</strong>
                {" "}— warum dieser Schritt, warum jetzt, und was typischerweise
                schiefgeht.
              </li>
              <li>
                <strong className="text-navy">Aktualisierung Ihres Profils</strong>
                {" "}— wenn sich Ihr Zeitplan oder Ihr Zielland ändert, passt sich
                der Fahrplan an.
              </li>
              <li>
                <strong className="text-navy">Verweise zu Expert:innen</strong>
                {" "}— wenn ein Schritt externe Hilfe braucht, verweisen wir auf
                spezialisierte Ansprechpartner.
              </li>
            </ul>
          </div>

          {/* Was NICHT drin */}
          <div className="mb-8 p-5 bg-gray-50 rounded-lg">
            <p className="font-display font-semibold text-xs tracking-wide uppercase text-gray-400 mb-2">
              Was wir nicht liefern
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              Keine persönliche Beratung. Keine Behördengänge in Ihrem Namen.
              Keine Dokumentenbeglaubigung. Der Auswander-Kompass ersetzt keinen
              Steuerberater und keinen Anwalt — er sagt Ihnen, wann und wofür
              Sie einen brauchen.
            </p>
          </div>

          {/* Risikoreduktion */}
          <ul className="mb-8 text-sm text-gray-600 space-y-1.5">
            <li>
              · Sie können jederzeit selbst kündigen — über den
              Stripe-Kundenbereich, keine E-Mail nötig.
            </li>
            <li>
              · 14 Tage Rückgaberecht. Wenn der Fahrplan in Ihrer Situation
              nichts bringt, schreiben Sie uns und wir erstatten.
            </li>
          </ul>

          {/* Form */}
          <form onSubmit={handleCheckout} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-navy mb-2"
              >
                Ihre E-Mail
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@beispiel.de"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full px-6 py-4 bg-teal hover:bg-teal-mid disabled:opacity-60 disabled:cursor-not-allowed text-white font-display font-bold text-lg rounded-xl transition-all duration-200"
            >
              {loading ? "Weiterleitung zu Stripe..." : "Zugang freischalten — 29 €/Monat"}
            </button>

            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}

            <p className="text-xs text-gray-400 text-center">
              Zahlung sicher über Stripe. Keine Angabe von Kreditkartendaten auf
              dieser Seite.
            </p>
          </form>

          {/* Fine Print */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-xs text-gray-400 space-y-1.5">
            <p>
              · Abo verlängert sich monatlich, solange Sie nicht kündigen.
            </p>
            <p>
              · Preis gilt inkl. MwSt. für Deutschland, Österreich und die Schweiz.
            </p>
            <p>
              <a href="/rechtliches/impressum" className="underline hover:text-gray-600">Impressum</a>
              {" · "}
              <a href="/rechtliches/agb" className="underline hover:text-gray-600">AGB</a>
              {" · "}
              <a href="/rechtliches/datenschutz" className="underline hover:text-gray-600">Datenschutz</a>
              {" · "}
              <a href="/rechtliches/widerruf" className="underline hover:text-gray-600">Widerrufsbelehrung</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
