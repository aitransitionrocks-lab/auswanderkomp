import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentProfile, isLifetime } from "@/lib/supabase/profile";
import { DocumentUploader } from "@/components/dashboard/DocumentUploader";
import { VaultClient, type VaultDoc } from "@/components/dashboard/VaultClient";

export const dynamic = "force-dynamic";

export default async function VaultPage() {
  const profile = await getCurrentProfile();
  if (!profile) return <main className="p-10">Profil nicht gefunden.</main>;

  if (!isLifetime(profile)) {
    return (
      <main className="max-w-page mx-auto px-5 md:px-16 py-10 md:py-14">
        <h1 className="font-serif text-3xl mb-4 tracking-tight">
          Dokumenten-Tresor
        </h1>
        <div className="rounded-card border-2 border-fir bg-fir text-paper p-7">
          <p className="mb-5 text-paper/90">
            Der Vault ist im Lifetime-Dashboard enthalten. Lade Pässe, Verträge,
            Zeugnisse sicher hoch und teile sie zeitlich begrenzt mit Beratern.
          </p>
          <Link
            href="/dashboard/upgrade"
            className="inline-flex px-6 py-3 rounded-pill bg-copper text-fir font-medium hover:bg-copper-deep hover:text-paper"
          >
            Lifetime freischalten — 97 €
          </Link>
        </div>
      </main>
    );
  }

  const supabase = createSupabaseServerClient();
  const { data: docs } = await supabase
    .from("documents")
    .select(
      "id, file_name, file_size_bytes, mime_type, category, tags, notes, expires_at, created_at"
    )
    .order("created_at", { ascending: false });

  const list: VaultDoc[] = (docs as VaultDoc[] | null) ?? [];

  return (
    <main className="max-w-page mx-auto px-5 md:px-16 py-8 md:py-14">
      <div className="flex items-baseline justify-between mb-5">
        <h1 className="font-serif text-[28px] md:text-[36px] tracking-tight">
          Tresor
        </h1>
        <span className="text-[13px] text-muted">
          {list.length} {list.length === 1 ? "Dokument" : "Dokumente"}
        </span>
      </div>

      <div className="mb-6">
        <DocumentUploader />
      </div>

      <VaultClient docs={list} />
    </main>
  );
}
