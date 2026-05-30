import { getCurrentProfile, isLifetime } from "@/lib/supabase/profile";
import { SettingsClient } from "@/components/dashboard/SettingsClient";

export const dynamic = "force-dynamic";

const SEGMENT_LABEL: Record<string, string> = {
  dreamer: "Träumer",
  planer: "Planer",
  fortgeschrittener: "Fortgeschrittener",
  starter: "Starter",
};

const COUNTRY_LABEL: Record<string, string> = {
  portugal: "Portugal",
  dubai: "Dubai / VAE",
  spanien: "Spanien",
  suedzypern: "Süd-Zypern",
  nordzypern: "Nord-Zypern",
  thailand: "Thailand",
  argentinien: "Argentinien",
  panama: "Panama",
  usa: "USA",
  unklar: "Noch unklar",
};

export default async function EinstellungenPage() {
  const profile = await getCurrentProfile();
  if (!profile) return <main className="p-10">Profil nicht gefunden.</main>;

  const lifetime = isLifetime(profile);
  const segment = profile.quiz_segment
    ? SEGMENT_LABEL[profile.quiz_segment] ?? profile.quiz_segment
    : "—";
  const country = profile.quiz_country
    ? COUNTRY_LABEL[profile.quiz_country] ?? profile.quiz_country
    : "—";

  return (
    <main className="max-w-page mx-auto px-5 md:px-16 py-8 md:py-14">
      <h1 className="font-serif text-[28px] md:text-[36px] tracking-tight mb-6">
        Konto
      </h1>

      <section className="rounded-card border border-line bg-paper p-5 mb-5">
        <div className="text-[11px] uppercase tracking-[0.12em] text-muted font-medium mb-3">
          Profil
        </div>
        <dl className="space-y-2 text-[14px]">
          <div className="flex justify-between gap-3">
            <dt className="text-muted">E-Mail</dt>
            <dd className="text-ink text-right truncate">{profile.email}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Segment</dt>
            <dd className="text-ink">{segment}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Zielland</dt>
            <dd className="text-ink">{country}</dd>
          </div>
          {typeof profile.quiz_score === "number" && (
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Score</dt>
              <dd className="text-ink">{profile.quiz_score}/100</dd>
            </div>
          )}
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Plan</dt>
            <dd className="text-ink">
              {lifetime ? "Lifetime" : "Trial (Bericht-Käufer)"}
            </dd>
          </div>
        </dl>
      </section>

      <SettingsClient />
    </main>
  );
}
