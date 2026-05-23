"use client";

import { useState, useTransition } from "react";

const STATUS_LABEL: Record<string, string> = {
  open: "Offen",
  in_progress: "In Arbeit",
  done: "Erledigt",
  not_relevant: "Nicht relevant",
};

const PRIO_COLOR: Record<string, string> = {
  kritisch: "text-riskRed",
  wichtig: "text-copper-deep",
  optional: "text-riskGreen",
};

interface Props {
  id: string;
  title: string;
  description: string | null;
  category: string;
  priority: string;
  status: string;
  editable: boolean;
}

export function TaskRow({
  id,
  title,
  description,
  category,
  priority,
  status: initialStatus,
  editable,
}: Props) {
  const [status, setStatus] = useState(initialStatus);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function updateStatus(newStatus: string) {
    const previous = status;
    setStatus(newStatus);
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/tasks/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      } catch {
        setStatus(previous);
        setError("Status konnte nicht gespeichert werden.");
      }
    });
  }

  const isDone = status === "done";

  return (
    <div
      className={`rounded-card border p-4 flex items-start gap-3 ${
        isDone ? "border-line/60 bg-paperAlt/50" : "border-line bg-paper"
      }`}
    >
      <button
        onClick={() =>
          editable && updateStatus(isDone ? "open" : "done")
        }
        disabled={!editable || pending}
        className={`shrink-0 w-5 h-5 rounded border-2 mt-0.5 ${
          isDone ? "bg-fir border-fir" : "bg-paper border-line"
        } ${editable ? "cursor-pointer" : "cursor-not-allowed opacity-60"}`}
        aria-label={isDone ? "Als offen markieren" : "Als erledigt markieren"}
      >
        {isDone && (
          <span className="block text-paper text-[12px] leading-none">✓</span>
        )}
      </button>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-[10px] uppercase tracking-[0.12em] font-medium ${PRIO_COLOR[priority]}`}>
            {priority}
          </span>
          <span className="text-[10px] uppercase tracking-[0.08em] text-muted">
            · {category}
          </span>
        </div>
        <div
          className={`font-medium ${
            isDone ? "line-through text-inkSoft" : "text-ink"
          }`}
        >
          {title}
        </div>
        {description && (
          <p className="text-[14px] text-inkSoft mt-1 leading-[1.5]">
            {description}
          </p>
        )}
        {editable && (
          <select
            value={status}
            onChange={(e) => updateStatus(e.target.value)}
            disabled={pending}
            className="mt-2 text-[12px] px-2 py-1 rounded border border-line bg-paper"
          >
            {Object.entries(STATUS_LABEL).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        )}
        {error && <p className="text-[12px] text-riskRed mt-1">{error}</p>}
      </div>
    </div>
  );
}
