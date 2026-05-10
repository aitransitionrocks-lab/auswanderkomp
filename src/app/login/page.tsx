"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/login/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Link konnte nicht gesendet werden.");
        setLoading(false);
        return;
      }
      setSent(true);
    } catch {
      setError("Verbindungsproblem. Bitte versuchen Sie es erneut.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6 py-16">
      <div className="max-w-md w-full">
        <h1 className="font-display font-bold text-2xl text-navy mb-3">
          Zugangslink erneut senden
        </h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Geben Sie die E-Mail-Adresse ein, mit der Sie den Kompass gekauft
          haben. Sie erhalten einen Link, mit dem Sie direkt in Ihren Fahrplan
          zurückkehren können.
        </p>

        {sent ? (
          <div className="bg-teal-faint border border-teal-light rounded-xl p-6">
            <p className="text-teal font-semibold mb-2">
              Falls ein aktives Abo existiert, ist der Link unterwegs.
            </p>
            <p className="text-gray-600 text-sm">
              Prüfen Sie Ihren Posteingang — auch den Spam-Ordner. Der Link ist
              30 Tage gültig.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-navy mb-2"
              >
                E-Mail
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
              className="w-full px-6 py-4 bg-teal hover:bg-teal-mid disabled:opacity-60 text-white font-display font-bold rounded-xl transition-all"
            >
              {loading ? "Link wird gesendet..." : "Zugangslink senden"}
            </button>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </form>
        )}

        <p className="text-sm text-gray-400 mt-10 text-center">
          Noch kein Kompass-Zugang?{" "}
          <a href="/" className="text-teal hover:underline">
            Zur Einschätzung
          </a>
        </p>
      </div>
    </main>
  );
}
