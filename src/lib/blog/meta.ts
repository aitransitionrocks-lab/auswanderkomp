// Velite-freie Konstanten — importierbar in App-Code UND velite.config.ts.
// KEINE velite-Imports hier, sonst landet esbuild im Next-Bundle.

export const DEFAULT_AUTHOR = {
  id: "peter-hoyer",
  name: "Peter Hoyer",
  role: "Gründer Auswander-Kompass",
  bio: "Gründer von Auswander-Kompass. Begleitet Familien strukturiert durch die Auswanderung.",
  avatar: "/images/authors/peter.jpg",
} as const;

export const CATEGORIES = [
  "familie-und-kinder",
  "steuer-und-finanzen",
  "recht-und-buerokratie",
  "krankenversicherung",
  "laender-guides",
  "lebensalltag",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABEL: Record<Category, string> = {
  "familie-und-kinder": "Familie & Kinder",
  "steuer-und-finanzen": "Steuer & Finanzen",
  "recht-und-buerokratie": "Recht & Bürokratie",
  krankenversicherung: "Krankenversicherung",
  "laender-guides": "Länder-Guides",
  lebensalltag: "Lebensalltag",
};

export const GERMAN_WPM = 230;
