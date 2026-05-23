import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentProfile, isLifetime } from "@/lib/supabase/profile";
import { DocumentUploader } from "@/components/app/DocumentUploader";

export const dynamic = "force-dynamic";

interface Doc {
  id: string;
  file_name: string;
  file_size_bytes: number;
  mime_type: string;
  category: string | null;
  notes: string | null;
  expires_at: string | null;
  created_at: string;
}

const CATEGORY_LABEL: Record<string, string> = {
  identitaet: "Identität",
  familie: "Familie",
  finanzen: "Finanzen",
  arbeit: "Arbeit",
  bildung: "Bildung",
  gesundheit: "Gesundheit",
  wohnen: "Wohnen",
  versicherung: "Versicherung",
  sonstiges: "Sonstiges",
};

function fmtSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function fmtDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function daysUntil(iso: string): number {
  const d = new Date(iso).getTime();
  return Math.ceil((d - Date.now()) / (24 * 60 * 60 * 1000));
}

export default async function VaultPage() {
  const profile = await getCurrentProfile();
  if (!profile) return <main className="p-10">Profil nicht gefunden.</main>;

  if (!isLifetime(profile)) {
    return (
      <main className="max-w-page mx-auto px-6 md:px-16 py-14">
        <h1 className="font-serif text-3xl mb-4 tracking-tight">
          Dokumenten-Tresor
        </h1>
        <div className="rounded-card border-2 border-fir bg-fir text-paper p-7">
          <p className="mb-5 text-paper/90">
            Der Vault ist im Lifetime-Dashboard enthalten. Lade Pässe, Verträge,
            Zeugnisse sicher hoch und teile sie zeitlich begrenzt mit Beratern.
          </p>
          <Link
            href="/app/upgrade"
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
      "id, file_name, file_size_bytes, mime_type, category, notes, expires_at, created_at"
    )
    .order("created_at", { ascending: false });

  const list: Doc[] = (docs as Doc[] | null) ?? [];
  const expiring = list.filter(
    (d) => d.expires_at && daysUntil(d.expires_at) <= 60
  );

  const byCategory = new Map<string, Doc[]>();
  for (const d of list) {
    const key = d.category ?? "sonstiges";
    const arr = byCategory.get(key) ?? [];
    arr.push(d);
    byCategory.set(key, arr);
  }

  return (
    <main className="max-w-page mx-auto px-6 md:px-16 py-10 md:py-14">
      <div className="flex items-baseline justify-between mb-6">
        <h1 className="font-serif text-3xl md:text-[36px] tracking-tight">
          Dokumenten-Tresor
        </h1>
        <span className="text-[13px] text-muted">
          {list.length} {list.length === 1 ? "Dokument" : "Dokumente"}
        </span>
      </div>

      <div className="mb-8">
        <DocumentUploader />
      </div>

      {expiring.length > 0 && (
        <section className="mb-10">
          <div className="text-[11px] uppercase tracking-[0.12em] text-copper font-medium mb-3">
            Bald ablaufend
          </div>
          <div className="space-y-2">
            {expiring.map((d) => (
              <div
                key={d.id}
                className="rounded-card border border-copper/40 bg-highlight p-4 flex items-start gap-3"
              >
                <span className="text-copper-deep">⚠</span>
                <div className="flex-1">
                  <div className="font-medium text-ink">{d.file_name}</div>
                  <div className="text-[12px] text-muted">
                    Läuft ab am {fmtDate(d.expires_at)} (in{" "}
                    {daysUntil(d.expires_at!)} Tagen)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {list.length === 0 ? (
        <p className="text-muted">Noch keine Dokumente hochgeladen.</p>
      ) : (
        <div className="space-y-8">
          {[...byCategory.entries()].map(([cat, ds]) => (
            <section key={cat}>
              <div className="text-[11px] uppercase tracking-[0.12em] text-muted font-medium mb-3">
                {CATEGORY_LABEL[cat] ?? cat} ({ds.length})
              </div>
              <div className="space-y-2">
                {ds.map((d) => (
                  <div
                    key={d.id}
                    className="rounded-card border border-line bg-paper p-4 flex items-start gap-3"
                  >
                    <span className="text-xl">📄</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-ink truncate">
                        {d.file_name}
                      </div>
                      <div className="text-[12px] text-muted">
                        {fmtSize(d.file_size_bytes)} · {fmtDate(d.created_at)}
                        {d.expires_at &&
                          ` · läuft ab ${fmtDate(d.expires_at)}`}
                      </div>
                      {d.notes && (
                        <p className="text-[13px] text-inkSoft mt-1">
                          {d.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
