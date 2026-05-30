import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentProfile, isLifetime } from "@/lib/supabase/profile";
import { TaskRow } from "@/components/dashboard/TaskRow";

export const dynamic = "force-dynamic";

interface Task {
  id: string;
  title: string;
  description: string | null;
  category: string;
  priority: string;
  phase: string;
  status: string;
}

const PHASES: Array<[string, string]> = [
  ["vorbereitung", "Phase 1 — Vorbereitung"],
  ["umzug", "Phase 2 — Umzug"],
  ["ankunft", "Phase 3 — Ankunft"],
  ["etablierung", "Phase 4 — Etablierung"],
];

const SEGMENT_LABEL: Record<string, string> = {
  dreamer: "Träumer",
  planer: "Planer",
  fortgeschrittener: "Fortgeschrittener",
  starter: "Starter",
};

const COUNTRY_LABEL: Record<string, string> = {
  portugal: "Portugal",
  dubai: "Dubai / VAE",
  spanien: "Spanien",
  suedzypern: "Süd-Zypern",
  nordzypern: "Nord-Zypern",
  thailand: "Thailand",
  argentinien: "Argentinien",
  panama: "Panama",
  usa: "USA",
  unklar: "Noch unklar",
};

export default async function RoadmapPage() {
  const profile = await getCurrentProfile();
  if (!profile) return <main className="p-10">Profil nicht gefunden.</main>;

  const supabase = createSupabaseServerClient();
  const { data: tasks } = await supabase
    .from("tasks")
    .select("id, title, description, category, priority, phase, status")
    .order("sort_order");

  const list: Task[] = (tasks as Task[] | null) ?? [];
  const editable = isLifetime(profile);

  const total = list.length;
  const done = list.filter((t) => t.status === "done").length;
  const open = total - done;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  const critical = list
    .filter((t) => t.priority === "kritisch" && t.status !== "done")
    .slice(0, 3);

  const segmentLabel = profile.quiz_segment
    ? SEGMENT_LABEL[profile.quiz_segment] ?? profile.quiz_segment
    : null;
  const countryLabel = profile.quiz_country
    ? COUNTRY_LABEL[profile.quiz_country] ?? profile.quiz_country
    : null;

  return (
    <main className="max-w-page mx-auto px-5 md:px-16 py-8 md:py-14">
      {(segmentLabel || countryLabel) && (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {segmentLabel && (
            <span className="inline-flex items-center rounded-full bg-fir/10 text-fir px-3 py-1 text-[11px] uppercase tracking-[0.12em] font-medium">
              {segmentLabel}
            </span>
          )}
          {countryLabel && (
            <span className="text-[12px] text-muted">
              Zielland · {countryLabel}
            </span>
          )}
          {typeof profile.quiz_score === "number" && (
            <span className="text-[12px] text-muted">
              · Score {profile.quiz_score}/100
            </span>
          )}
        </div>
      )}

      <h1 className="font-serif text-[28px] md:text-[36px] tracking-tight mb-1">
        Deine Roadmap
      </h1>
      <p className="text-[14px] text-inkSoft mb-6">
        {total} Tasks · {open} offen · {done} erledigt
      </p>

      {!editable && (
        <div className="rounded-card border border-line bg-paperAlt p-5 mb-6">
          <p className="text-[14px] text-inkSoft mb-2">
            <strong className="text-ink">Read-only Trial-Modus.</strong>{" "}
            Lifetime schaltet Tasks abhaken, Notizen und Tresor frei.
          </p>
          <Link
            href="/dashboard/upgrade"
            className="text-[13px] text-fir hover:text-fir-deep underline"
          >
            Jetzt freischalten →
          </Link>
        </div>
      )}

      {total > 0 && (
        <section className="rounded-card border border-line bg-paper p-5 mb-6">
          <div className="flex items-baseline justify-between mb-2">
            <h2 className="font-serif text-[18px] text-ink tracking-tight">
              Fortschritt
            </h2>
            <span className="text-[13px] text-muted">{progress}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-line/60 overflow-hidden">
            <div
              className="h-full bg-fir transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            {PHASES.map(([phase, label]) => {
              const inPhase = list.filter((t) => t.phase === phase);
              const phaseDone = inPhase.filter((t) => t.status === "done").length;
              return (
                <div
                  key={phase}
                  className="rounded-card border border-line p-3"
                >
                  <div className="text-[11px] uppercase tracking-[0.1em] text-muted">
                    {label.split(" — ")[0]}
                  </div>
                  <div className="font-serif text-[18px] text-ink mt-1">
                    {phaseDone}/{inPhase.length}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {critical.length > 0 && (
        <section className="rounded-card border border-riskRed/30 bg-riskRed/5 p-5 mb-8">
          <h2 className="font-serif text-[18px] text-ink tracking-tight mb-3">
            Kritisch — als Nächstes
          </h2>
          <ul className="space-y-2">
            {critical.map((t) => (
              <li key={t.id} className="flex items-start gap-2 text-[14px]">
                <span className="text-riskRed mt-0.5">•</span>
                <span className="text-ink">{t.title}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {list.length === 0 ? (
        <p className="text-muted">Noch keine Tasks vorhanden.</p>
      ) : (
        <div className="space-y-10">
          {PHASES.map(([phase, label]) => {
            const inPhase = list.filter((t) => t.phase === phase);
            if (inPhase.length === 0) return null;
            return (
              <section key={phase}>
                <div className="flex items-baseline justify-between mb-4">
                  <h2 className="font-serif text-[22px] text-ink tracking-tight">
                    {label}
                  </h2>
                  <span className="text-[13px] text-muted">
                    {inPhase.length} Tasks
                  </span>
                </div>
                <div className="space-y-2">
                  {inPhase.map((t) => (
                    <TaskRow
                      key={t.id}
                      id={t.id}
                      title={t.title}
                      description={t.description}
                      category={t.category}
                      priority={t.priority}
                      status={t.status}
                      editable={editable}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
}
