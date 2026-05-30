import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { ModulePurchaseButton } from "@/components/dashboard/ModulePurchaseButton";

export const dynamic = "force-dynamic";

interface ModuleRow {
  slug: string;
  title: string;
  short_description: string;
  category: string | null;
  price_cents: number;
  currency: string;
  available_at: string | null;
  active: boolean;
}

function fmtPrice(cents: number, currency: string) {
  return `${(cents / 100).toFixed(0)} ${currency.toUpperCase() === "EUR" ? "€" : currency}`;
}

export default async function ModuleDetailPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { purchased?: string };
}) {
  const profile = await getCurrentProfile();
  if (!profile) return <main className="p-10">Profil nicht gefunden.</main>;

  const supabase = createSupabaseServerClient();
  const { data: module } = await supabase
    .from("modules")
    .select(
      "slug, title, short_description, category, price_cents, currency, available_at, active"
    )
    .eq("slug", params.slug)
    .maybeSingle();

  if (!module || !(module as ModuleRow).active) notFound();
  const m = module as ModuleRow;

  const { data: owned } = await supabase
    .from("user_modules")
    .select("module_slug, purchased_at")
    .eq("user_id", profile.id)
    .eq("module_slug", params.slug)
    .maybeSingle();

  const purchased = !!owned;
  const comingSoon = m.available_at && new Date(m.available_at) > new Date();

  return (
    <main className="max-w-page mx-auto px-5 md:px-16 py-8 md:py-14">
      <Link
        href="/dashboard/module"
        className="text-[13px] text-muted hover:text-ink mb-4 inline-block"
      >
        ← Alle Module
      </Link>

      {searchParams.purchased === "true" && (
        <div className="rounded-card border border-fir bg-fir/5 p-4 mb-5">
          <p className="text-[14px] text-fir font-medium">
            Kauf erfolgreich. Das Modul ist nun in deinem Konto.
          </p>
        </div>
      )}

      {m.category && (
        <span className="text-[11px] uppercase tracking-[0.12em] text-copper font-medium">
          {m.category}
        </span>
      )}
      <h1 className="font-serif text-[28px] md:text-[36px] tracking-tight mt-1 mb-3">
        {m.title}
      </h1>
      <p className="text-[16px] text-inkSoft leading-[1.6] mb-6">
        {m.short_description}
      </p>

      <div className="rounded-card border border-line bg-paperAlt p-5">
        {purchased ? (
          <>
            <div className="text-[14px] text-fir font-medium mb-2">
              Du besitzt dieses Modul.
            </div>
            <p className="text-[13px] text-muted">
              Inhalte werden bald hier verfügbar sein.
            </p>
          </>
        ) : comingSoon ? (
          <>
            <div className="text-[14px] text-muted mb-2">Bald verfügbar</div>
            <p className="text-[13px] text-muted">
              Wir benachrichtigen dich, sobald das Modul startet.
            </p>
          </>
        ) : (
          <>
            <div className="font-serif text-[24px] text-ink mb-1">
              {fmtPrice(m.price_cents, m.currency)}
            </div>
            <p className="text-[13px] text-muted mb-4">
              Einmalig — dauerhafter Zugang in deinem Konto.
            </p>
            <ModulePurchaseButton slug={m.slug} />
          </>
        )}
      </div>
    </main>
  );
}
