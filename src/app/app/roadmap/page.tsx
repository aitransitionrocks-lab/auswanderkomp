import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentProfile, isLifetime } from "@/lib/supabase/profile";
import { TaskRow } from "@/components/app/TaskRow";

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
  const open = list.filter((t) => t.status !== "done").length;
  const done = list.filter((t) => t.status === "done").length;

  return (
    <main className="max-w-page mx-auto px-6 md:px-16 py-10 md:py-14">
      <div className="flex items-baseline justify-between mb-2">
        <h1 className="font-serif text-3xl md:text-[36px] tracking-tight">
          Roadmap
        </h1>
        <div className="text-[13px] text-muted">
          {total} Tasks · {open} offen · {done} erledigt
        </div>
      </div>

      {!editable && (
        <div className="rounded-card border border-line bg-paperAlt p-5 mb-8">
          <p className="text-[14px] text-inkSoft mb-2">
            <strong className="text-ink">Read-only Trial-Modus.</strong> Mit dem
            Lifetime-Dashboard kannst du Tasks abhaken, Notizen ergänzen und
            Fortschritt nachverfolgen.
          </p>
          <Link
            href="/app/upgrade"
            className="text-[13px] text-fir hover:text-fir-deep underline"
          >
            Jetzt freischalten →
          </Link>
        </div>
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
