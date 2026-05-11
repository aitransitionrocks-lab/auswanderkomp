import Link from "next/link";
import { CompassGlyph } from "@/components/brand/CompassGlyph";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-paper text-ink flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="inline-flex items-center justify-center mb-7">
          <CompassGlyph size={48} stroke="#1E3A34" accent="#C4926B" />
        </div>
        <div className="text-[12px] uppercase tracking-[0.14em] text-copper mb-3">
          404 — kein Kurs gefunden
        </div>
        <h1 className="font-serif text-3xl md:text-[40px] leading-[1.1] tracking-[-0.02em] mb-4">
          Diese Seite gibt es nicht.
        </h1>
        <p className="text-inkSoft mb-8">
          Du hast dich verirrt. Kein Problem — der Kompass findet zurück.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-fir text-paper rounded-pill font-medium hover:bg-fir-deep transition-colors"
        >
          Zurück zur Startseite
        </Link>
      </div>
    </main>
  );
}
