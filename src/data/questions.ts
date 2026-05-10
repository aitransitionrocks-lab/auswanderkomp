export interface QuizOption {
  value: string | number | boolean | null;
  label: string;
}

export interface QuizQuestionDef {
  id: number;
  field: string;
  question: string;
  subtitle?: string;
  type: "single";
  options: QuizOption[];
}

export const QUIZ_QUESTIONS: QuizQuestionDef[] = [
  {
    id: 1,
    field: "country",
    question: "In welches Land wollen Sie auswandern?",
    subtitle:
      'Wenn Sie noch unentschlossen sind, ist das kein Problem — wählen Sie „Noch offen".',
    type: "single",
    options: [
      { value: "portugal", label: "Portugal" },
      { value: "dubai", label: "Dubai / VAE" },
      { value: "spanien", label: "Spanien" },
      { value: "suedzypern", label: "Süd-Zypern" },
      { value: "nordzypern", label: "Nord-Zypern" },
      { value: "thailand", label: "Thailand" },
      { value: "argentinien", label: "Argentinien" },
      { value: "panama", label: "Panama" },
      { value: "usa", label: "USA" },
      { value: "andere", label: "Noch offen" },
    ],
  },
  {
    id: 2,
    field: "dDayMonths",
    question: "Wann möchten Sie umziehen?",
    type: "single",
    options: [
      { value: 2, label: "In weniger als 3 Monaten" },
      { value: 6, label: "In 3 bis 6 Monaten" },
      { value: 10, label: "In 6 bis 12 Monaten" },
      { value: 18, label: "In 12 bis 24 Monaten" },
      { value: 36, label: "Später oder noch unklar" },
      { value: null, label: "Noch kein Plan" },
    ],
  },
  {
    id: 3,
    field: "childrenCount",
    question: "Wie viele Kinder ziehen mit?",
    type: "single",
    options: [
      { value: 0, label: "Keine Kinder" },
      { value: 1, label: "Ein Kind" },
      { value: 2, label: "Zwei Kinder" },
      { value: 3, label: "Drei oder mehr" },
    ],
  },
  {
    id: 4,
    field: "childrenAgeGroup",
    question: "In welchem Alter sind Ihre Kinder (überwiegend)?",
    subtitle:
      "Diese Frage bestimmt, welche Schulthemen in Ihrem Fahrplan erscheinen.",
    type: "single",
    options: [
      { value: "none", label: "Ich habe keine Kinder" },
      { value: "preschool", label: "Vorschule / Kindergarten" },
      { value: "primary", label: "Grundschule" },
      { value: "secondary", label: "Weiterführende Schule" },
      { value: "mixed", label: "Gemischt" },
    ],
  },
  {
    id: 5,
    field: "employment",
    question: "Was beschreibt Ihre berufliche Situation am besten?",
    type: "single",
    options: [
      { value: "employed", label: "Angestellt" },
      { value: "freelancer", label: "Freiberuflich / Einzelunternehmer" },
      { value: "gmbh", label: "Geschäftsführer mit eigener GmbH" },
      { value: "mixed", label: "Mischung aus mehreren Formen" },
      { value: "retired", label: "Im Ruhestand / Privatier" },
    ],
  },
  {
    id: 6,
    field: "hasGmbh",
    question: "Sind Sie an einer GmbH oder ähnlichen Kapitalgesellschaft beteiligt?",
    subtitle:
      'Für §6 AStG („Wegzugsbesteuerung") ist das der entscheidende Punkt.',
    type: "single",
    options: [
      { value: true, label: "Ja" },
      { value: false, label: "Nein" },
      { value: null, label: "Bin mir nicht sicher" },
    ],
  },
  {
    id: 7,
    field: "kvType",
    question: "Wie sind Sie aktuell krankenversichert?",
    type: "single",
    options: [
      { value: "gkv", label: "Gesetzlich (GKV)" },
      { value: "pkv", label: "Privat (PKV)" },
      { value: "international", label: "Bereits international versichert" },
      { value: "none", label: "Aktuell ohne Versicherung" },
    ],
  },
  {
    id: 8,
    field: "hasProperty",
    question: "Besitzen Sie in Deutschland Immobilien?",
    subtitle:
      "Vermietung, Verkauf und Hypotheken verhalten sich ab Wegzug anders.",
    type: "single",
    options: [
      { value: true, label: "Ja" },
      { value: false, label: "Nein" },
    ],
  },
  {
    id: 9,
    field: "taxAdviceStatus",
    question: "Haben Sie bereits Steuerberatung für den Wegzug eingeholt?",
    type: "single",
    options: [
      { value: "none", label: "Nein, noch gar nicht" },
      { value: "researched", label: "Habe recherchiert, aber noch kein Termin" },
      { value: "planned", label: "Termin geplant oder vereinbart" },
      { value: "advised", label: "Bereits individuell beraten" },
    ],
  },
  {
    id: 10,
    field: "coParentStatus",
    question: "Wie ist Ihre Familiensituation?",
    subtitle:
      "Bei minderjährigen Kindern braucht ein Umzug ins Ausland die Zustimmung des anderen Elternteils.",
    type: "single",
    options: [
      { value: "together", label: "Wir ziehen gemeinsam um" },
      { value: "separated", label: "Anderer Elternteil lebt getrennt" },
      { value: "single", label: "Alleinerziehend, kein weiterer Elternteil involviert" },
      { value: "na", label: "Nicht zutreffend" },
    ],
  },
];

export const TOTAL_QUESTIONS = QUIZ_QUESTIONS.length;
