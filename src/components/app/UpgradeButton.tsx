"use client";

import { useState } from "react";

export function UpgradeButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function go() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/upsell-checkout-direct", {
        method: "POST",
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error ?? "Aktuell nicht verfügbar.");
        setLoading(false);
      }
    } catch {
      setError("Verbindungsproblem.");
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={go}
        disabled={loading}
        className="inline-flex px-7 py-4 bg-fir text-paper rounded-pill font-medium hover:bg-fir-deep disabled:opacity-60"
      >
        {loading ? "Wird vorbereitet..." : "Lifetime-Zugang — 97 €"}
      </button>
      {error && <p className="mt-3 text-[13px] text-riskRed">{error}</p>}
    </>
  );
}
