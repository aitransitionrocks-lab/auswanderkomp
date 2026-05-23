"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function UpsellInner() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!sessionId) return null;

  async function activate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/upsell-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ previousSessionId: sessionId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(
          data.error ?? "Upsell aktuell nicht verfügbar. Bitte später erneut versuchen."
        );
        setLoading(false);
      }
    } catch {
      setError("Verbindungsproblem. Bitte erneut versuchen.");
      setLoading(false);
    }
  }

  return (
    <div className="mt-12 rounded-card border-2 border-fir bg-fir text-paper p-7 md:p-10 text-left">
      <div className="text-[11px] uppercase tracking-[0.14em] text-copper font-medium mb-3">
        Warte — bevor du gehst
      </div>
      <h2 className="font-serif text-2xl md:text-[32px] leading-[1.15] tracking-tight mb-4">
        Familien wie deine geben am Anfang Excel eine Chance. Nach 6 Wochen
        funktioniert das nicht mehr.
      </h2>
      <p className="text-paper/85 text-[15px] leading-[1.55] mb-6">
        Das Dashboard zum Kompass:
      </p>
      <ul className="space-y-2.5 mb-7 text-[15px] text-paper/90">
        <li>✓ Deine Roadmap als klickbare Liste — Status, Fortschritt, Notizen</li>
        <li>✓ Dokumenten-Tresor für Pass, Steuer, Schulanmeldungen</li>
        <li>✓ Sichere Sharing-Links für Steuerberater &amp; Anwälte</li>
        <li>✓ Alle zukünftigen Updates inklusive — lebenslang</li>
      </ul>
      <div className="flex items-baseline gap-3 mb-6">
        <span className="font-serif text-[36px] leading-none">97 €</span>
        <span className="text-paper/70 text-[14px]">einmalig · kein Abo · Lifetime</span>
      </div>
      <button
        onClick={activate}
        disabled={loading}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 bg-copper text-fir rounded-pill font-medium hover:bg-copper-deep hover:text-paper disabled:opacity-60 transition-colors"
      >
        {loading ? "Wird vorbereitet..." : "Mit einem Klick aktivieren"}
      </button>
      <p className="text-paper/60 text-[12.5px] mt-4">
        Stripe-Session ist noch offen — keine erneute Karten-Eingabe nötig.
      </p>
      {error && <p className="mt-4 text-copper text-[13px]">{error}</p>}
    </div>
  );
}

export function UpsellCard() {
  return (
    <Suspense fallback={null}>
      <UpsellInner />
    </Suspense>
  );
}
