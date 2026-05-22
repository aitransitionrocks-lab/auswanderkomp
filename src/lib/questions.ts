export type Segment = "dreamer" | "planer" | "fortgeschrittener" | "starter";

// Zielländer = Keys aus tasks.json + "unklar".
export const COUNTRIES = [
  { code: "portugal", label: "Portugal" },
  { code: "spanien", label: "Spanien" },
  { code: "suedzypern", label: "Süd-Zypern" },
  { code: "nordzypern", label: "Nord-Zypern" },
  { code: "dubai", label: "Dubai / VAE" },
  { code: "thailand", label: "Thailand" },
  { code: "argentinien", label: "Argentinien" },
  { code: "panama", label: "Panama" },
  { code: "usa", label: "USA" },
  { code: "unklar", label: "Noch unklar" },
] as const;

export type CountryCode = (typeof COUNTRIES)[number]["code"];

const COUNTRY_CODES = COUNTRIES.map((c) => c.code) as readonly string[];

export function normalizeCountry(raw: string | undefined | null): CountryCode {
  if (raw && COUNTRY_CODES.includes(raw)) return raw as CountryCode;
  return "unklar";
}

export function countryLabel(code: CountryCode): string {
  return COUNTRIES.find((c) => c.code === code)?.label ?? "Noch unklar";
}

export interface QuizOption {
  option: "A" | "B" | "C" | "D";
  score: 1 | 2 | 3 | 4;
  text: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  dimension: string;
  hook: string;
  helpText?: string;
  answers: QuizOption[];
}

