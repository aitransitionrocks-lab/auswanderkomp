"use client";

import { useState } from "react";

export function ModulePurchaseButton({ slug }: { slug: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function checkout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/dashboard/modules/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Checkout konnte nicht gestartet werden.");
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler");
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={checkout}
        disabled={loading}
        className="w-full sm:w-auto px-6 py-3 rounded-pill bg-fir text-paper font-medium hover:bg-fir-deep disabled:opacity-60"
      >
        {loading ? "Weiterleitung..." : "Jetzt freischalten"}
      </button>
      {error && <p className="mt-3 text-[13px] text-riskRed">{error}</p>}
    </>
  );
}
