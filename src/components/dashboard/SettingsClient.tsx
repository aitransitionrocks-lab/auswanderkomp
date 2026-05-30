"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Trash2, LogOut } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function SettingsClient() {
  const router = useRouter();
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  async function exportData() {
    setExporting(true);
    setExportError(null);
    try {
      const res = await fetch("/api/dashboard/export");
      if (!res.ok) throw new Error("Export fehlgeschlagen.");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const stamp = new Date().toISOString().slice(0, 10);
      a.download = `auswander-kompass-export-${stamp}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setExportError(err instanceof Error ? err.message : "Fehler");
    } finally {
      setExporting(false);
    }
  }

  async function deleteAccount() {
    if (deleteConfirm !== "LÖSCHEN") return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch("/api/dashboard/delete-account", {
        method: "POST",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Löschen fehlgeschlagen.");
      }
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
      router.push("/");
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Fehler");
      setDeleting(false);
    }
  }

  async function signOut() {
    setSigningOut(true);
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/dashboard/login");
  }

  return (
    <>
      <section className="rounded-card border border-line bg-paper p-5 mb-5">
        <div className="text-[11px] uppercase tracking-[0.12em] text-muted font-medium mb-2">
          Daten-Export
        </div>
        <p className="text-[14px] text-inkSoft mb-3">
          Lade alle deine Daten (Profil, Tasks, Notizen, Dokument-Metadaten) als
          JSON herunter.
        </p>
        <button
          onClick={exportData}
          disabled={exporting}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-pill bg-fir text-paper text-[14px] font-medium hover:bg-fir-deep disabled:opacity-60"
        >
          <Download size={16} />
          {exporting ? "Wird vorbereitet..." : "Export herunterladen"}
        </button>
        {exportError && (
          <p className="mt-2 text-[13px] text-riskRed">{exportError}</p>
        )}
      </section>

      <section className="rounded-card border border-line bg-paper p-5 mb-5">
        <div className="text-[11px] uppercase tracking-[0.12em] text-muted font-medium mb-2">
          Sitzung
        </div>
        <button
          onClick={signOut}
          disabled={signingOut}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-pill border border-line text-ink text-[14px] hover:bg-paperAlt disabled:opacity-60"
        >
          <LogOut size={16} />
          {signingOut ? "Abmelden..." : "Abmelden"}
        </button>
      </section>

      <section className="rounded-card border border-riskRed/30 bg-riskRed/5 p-5">
        <div className="text-[11px] uppercase tracking-[0.12em] text-riskRed font-medium mb-2">
          Gefahrenzone
        </div>
        <p className="text-[14px] text-inkSoft mb-3">
          Konto und alle Daten endgültig löschen. Diese Aktion lässt sich nicht
          rückgängig machen. Bereits geleistete Zahlungen werden nicht
          erstattet.
        </p>
        <label className="block text-[12px] text-muted mb-2">
          Tippe <strong className="text-ink">LÖSCHEN</strong> zur Bestätigung:
        </label>
        <input
          type="text"
          value={deleteConfirm}
          onChange={(e) => setDeleteConfirm(e.target.value)}
          className="w-full px-3 py-2 rounded border border-line bg-paper text-[14px] mb-3"
          placeholder="LÖSCHEN"
        />
        <button
          onClick={deleteAccount}
          disabled={deleteConfirm !== "LÖSCHEN" || deleting}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-pill bg-riskRed text-paper text-[14px] font-medium hover:bg-riskRed/90 disabled:opacity-50"
        >
          <Trash2 size={16} />
          {deleting ? "Lösche..." : "Konto endgültig löschen"}
        </button>
        {deleteError && (
          <p className="mt-2 text-[13px] text-riskRed">{deleteError}</p>
        )}
      </section>
    </>
  );
}
