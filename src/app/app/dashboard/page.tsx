import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentProfile, isLifetime } from "@/lib/supabase/profile";
import { countryLabel, type CountryCode } from "@/lib/questions";

export const dynamic = "force-dynamic";

interface TaskRow {
  id: string;
  title: string;
  priority: string;
  phase: string;
  status: string;
}

interface PhaseStat {
  phase: string;
  label: string;
  total: number;
  done: number;
}

export default async function DashboardPage() {
  const profile = await getCurrentProfile();
  if (!profile) {
    return <main className="p-10">Profil nicht gefunden.</main>;
  }

  const supabase = createSupabaseServerClient();
  const { data: tasks } = await supabase
    .from("tasks")
    .select("id, title, priority, phase, status")
    .order("sort_order");

  const list: TaskRow[] = (tasks as TaskRow[] | null) ?? [];
  const total = list.length;
  const done = list.filter((t) => t.status === "done").length;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  const PHASES: Array<[string, string]> = [
    ["vorbereitung", "Vorbereitung"],
    ["umzug", "Umzug"],
    ["ankunft", "Ankunft"],
    ["etablierung", "Etablierung"],
  ];
  const phaseStats: PhaseStat[] = PHASES.map(([phase, label]) => {
    const inPhase = list.filter((t) => t.phase === phase);
    return {
      phase,
      label,
      total: inPhase.length,
      done: inPhase.filter((t) => t.status === "done").length,
    };
  });

  const critical = list
    .filter((t) => t.priority === "kritisch" && t.status !== "done")
    .slice(0, 3);

  const lifetime = isLifetime(profile);
  const country = (profile.quiz_country as CountryCode) ?? "unklar";

  return (
    <main className="max-w-page mx-auto px-6 md:px-16 py-10 md:py-14">
      <div className="mb-2 text-[12px] uppercase tracking-[0.14em] text-copper">
        Hallo {profile.email.split("@")[0]}
      </div>
      <h1 className="font-serif text-3xl md:text-[40px] leading-[1.1] tracking-tight mb-8">
        Dein Auswanderungs-Plan
        {country !== "unklar" && (
          <span className="text-inkSoft"> nach {countryLabel(country)}</span>
        )}
      </h1>

      {!lifetime && (
        <div className="rounded-card border-2 border-fir bg-fir text-paper p-6 md:p-8 mb-10">
          <div className="text-[11px] uppercase tracking-[0.12em] text-copper font-medium mb-2">
            Trial-Modus
          </div>
          <h2 className="font-serif text-2xl mb-3">
            Du hast {total} personalisierte Tasks — aber kannst sie noch nicht bearbeiten.
          </h2>
          <p className="text-paper/85 text-[15px] leading-[1.55] mb-5">
            Mit dem Lifetime-Dashboard (97 € einmalig) hakst du Tasks ab, speicherst
            Dokumente sicher und teilst Sharing-Links mit Beratern.
          </p>
          <Link
            href="/app/upgrade"
            className="inline-flex px-6 py-3 rounded-pill bg-copper text-fir font-medium hover:bg-copper-deep hover:text-paper transition-colors"
          >
            Dashboard freischalten — 97 €
          </Link>
        </div>
      )}

      {total > 0 && (
        <section className="mb-10">
          <div className="text-[11px] uppercase tracking-[0.12em] text-muted font-medium mb-3">
            Fortschritt
          </div>
          <div className="flex items-baseline gap-3 mb-3">
            <span className="font-serif text-[36px] text-fir">{progress}%</span>
            <span className="text-inkSoft text-[14px]">
              {done} von {total} Tasks erledigt
            </span>
          </div>
          <div className="h-2 bg-paperAlt rounded-pill overflow-hidden">
            <div
              className="h-full bg-fir transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </section>
      )}

      {phaseStats.some((p) => p.total > 0) && (
        <section className="mb-10">
          <div className="text-[11px] uppercase tracking-[0.12em] text-muted font-medium mb-3">
            Phasen-Übersicht
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {phaseStats.map((p) => {
              if (p.total === 0) return null;
              const pct = Math.round((p.done / p.total) * 100);
              return (
                <div
                  key={p.phase}
                  className="rounded-card border border-line bg-paper p-4 flex items-baseline justify-between"
                >
                  <span className="font-serif text-[17px]">{p.label}</span>
                  <span className="text-inkSoft text-[14px]">
                    {p.done}/{p.total} · {pct}%
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {critical.length > 0 && (
        <section className="mb-10">
          <div className="text-[11px] uppercase tracking-[0.12em] text-muted font-medium mb-3">
            Kritische nächste Schritte
          </div>
          <div className="space-y-2">
            {critical.map((t) => (
              <div
                key={t.id}
                className="rounded-card border border-line bg-paperAlt p-4 flex items-start gap-3"
              >
                <span className="text-riskRed text-lg leading-none">⚠</span>
                <div className="flex-1">
                  <div className="font-medium text-ink">{t.title}</div>
                  <div className="text-[12px] text-muted">
                    Phase: {t.phase} · Priorität: {t.priority}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/app/roadmap"
            className="inline-block mt-4 text-[14px] text-fir hover:text-fir-deep underline"
          >
            Komplette Roadmap →
          </Link>
        </section>
      )}

      <section>
        <Link
          href="/app/vault"
          className="block rounded-card border border-line bg-paper p-6 hover:border-fir transition-colors"
        >
          <div className="font-serif text-[20px] mb-1">Dokumenten-Tresor</div>
          <div className="text-[14px] text-inkSoft">
            {lifetime
              ? "Pässe, Verträge, Zeugnisse sicher speichern und teilen."
              : "Im Lifetime-Dashboard verfügbar."}
          </div>
        </Link>
      </section>
    </main>
  );
}
