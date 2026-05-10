"use client";

import { useState } from "react";

export function AccountFooter({ email }: { email: string }) {
  const [loading, setLoading] = useState(false);

  async function openPortal() {
    setLoading(true);
    try {
      const res = await fetch("/api/billing-portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? "Billing Portal aktuell nicht verfügbar.");
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  }

  return (
    <section className="py-16 border-t border-gray-100">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <p className="text-sm text-gray-500 mb-4">
          Angemeldet als <strong className="text-navy">{email}</strong>
        </p>
        <button
          onClick={openPortal}
          disabled={loading}
          className="text-teal hover:text-teal-mid font-semibold underline text-sm disabled:opacity-60"
        >
          {loading ? "Wird geöffnet..." : "Abo verwalten oder kündigen"}
        </button>
        <p className="text-xs text-gray-400 mt-6">
          Auswander-Kompass · 29 €/Monat · jederzeit kündbar
        </p>
      </div>
    </section>
  );
}
