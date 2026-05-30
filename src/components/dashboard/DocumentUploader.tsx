"use client";

import { useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { VAULT_CATEGORIES } from "@/lib/vault/categories";

export function DocumentUploader() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState("sonstiges");
  const [subcategory, setSubcategory] = useState("sonstiges");
  const [notes, setNotes] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subOptions = useMemo(
    () => VAULT_CATEGORIES.find((c) => c.slug === category)?.subcategories ?? [],
    [category]
  );

  async function upload() {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const sigRes = await fetch("/api/dashboard/vault/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          mimeType: file.type,
          sizeBytes: file.size,
        }),
      });
      const sig = await sigRes.json();
      if (!sigRes.ok) throw new Error(sig.error ?? "Upload-URL fehlgeschlagen.");

      const putRes = await fetch(sig.signedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!putRes.ok) throw new Error("Upload nach Storage fehlgeschlagen.");

      const metaRes = await fetch("/api/dashboard/vault", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storagePath: sig.storagePath,
          fileName: file.name,
          fileSizeBytes: file.size,
          mimeType: file.type,
          category,
          tags: subcategory ? [subcategory] : [],
          notes: notes || undefined,
          expiresAt: expiresAt || undefined,
        }),
      });
      const meta = await metaRes.json();
      if (!metaRes.ok) throw new Error(meta.error ?? "Metadaten-Speichern fehlgeschlagen.");

      setFile(null);
      setCategory("sonstiges");
      setSubcategory("sonstiges");
      setNotes("");
      setExpiresAt("");
      if (fileRef.current) fileRef.current.value = "";
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-card border border-line bg-paperAlt p-5">
      <div className="font-serif text-[18px] mb-3">Dokument hochladen</div>
      <input
        ref={fileRef}
        type="file"
        accept="application/pdf,image/jpeg,image/png,image/heic,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="block w-full text-[14px] mb-3"
      />
      <div className="grid sm:grid-cols-3 gap-3 mb-3">
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            const first = VAULT_CATEGORIES.find((c) => c.slug === e.target.value)
              ?.subcategories[0]?.slug;
            setSubcategory(first ?? "sonstiges");
          }}
          className="px-3 py-2 rounded border border-line bg-paper text-[14px]"
        >
          {VAULT_CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.label}
            </option>
          ))}
        </select>
        <select
          value={subcategory}
          onChange={(e) => setSubcategory(e.target.value)}
          className="px-3 py-2 rounded border border-line bg-paper text-[14px]"
        >
          {subOptions.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.label}
            </option>
          ))}
        </select>
        <input
          type="date"
          placeholder="Läuft ab am (optional)"
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
          className="px-3 py-2 rounded border border-line bg-paper text-[14px]"
        />
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notiz (optional)"
        rows={2}
        className="w-full px-3 py-2 rounded border border-line bg-paper text-[14px] mb-3"
      />
      <button
        onClick={upload}
        disabled={!file || loading}
        className="px-5 py-2.5 rounded-pill bg-fir text-paper text-[14px] font-medium hover:bg-fir-deep disabled:opacity-60"
      >
        {loading ? "Hochladen..." : "Hochladen"}
      </button>
      {error && <p className="mt-2 text-[13px] text-riskRed">{error}</p>}
    </div>
  );
}
