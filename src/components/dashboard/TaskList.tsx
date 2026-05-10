import tasksData from "@/data/tasks.json";

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

const PHASE_LABEL: Record<Task["phase"], string> = {
  prep: "Vorbereitung",
  exit: "Ausreise",
  arrival: "Ankunft",
};

const PHASE_DESC: Record<Task["phase"], string> = {
  prep: "Bevor Sie Deutschland verlassen — meist 3–6 Monate vorher.",
  exit: "Die letzten Wochen und Tage vor dem Umzug.",
  arrival: "Die ersten Wochen und Monate im neuen Land.",
};

function deadlineLabel(days: number): string {
  if (days < 0) return `Vorlauf: ca. ${Math.abs(days)} Tage vor Umzug`;
  if (days === 0) return "Am Umzugstag";
  return `Nach Ankunft: innerhalb ${days} Tagen`;
}

export function TaskList({ country }: { country: string }) {
  const all = ((tasksData as Record<string, Task[]>)[country] ?? []) as Task[];
  if (all.length === 0) {
    return (
      <section className="max-w-3xl mx-auto px-6 py-10">
        <p className="text-gray-500">
          Für dieses Zielland liegt aktuell noch keine Aufgabenliste vor. Wir
          erweitern die Liste kontinuierlich.
        </p>
      </section>
    );
  }

  const phases: Task["phase"][] = ["prep", "exit", "arrival"];

  return (
    <section className="max-w-3xl mx-auto px-6 py-10 space-y-12">
      {phases.map((phase) => {
        const tasks = all
          .filter((t) => t.phase === phase)
          .sort((a, b) => PRIO_ORDER[a.prio] - PRIO_ORDER[b.prio]);
        if (tasks.length === 0) return null;
        return (
          <div key={phase}>
            <div className="mb-4">
              <h2 className="font-display font-bold text-xl text-navy">
                {PHASE_LABEL[phase]}
                <span className="text-sm text-gray-400 font-normal ml-3">
                  {tasks.length} Aufgaben
                </span>
              </h2>
              <p className="text-gray-500 text-sm mt-1">{PHASE_DESC[phase]}</p>
            </div>
            <div className="space-y-3">
              {tasks.map((task, i) => (
                <div
                  key={i}
                  className="flex gap-4 p-5 bg-white border border-gray-200 rounded-xl"
                >
                  <span
                    className={`shrink-0 h-fit px-2.5 py-1 rounded-md text-xs font-semibold border ${PRIO_STYLES[task.prio]}`}
                  >
                    {PRIO_LABEL[task.prio]}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-display font-bold text-navy mb-1">
                      {task.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-2">
                      {task.desc}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {deadlineLabel(task.deadlineDays)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
