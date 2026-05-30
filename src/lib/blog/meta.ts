// Velite-freie Konstanten — importierbar in App-Code UND velite.config.ts.

export const DEFAULT_AUTHOR = {
  id: "peter",
  name: "Peter",
  role: "Gründer, Südzypern",
  bio: "Lebt seit mehreren Jahren auf Zypern, Wechsel von Nord nach Süd. Begleitet DACH-Familien strukturiert durch die Auswanderung.",
  avatar: "/images/authors/peter.jpg",
} as const;

// Phase-1b Kategorien (Doc WEBSITE_STRUKTUR_NAVIGATION.md, Sektion 3).
export const CATEGORIES = [
  "reihenfolge",
  "steuern-finanzen",
  "gesundheit",
  "buerokratie",
  "schule-kinder",
  "laender",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABEL: Record<Category, string> = {
  reihenfolge: "Reihenfolge",
  "steuern-finanzen": "Steuern",
  gesundheit: "Gesundheit",
  buerokratie: "Bürokratie",
  "schule-kinder": "Schule & Kinder",
  laender: "Länder-Guides",
};

export const CATEGORY_LONG_LABEL: Record<Category, string> = {
  reihenfolge: "Was zuerst kommt",
  "steuern-finanzen": "Steuern & Finanzen",
  gesundheit: "Gesundheit & Absicherung",
  buerokratie: "Bürokratie & Exit DACH",
  "schule-kinder": "Schule & Kinder",
  laender: "Länder-Guides",
};

export const GERMAN_WPM = 230;
