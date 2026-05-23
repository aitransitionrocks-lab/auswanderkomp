import { notFound } from "next/navigation";
import { getSupabaseAdmin, supabaseAdminReady } from "@/lib/supabase/admin";
import { CompassGlyph } from "@/components/brand/CompassGlyph";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Geteiltes Dokument",
  robots: { index: false, follow: false },
};

interface Share {
  id: string;
  document_id: string;
  password_hash: string | null;
  expires_at: string;
  max_downloads: number;
  download_count: number;
}

interface Doc {
  id: string;
  file_name: string;
  storage_path: string;
  mime_type: string;
  file_size_bytes: number;
}

export default async function SharedPage({
  params,
}: {
  params: { token: string };
}) {
  if (!supabaseAdminReady()) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <p className="text-muted">Sharing aktuell nicht verfügbar.</p>
      </main>
    );
  }

  const admin = getSupabaseAdmin();
  const { data: share } = await admin
    .from("document_shares")
    .select("id, document_id, password_hash, expires_at, max_downloads, download_count")
    .eq("share_token", params.token)
    .maybeSingle();

  if (!share) notFound();
  const s = share as Share;

  const expired = new Date(s.expires_at).getTime() < Date.now();
  const maxedOut = s.max_downloads > 0 && s.download_count >= s.max_downloads;
  if (expired || maxedOut) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8 bg-paper text-ink">
        <div className="max-w-md text-center">
          <h1 className="font-serif text-3xl mb-3">Link nicht mehr gültig</h1>
          <p className="text-inkSoft">
            {expired
              ? "Dieser Sharing-Link ist abgelaufen."
              : "Maximale Downloads erreicht."}
          </p>
        </div>
      </main>
    );
  }

  const { data: doc } = await admin
    .from("documents")
    .select("id, file_name, storage_path, mime_type, file_size_bytes")
    .eq("id", s.document_id)
    .maybeSingle();

  if (!doc) notFound();
  const d = doc as Doc;

  const { data: signed } = await admin.storage
    .from("documents")
    .createSignedUrl(d.storage_path, 60 * 10);

  return (
    <main className="min-h-screen bg-paper text-ink">
      <header className="border-b border-line">
        <div className="max-w-page mx-auto px-6 md:px-16 py-5 flex items-center gap-3">
          <CompassGlyph size={28} stroke="#1E3A34" accent="#C4926B" />
          <span className="font-serif text-[17px] tracking-tight">
            Auswander-Kompass
          </span>
        </div>
      </header>
      <section className="max-w-[640px] mx-auto px-6 py-14">
        <div className="text-[11px] uppercase tracking-[0.12em] text-muted mb-3">
          Geteiltes Dokument
        </div>
        <h1 className="font-serif text-3xl md:text-[36px] mb-3 tracking-tight">
          {d.file_name}
        </h1>
        <p className="text-inkSoft text-[14px] mb-8">
          {Math.round(d.file_size_bytes / 1024)} KB · gültig bis{" "}
          {new Date(s.expires_at).toLocaleString("de-DE")}
        </p>
        {signed?.signedUrl ? (
          <a
            href={signed.signedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex px-6 py-3 rounded-pill bg-fir text-paper font-medium hover:bg-fir-deep"
          >
            Dokument öffnen
          </a>
        ) : (
          <p className="text-riskRed">Download-Link konnte nicht erstellt werden.</p>
        )}
      </section>
    </main>
  );
}
