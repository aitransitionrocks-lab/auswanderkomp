import tasksData from "@/data/tasks.json";
import type { ResultData } from "@/lib/result";

interface Task {
  phase: "prep" | "exit" | "arrival";
  prio: "kritisch" | "wichtig" | "optional";
  title: string;
  deadlineDays: number;
  desc: string;
}

const PRIO_ORDER: Record<Task["prio"], number> = {
  kritisch: 0,
  wichtig: 1,
  optional: 2,
};

const PRIO_STYLES: Record<Task["prio"], string> = {
  kritisch: "bg-risk-redBg text-risk-red border-risk-red/30",
  wichtig: "bg-risk-yellowBg text-risk-yellow border-risk-yellow/30",
  optional: "bg-risk-greenBg text-risk-green border-risk-green/30",
};

const PRIO_LABEL: Record<Task["prio"], string> = {
  kritisch: "Kritisch",
  wichtig: "Wichtig",
  optional: "Optional",
};

export function TopThreeTasks({ result }: { result: ResultData }) {
  const country = result.country || "portugal";
  const all = ((tasksData as Record<string, Task[]>)[country] ?? []) as Task[];

  const prepTasks = all
    .filter((t) => t.phase === "prep")
    .sort((a, b) => PRIO_ORDER[a.prio] - PRIO_ORDER[b.prio]);

  const top = prepTasks.slice(0, 3);
  const remaining = all.length - top.length;

  return (
    <section className="max-w-2xl mx-auto px-6 py-10">
      <h2 className="font-display font-bold text-xl text-navy mb-2">
        Ihre drei wichtigsten ersten Schritte
      </h2>
      <p className="text-gray-500 mb-6">
        Aus Ihrem Fahrplan — in der Reihenfolge, die für Ihre Situation
        sinnvoll ist.
      </p>

      <div className="space-y-3">
        {top.map((task, i) => (
          <div
            key={i}
            className="flex gap-4 p-5 bg-white border border-gray-200 rounded-xl"
          >
            <span
              className={`shrink-0 h-fit px-2.5 py-1 rounded-md text-xs font-semibold border ${PRIO_STYLES[task.prio]}`}
            >
              {PRIO_LABEL[task.prio]}
            </span>
            <div>
              <h3 className="font-display font-bold text-navy mb-1">
                {task.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {task.desc}
              </p>
              <p className="text-gray-400 text-xs mt-2">
                {deadlineLabel(task.deadlineDays)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {remaining > 0 && (
        <div className="mt-6 relative">
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-5 blur-[2px] select-none pointer-events-none">
              <div className="flex gap-4">
                <span className="shrink-0 h-fit px-2.5 py-1 rounded-md text-xs bg-gray-100 text-gray-400">
                  ···
                </span>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-56 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-72" />
                </div>
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center bg-white/90 px-6 py-3 rounded-xl border border-gray-200 shadow-sm">
                <p className="font-semibold text-navy">
                  + {remaining} weitere Aufgaben
                </p>
                <p className="text-sm text-gray-500">
                  in Ihrem persönlichen Fahrplan
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function deadlineLabel(days: number): string {
  if (days < 0) return `Vorlauf: ca. ${Math.abs(days)} Tage vor Umzug`;
  if (days === 0) return "Am Umzugstag";
  return `Nach Ankunft: innerhalb ${days} Tagen`;
}
