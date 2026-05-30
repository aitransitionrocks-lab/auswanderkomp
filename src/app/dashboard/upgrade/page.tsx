import Link from "next/link";
import { getCurrentProfile, isLifetime } from "@/lib/supabase/profile";
import { UpgradeButton } from "@/components/dashboard/UpgradeButton";

export const dynamic = "force-dynamic";

export default async function UpgradePage() {
  const profile = await getCurrentProfile();

  if (profile && isLifetime(profile)) {
    return (
      <main className="max-w-page mx-auto px-6 md:px-16 py-16 text-center">
        <h1 className="font-serif text-3xl mb-3">Du bist bereits Lifetime-User</h1>
        <p className="text-inkSoft mb-6">Vollzugriff ist aktiv.</p>
        <Link href="/dashboard" className="text-fir underline">
          Zurück zum Dashboard
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-[640px] mx-auto px-6 py-14">
      <h1 className="font-serif text-3xl md:text-[40px] leading-tight mb-4 tracking-tight">
        Dashboard freischalten
      </h1>
      <p className="text-inkSoft text-[16px] leading-[1.6] mb-8">
        Einmalig 97 € — Lifetime-Zugang inklusive aller zukünftigen Updates.
      </p>

      <ul className="space-y-2.5 mb-8 text-[15px] text-ink">
        <li>✓ Tasks abhaken, Notizen, Status-Tracking</li>
        <li>✓ Dokumenten-Tresor mit Sharing-Links</li>
        <li>✓ Phasen-Übersicht: Vorbereitung → Umzug → Ankunft</li>
        <li>✓ Alle zukünftigen Updates inklusive</li>
      </ul>

      <UpgradeButton />

      <p className="text-[12.5px] text-muted mt-5">
        Sichere Zahlung über Stripe. Kein Abo.
      </p>
    </main>
  );
}
