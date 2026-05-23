"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { CompassGlyph } from "@/components/brand/CompassGlyph";

function LoginInner() {
  const params = useSearchParams();
  const next = params.get("next") ?? "/app/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"magic" | "password">("magic");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
          shouldCreateUser: false,
        },
      });
      if (error) throw error;
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login fehlgeschlagen");
      setStatus("error");
    }
  }

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      window.location.href = next;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login fehlgeschlagen");
      setStatus("error");
    }
  }

  async function handleGoogle() {
    setStatus("loading");
    setError(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google-Login fehlgeschlagen");
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen bg-paper text-ink flex flex-col">
      <header className="border-b border-line">
        <div className="max-w-page mx-auto px-6 md:px-16 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <CompassGlyph size={28} stroke="#1E3A34" accent="#C4926B" />
            <span className="font-serif text-[17px] tracking-tight">
              Auswander-Kompass
            </span>
          </Link>
          <span className="text-[12px] uppercase tracking-[0.08em] text-muted">
            Login
          </span>
        </div>
      </header>

      <section className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[420px]">
          <h1 className="font-serif text-3xl text-ink mb-2 tracking-tight">
            Einloggen
          </h1>
          <p className="text-inkSoft text-[15px] mb-8">
            Zugang zu deinem Dashboard.
          </p>

          {status === "sent" ? (
            <div className="rounded-card border border-line bg-paperAlt p-5">
              <p className="text-ink font-medium mb-1">Mail ist unterwegs.</p>
              <p className="text-inkSoft text-[14px]">
                Wir haben einen Magic-Link an <strong>{email}</strong>
                geschickt. Klick auf den Link in der Mail, um dich einzuloggen.
              </p>
            </div>
          ) : (
            <>
              <form
                onSubmit={mode === "magic" ? handleMagicLink : handlePassword}
                className="space-y-3"
              >
                <div>
                  <label className="block text-[13px] text-inkSoft mb-1.5">
                    E-Mail
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@beispiel.de"
                    className="w-full px-4 py-3 rounded-card border border-line bg-paper focus:border-fir focus:outline-none"
                  />
                </div>
                {mode === "password" && (
                  <div>
                    <label className="block text-[13px] text-inkSoft mb-1.5">
                      Passwort
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-card border border-line bg-paper focus:border-fir focus:outline-none"
                    />
                  </div>
                )}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full px-5 py-3 rounded-pill bg-fir text-paper font-medium hover:bg-fir-deep disabled:opacity-60"
                >
                  {status === "loading"
                    ? "..."
                    : mode === "magic"
                    ? "Magic-Link senden"
                    : "Einloggen"}
                </button>
              </form>

              <div className="text-center my-4 text-[13px] text-muted">oder</div>

              <button
                onClick={handleGoogle}
                disabled={status === "loading"}
                className="w-full px-5 py-3 rounded-pill border border-line bg-paper hover:bg-paperAlt text-ink font-medium"
              >
                Mit Google einloggen
              </button>

              <button
                onClick={() => setMode(mode === "magic" ? "password" : "magic")}
                className="block mx-auto mt-6 text-[13px] text-muted hover:text-ink underline underline-offset-2"
              >
                {mode === "magic"
                  ? "Mit Passwort einloggen"
                  : "Lieber Magic-Link"}
              </button>

              {error && (
                <p className="mt-4 text-[13px] text-riskRed">{error}</p>
              )}
            </>
          )}

          <p className="mt-10 text-[13px] text-muted text-center">
            Noch kein Account? Du bekommst nach dem Quiz-Kauf automatisch einen
            Zugang.
          </p>
        </div>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted">Wird geladen...</p>
        </div>
      }
    >
      <LoginInner />
    </Suspense>
  );
}
