export interface VaultCategory {
  slug: string;
  label: string;
  subcategories: { slug: string; label: string }[];
}

export const VAULT_CATEGORIES: VaultCategory[] = [
  {
    slug: "identitaet",
    label: "Identität",
    subcategories: [
      { slug: "pass", label: "Reisepass" },
      { slug: "personalausweis", label: "Personalausweis" },
      { slug: "geburtsurkunde", label: "Geburtsurkunde" },
      { slug: "nie-tin", label: "NIE / TIN / Steuernummer" },
    ],
  },
  {
    slug: "familie",
    label: "Familie",
    subcategories: [
      { slug: "heiratsurkunde", label: "Heiratsurkunde" },
      { slug: "kinder", label: "Geburtsurkunden Kinder" },
      { slug: "sorgerecht", label: "Sorgerecht / Vollmacht" },
    ],
  },
  {
    slug: "finanzen",
    label: "Finanzen",
    subcategories: [
      { slug: "konto", label: "Kontoauszüge" },
      { slug: "steuer-de", label: "Steuererklärung DE" },
      { slug: "wegzug", label: "Wegzugsbesteuerung" },
      { slug: "anlagen", label: "Depot / Anlagen" },
    ],
  },
  {
    slug: "arbeit",
    label: "Arbeit",
    subcategories: [
      { slug: "vertrag", label: "Arbeits-/Beraterverträge" },
      { slug: "zeugnisse", label: "Zeugnisse" },
      { slug: "gewerbe", label: "Gewerbe / GmbH" },
    ],
  },
  {
    slug: "bildung",
    label: "Bildung",
    subcategories: [
      { slug: "schule", label: "Schulzeugnisse" },
      { slug: "studium", label: "Studienabschluss" },
      { slug: "apostille", label: "Apostille / Übersetzung" },
    ],
  },
  {
    slug: "gesundheit",
    label: "Gesundheit",
    subcategories: [
      { slug: "impfpass", label: "Impfpass" },
      { slug: "krankenkasse", label: "GKV / KV Dokumente" },
      { slug: "befunde", label: "Arzt-Befunde" },
    ],
  },
  {
    slug: "wohnen",
    label: "Wohnen",
    subcategories: [
      { slug: "miete-de", label: "Mietvertrag DACH" },
      { slug: "miete-ziel", label: "Mietvertrag Zielland" },
      { slug: "abmeldung", label: "Abmeldebescheinigung" },
    ],
  },
  {
    slug: "versicherung",
    label: "Versicherung",
    subcategories: [
      { slug: "auslandskv", label: "Auslands-Krankenversicherung" },
      { slug: "haftpflicht", label: "Haftpflicht" },
      { slug: "berufsunfaehigkeit", label: "Berufsunfähigkeit / Leben" },
    ],
  },
  {
    slug: "sonstiges",
    label: "Sonstiges",
    subcategories: [{ slug: "sonstiges", label: "Sonstiges" }],
  },
];

export function categoryLabel(slug: string): string {
  return VAULT_CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}

export function subcategoryLabel(
  catSlug: string,
  subSlug: string | null | undefined
): string | null {
  if (!subSlug) return null;
  const cat = VAULT_CATEGORIES.find((c) => c.slug === catSlug);
  return cat?.subcategories.find((s) => s.slug === subSlug)?.label ?? null;
}
