"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, FileText, X, Download, Trash2 } from "lucide-react";
import { VAULT_CATEGORIES, subcategoryLabel } from "@/lib/vault/categories";

export interface VaultDoc {
  id: string;
  file_name: string;
  file_size_bytes: number;
  mime_type: string;
  category: string | null;
  tags: string[] | null;
  notes: string | null;
  expires_at: string | null;
  created_at: string;
}

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

export function VaultClient({ docs }: { docs: VaultDoc[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [openCats, setOpenCats] = useState<Record<string, boolean>>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const [detail, setDetail] = useState<{
    doc: VaultDoc;
    signedUrl: string | null;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return docs;
    return docs.filter((d) => {
      const sub = subcategoryLabel(d.category ?? "sonstiges", d.tags?.[0]) ?? "";
      return (
        d.file_name.toLowerCase().includes(q) ||
        (d.notes ?? "").toLowerCase().includes(q) ||
        sub.toLowerCase().includes(q)
      );
    });
  }, [docs, query]);

  const expiring = useMemo(
    () => docs.filter((d) => d.expires_at && daysUntil(d.expires_at) <= 60),
    [docs]
  );

  async function openDetail(d: VaultDoc) {
    setActiveId(d.id);
    setDetail({ doc: d, signedUrl: null });
    try {
      const res = await fetch(`/api/dashboard/vault/${d.id}`);
      if (res.ok) {
        const data = await res.json();
        setDetail({ doc: d, signedUrl: data.signed_url ?? null });
      }
    } catch {
      // ignore
    }
  }

  function closeDetail() {
    setActiveId(null);
    setDetail(null);
  }

  async function deleteDoc(id: string) {
    if (!confirm("Dokument wirklich löschen?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/dashboard/vault/${id}`, { method: "DELETE" });
      if (res.ok) {
        closeDetail();
        router.refresh();
      }
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div className="mb-5">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Dokument suchen..."
            className="w-full pl-9 pr-3 py-2.5 rounded-pill border border-line bg-paper text-[14px]"
          />
        </div>
      </div>

      {expiring.length > 0 && (
        <section className="mb-8">
          <div className="text-[11px] uppercase tracking-[0.12em] text-copper font-medium mb-3">
            Bald ablaufend
          </div>
          <div className="space-y-2">
            {expiring.map((d) => (
              <button
                key={d.id}
                onClick={() => openDetail(d)}
                className="w-full text-left rounded-card border border-copper/40 bg-highlight p-4 flex items-start gap-3 hover:border-copper"
              >
                <span className="text-copper-deep">⚠</span>
                <div className="flex-1">
                  <div className="font-medium text-ink">{d.file_name}</div>
                  <div className="text-[12px] text-muted">
                    Läuft ab am {fmtDate(d.expires_at)} (in{" "}
                    {daysUntil(d.expires_at!)} Tagen)
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {filtered.length === 0 ? (
        <p className="text-muted">
          {query
            ? "Keine Treffer für deine Suche."
            : "Noch keine Dokumente hochgeladen."}
        </p>
      ) : (
        <div className="space-y-4">
          {VAULT_CATEGORIES.map((cat) => {
            const inCat = filtered.filter(
              (d) => (d.category ?? "sonstiges") === cat.slug
            );
            if (inCat.length === 0) return null;
            const isOpen = openCats[cat.slug] ?? true;
            return (
              <section
                key={cat.slug}
                className="rounded-card border border-line bg-paper"
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenCats((s) => ({ ...s, [cat.slug]: !isOpen }))
                  }
                  className="w-full flex items-center justify-between px-4 py-3"
                  aria-expanded={isOpen}
                >
                  <span className="font-medium text-ink">{cat.label}</span>
                  <span className="text-[12px] text-muted">
                    {inCat.length} {isOpen ? "▾" : "▸"}
                  </span>
                </button>
                {isOpen && (
                  <div className="border-t border-line px-2 pb-2 pt-2 space-y-3">
                    {cat.subcategories.map((sub) => {
                      const inSub = inCat.filter(
                        (d) => (d.tags?.[0] ?? "sonstiges") === sub.slug
                      );
                      if (inSub.length === 0) return null;
                      return (
                        <div key={sub.slug}>
                          <div className="px-2 text-[11px] uppercase tracking-[0.12em] text-muted font-medium mb-1.5">
                            {sub.label}
                          </div>
                          <div className="space-y-1.5">
                            {inSub.map((d) => (
                              <button
                                key={d.id}
                                onClick={() => openDetail(d)}
                                className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-card text-left hover:bg-paperAlt ${
                                  activeId === d.id ? "bg-paperAlt" : ""
                                }`}
                              >
                                <FileText
                                  size={18}
                                  className="text-fir mt-0.5 shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-ink truncate text-[14px]">
                                    {d.file_name}
                                  </div>
                                  <div className="text-[11px] text-muted">
                                    {fmtSize(d.file_size_bytes)} ·{" "}
                                    {fmtDate(d.created_at)}
                                    {d.expires_at &&
                                      ` · läuft ab ${fmtDate(d.expires_at)}`}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}

      {detail && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-end md:items-center justify-center"
          onClick={closeDetail}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full md:max-w-lg bg-paper rounded-t-card md:rounded-card p-5 max-h-[85vh] overflow-y-auto"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 20px)" }}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-serif text-[20px] text-ink pr-4 break-words">
                {detail.doc.file_name}
              </h3>
              <button
                onClick={closeDetail}
                aria-label="Schließen"
                className="shrink-0 text-muted hover:text-ink"
              >
                <X size={20} />
              </button>
            </div>
            <div className="text-[12px] text-muted mb-4 space-y-0.5">
              <div>
                {fmtSize(detail.doc.file_size_bytes)} · {detail.doc.mime_type}
              </div>
              <div>Hochgeladen {fmtDate(detail.doc.created_at)}</div>
              {detail.doc.expires_at && (
                <div>Läuft ab {fmtDate(detail.doc.expires_at)}</div>
              )}
              {detail.doc.category && (
                <div>
                  Kategorie:{" "}
                  {VAULT_CATEGORIES.find((c) => c.slug === detail.doc.category)
                    ?.label ?? detail.doc.category}
                  {detail.doc.tags?.[0] &&
                    ` / ${
                      subcategoryLabel(
                        detail.doc.category,
                        detail.doc.tags[0]
                      ) ?? detail.doc.tags[0]
                    }`}
                </div>
              )}
            </div>
            {detail.doc.notes && (
              <p className="text-[14px] text-inkSoft mb-4 whitespace-pre-wrap">
                {detail.doc.notes}
              </p>
            )}
            <div className="flex flex-col gap-2">
              {detail.signedUrl ? (
                <a
                  href={detail.signedUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-pill bg-fir text-paper font-medium text-[14px]"
                >
                  <Download size={16} /> Öffnen / Herunterladen
                </a>
              ) : (
                <div className="text-[13px] text-muted text-center py-2">
                  Lade Download-Link...
                </div>
              )}
              <button
                onClick={() => deleteDoc(detail.doc.id)}
                disabled={deleting}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-pill border border-riskRed text-riskRed text-[14px] disabled:opacity-60"
              >
                <Trash2 size={16} /> Löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
