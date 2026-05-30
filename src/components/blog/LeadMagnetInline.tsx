"use client";

import { useState } from "react";

interface Props {
  title: string;
  description: string;
  source?: string; // tracking-hint, z.B. "start" oder "blog-inline"
}

export function LeadMagnetInline({
  title,
  description,
  source = "blog-inline",
}: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/lead-magnet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Fehler beim Senden");
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler");
      setStatus("error");
    }
  }

  return (
    <aside className="my-8 rounded-card border-l-4 border-fir bg-highlight px-6 py-5">
      <div className="text-[11px] uppercase tracking-[0.14em] text-copper font-medium mb-2">
        Kostenlos herunterladen
      </div>
      <div className="font-serif text-[19px] text-ink leading-snug mb-1">
        {title}
      </div>
      <p className="text-[14px] text-inkSoft leading-[1.5] mb-4">
        {description}
      </p>
      {status === "sent" ? (
        <p className="text-[14px] text-fir font-medium">
          PDF ist unterwegs. Schau in dein Postfach (auch Spam).
        </p>
      ) : (
        <form onSubmit={submit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@beispiel.de"
            className="flex-1 px-4 py-2.5 rounded-card border border-line bg-paper text-[14px] focus:border-fir focus:outline-none"
            disabled={status === "loading"}
          />
          <button
            type="submit"
            disabled={status === "loading" || !email}
            className="px-5 py-2.5 rounded-pill bg-fir text-paper text-[14px] font-medium hover:bg-fir-deep disabled:opacity-60"
          >
            {status === "loading" ? "..." : "PDF herunterladen"}
          </button>
        </form>
      )}
      {error && <p className="mt-2 text-[13px] text-riskRed">{error}</p>}
    </aside>
  );
}
