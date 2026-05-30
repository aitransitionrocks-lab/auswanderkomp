import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/profile";

export const dynamic = "force-dynamic";

interface ModuleRow {
  slug: string;
  title: string;
  short_description: string;
  category: string | null;
  price_cents: number;
  currency: string;
  available_at: string | null;
}

function fmtPrice(cents: number, currency: string) {
  return `${(cents / 100).toFixed(0)} ${currency.toUpperCase() === "EUR" ? "€" : currency}`;
}

export default async function ModulesPage() {
  const profile = await getCurrentProfile();
  if (!profile) return <main className="p-10">Profil nicht gefunden.</main>;

  const supabase = createSupabaseServerClient();
  const { data: modules } = await supabase
    .from("modules")
    .select("slug, title, short_description, category, price_cents, currency, available_at")
    .eq("active", true)
    .order("sort_order");

  const { data: owned } = await supabase
    .from("user_modules")
    .select("module_slug")
    .eq("user_id", profile.id);

  const ownedSet = new Set((owned ?? []).map((o) => o.module_slug));
  const list: ModuleRow[] = (modules as ModuleRow[] | null) ?? [];

  return (
    <main className="max-w-page mx-auto px-5 md:px-16 py-8 md:py-14">
      <h1 className="font-serif text-[28px] md:text-[36px] tracking-tight mb-2">
        Module
      </h1>
      <p className="text-[14px] text-inkSoft mb-6">
        Spezial-Module für deine Auswanderung. Einmal kaufen, dauerhaft im Konto.
      </p>

      {list.length === 0 ? (
        <p className="text-muted">Aktuell keine Module verfügbar.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {list.map((m) => {
            const purchased = ownedSet.has(m.slug);
            const comingSoon = m.available_at && new Date(m.available_at) > new Date();
            return (
              <Link
                key={m.slug}
                href={`/dashboard/module/${m.slug}`}
                className="rounded-card border border-line bg-paper p-5 hover:border-fir transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  {m.category && (
                    <span className="text-[10px] uppercase tracking-[0.12em] text-copper font-medium">
                      {m.category}
                    </span>
                  )}
                  {purchased ? (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-fir/10 text-fir font-medium">
                      Gekauft
                    </span>
                  ) : comingSoon ? (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-line text-muted">
                      Bald
                    </span>
                  ) : null}
                </div>
                <h2 className="font-serif text-[20px] text-ink tracking-tight mb-1.5">
                  {m.title}
                </h2>
                <p className="text-[14px] text-inkSoft leading-[1.5] mb-3 line-clamp-3">
                  {m.short_description}
                </p>
                <div className="text-[14px] text-fir font-medium">
                  {purchased
                    ? "Öffnen →"
                    : `${fmtPrice(m.price_cents, m.currency)} einmalig`}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
