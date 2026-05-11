// LocalStorage / SessionStorage Helper für Quiz-Antworten.
// Bewusst sessionStorage: anonym bis Checkout, Browser-Tab-scoped.

const STORAGE_KEY = "ak_quiz_answers_v2";

export interface StoredAnswers {
  answers: number[]; // 1-basiert: index 0 = Frage 1
  step: number; // 1..11 (10 = letzte Frage, 11 = ergebnis)
}

export function loadAnswers(): StoredAnswers {
  if (typeof window === "undefined") return { answers: [], step: 1 };
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return { answers: [], step: 1 };
    const parsed = JSON.parse(raw) as StoredAnswers;
    if (!Array.isArray(parsed.answers)) return { answers: [], step: 1 };
    return parsed;
  } catch {
    return { answers: [], step: 1 };
  }
}

export function saveAnswers(data: StoredAnswers) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearAnswers() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}
