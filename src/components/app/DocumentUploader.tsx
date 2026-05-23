"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  { value: "identitaet", label: "Identität" },
  { value: "familie", label: "Familie" },
  { value: "finanzen", label: "Finanzen" },
  { value: "arbeit", label: "Arbeit" },
  { value: "bildung", label: "Bildung" },
  { value: "gesundheit", label: "Gesundheit" },
  { value: "wohnen", label: "Wohnen" },
  { value: "versicherung", label: "Versicherung" },
  { value: "sonstiges", label: "Sonstiges" },
];

export function DocumentUploader() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState("sonstiges");
  const [notes, setNotes] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload() {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      // 1) Signed Upload URL holen
      const sigRes = await fetch("/api/documents/upload", {
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

      // 2) Datei direkt zu Storage uploaden
      const putRes = await fetch(sig.signedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!putRes.ok) throw new Error("Upload nach Storage fehlgeschlagen.");

      // 3) Metadaten speichern
      const metaRes = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storagePath: sig.storagePath,
          fileName: file.name,
          fileSizeBytes: file.size,
          mimeType: file.type,
          category,
          notes: notes || undefined,
          expiresAt: expiresAt || undefined,
        }),
      });
      const meta = await metaRes.json();
      if (!metaRes.ok) throw new Error(meta.error ?? "Metadaten-Speichern fehlgeschlagen.");

      // Reset + Refresh
      setFile(null);
      setCategory("sonstiges");
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
      <div className="grid sm:grid-cols-2 gap-3 mb-3">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 rounded border border-line bg-paper text-[14px]"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
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