export const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Warum möchtest du auswandern?",
    dimension: "Motivation & Klarheit",
    hook: "Ziel-Bewusstsein",
    answers: [
      { option: "A", score: 1, text: "Ich träume davon, habe aber noch kein konkretes Warum." },
      { option: "B", score: 2, text: "Mehr Freiheit, Sonne und Lebensqualität für meine Familie." },
      { option: "C", score: 3, text: "Steueroptimierung und finanzielle Unabhängigkeit." },
      { option: "D", score: 4, text: "Ich habe ein klares Ziel und einen konkreten Plan dahinter." },
    ],
  },
  {
    id: 2,
    question: "Wie klar ist dein Zielland?",
    dimension: "Zielland-Wissen",
    hook: "Orientierungslücke",
    answers: [
      { option: "A", score: 1, text: "Ich habe noch kein konkretes Land im Kopf." },
      { option: "B", score: 2, text: "Ich habe 2–3 Länder im Kopf, bin noch unentschlossen." },
      { option: "C", score: 3, text: "Ich weiß wohin, kenne aber die lokalen Regeln kaum." },
      { option: "D", score: 4, text: "Ich kenne Steuersystem, Visum und Alltag meines Ziellandes." },
    ],
  },
  {
    id: 3,
    question: "Wann möchtest du auswandern?",
    dimension: "Zeitplan & Dringlichkeit",
    hook: "Urgency-Aufbau",
    answers: [
      { option: "A", score: 1, text: "Irgendwann in den nächsten Jahren — kein fixer Plan." },
      { option: "B", score: 2, text: "In 1–2 Jahren, wenn alles passt." },
      { option: "C", score: 3, text: "In den nächsten 6–12 Monaten — es wird konkret." },
      { option: "D", score: 4, text: "In weniger als 6 Monaten — der Countdown läuft." },
    ],
  },
  {
    id: 4,
    question: "Wie steht es um deine rechtliche & steuerliche Vorbereitung?",
    dimension: "Rechtssicherheit",
    hook: "Fehler-Angst",
    answers: [
      { option: "A", score: 1, text: "Ich habe keine Ahnung, was steuerlich auf mich zukommt." },
      { option: "B", score: 2, text: "Ich weiß, dass es Themen gibt — habe aber noch nichts geprüft." },
      { option: "C", score: 3, text: "Ich habe recherchiert, bin aber bei Details unsicher." },
      { option: "D", score: 4, text: "Ich habe einen Steuerberater und einen rechtlichen Plan." },
    ],
  },
  {
    id: 5,
    question: "Wie ist deine finanzielle Planung für die Auswanderung?",
    dimension: "Finanzielle Bereitschaft",
    hook: "Kosten-Schock-Prävention",
    answers: [
      { option: "A", score: 1, text: "Ich habe keine Vorstellung, was Auswandern wirklich kostet." },
      { option: "B", score: 2, text: "Ich schätze grob — habe aber keine Detailplanung." },
      { option: "C", score: 3, text: "Ich kenne die Hauptkostenblöcke und habe begonnen zu sparen." },
      { option: "D", score: 4, text: "Ich habe einen konkreten Finanzplan inkl. Puffer." },
    ],
  },
  {
    id: 6,
    question: "Hast du Kinder — und wie weit ist ihre Schulplanung?",
    dimension: "Familien-Logistik",
    hook: "Eltern-Verantwortungs-Trigger",
    answers: [
      { option: "A", score: 1, text: "Ich habe Kinder — das ist mein größtes Fragezeichen." },
      { option: "B", score: 2, text: "Ich habe Kinder, mache mir Sorgen, habe noch nichts recherchiert." },
      { option: "C", score: 3, text: "Ich habe Infos über Schulen gesammelt, aber nichts ist sicher." },
      { option: "D", score: 4, text: "Schule ist konkret geplant. / Ich habe keine Kinder." },
    ],
  },
  {
    id: 7,
    question: "Wie steht deine Familie / dein Partner zu dem Plan?",
    dimension: "Familieneinigkeit",
    hook: "Beziehungs-Risiko + Viral-Loop",
    answers: [
      { option: "A", score: 1, text: "Mein Partner / meine Familie ist skeptisch oder nicht überzeugt." },
      { option: "B", score: 2, text: "Wir diskutieren es — sind uns aber noch nicht einig." },
      { option: "C", score: 3, text: "Wir sind grundsätzlich einig, haben aber noch offene Fragen." },
      { option: "D", score: 4, text: "Wir ziehen alle an einem Strang mit dem gleichen Ziel." },
    ],
  },
  {
    id: 8,
    question: "Wie sicher bist du bei Krankenversicherung & Absicherung im Ausland?",
    dimension: "Gesundheits-Absicherung",
    hook: "Angst vor Notfall",
    answers: [
      { option: "A", score: 1, text: "Ich weiß nicht, wie ich im Ausland versichert wäre." },
      { option: "B", score: 2, text: "Ich weiß, dass ich mich darum kümmern muss — noch nichts getan." },
      { option: "C", score: 3, text: "Ich habe erste Optionen recherchiert, bin noch unentschlossen." },
      { option: "D", score: 4, text: "Ich habe eine internationale Krankenversicherung oder einen festen Plan." },
    ],
  },
  {
    id: 9,
    question: "Was passiert mit deiner Firma, Immobilien oder Verträgen in Deutschland?",
    dimension: "Setup-Komplexität",
    hook: "Versteckte Kosten",
    answers: [
      { option: "A", score: 1, text: "Ich weiß nicht, was mit meinen deutschen Verpflichtungen passiert." },
      { option: "B", score: 2, text: "Ich habe Verpflichtungen, weiß aber nicht genau was zu tun ist." },
      { option: "C", score: 3, text: "Ich habe erste Infos — bei Details bin ich noch unsicher." },
      { option: "D", score: 4, text: "Alles ist mit Experten besprochen — ich habe einen klaren Plan." },
    ],
  },
  {
    id: 10,
    question: "Hast du ein Netzwerk aus Menschen, die den Schritt schon gegangen sind?",
    dimension: "Community & Support",
    hook: "Isolation-Angst",
    answers: [
      { option: "A", score: 1, text: "Nein — ich fühle mich damit ziemlich allein." },
      { option: "B", score: 2, text: "Ich folge Accounts online, habe aber keine persönlichen Kontakte." },
      { option: "C", score: 3, text: "Ich kenne einige Leute und habe erste Kontakte geknüpft." },
      { option: "D", score: 4, text: "Ich habe ein aktives Netzwerk aus Experten und Gleichgesinnten." },
    ],
  },
];

export const TOTAL_QUESTIONS = QUESTIONS.length;
