import Link from "next/link";
import { CompassGlyph } from "@/components/brand/CompassGlyph";

export const metadata = {
  title: "Danke",
  robots: { index: false, follow: false },
};

export default function DankePage() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <header className="border-b border-line">
        <div className="max-w-page mx-auto px-6 md:px-16 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <CompassGlyph size={28} stroke="#1E3A34" accent="#C4926B" />
            <span className="font-serif text-[17px] tracking-tight">
              Auswander-Kompass
            </span>
          </Link>
        </div>
      </header>

      <section className="px-6 md:px-16 py-20 md:py-28">
        <div className="max-w-[640px] mx-auto text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-pill bg-fir text-paper mb-7">
            <CompassGlyph size={28} stroke="#F3EDE2" accent="#C4926B" />
          </div>

          <div className="text-[12px] uppercase tracking-[0.14em] text-copper mb-3">
            Dein Kauf ist bestätigt
          </div>
          <h1 className="font-serif font-normal text-3xl md:text-[44px] leading-[1.1] tracking-[-0.025em] mb-5">
            Dein Bericht ist unterwegs.
          </h1>
          <p className="text-[16.5px] leading-[1.6] text-inkSoft mb-10">
            Schau in deinen Posteingang — die E-Mail mit deinem persönlichen
            PDF-Fahrplan ist auf dem Weg. Manchmal landet sie kurz im
            Spam-Ordner.
          </p>

          <div className="bg-paperAlt border border-line rounded-card p-6 md:p-8 text-left mb-10">
            <div className="text-[11px] uppercase tracking-[0.14em] text-muted font-medium mb-4">
              Deine nächsten Schritte
            </div>
            <ol className="space-y-3 text-[15px] text-ink">
              <li className="flex gap-3">
                <span className="font-serif text-copper">01</span>
                <span>E-Mail-Postfach prüfen (auch Spam-Ordner)</span>
              </li>
              <li className="flex gap-3">
                <span className="font-serif text-copper">02</span>
                <span>Bericht in Ruhe lesen — beginnend mit Risiko-Kompass + Kernlücken</span>
              </li>
              <li className="flex gap-3">
                <span className="font-serif text-copper">03</span>
                <span>
                  Bei Fragen:{" "}
                  <a
                    href="mailto:kontakt@auswanderkompass.de"
                    className="text-fir underline hover:text-fir-deep"
                  >
                    kontakt@auswanderkompass.de
                  </a>
                </span>
              </li>
            </ol>
          </div>

          <Link
            href="/"
            className="text-[14px] text-inkSoft hover:text-ink underline"
          >
            ← Zurück zur Startseite
          </Link>
        </div>
      </section>

      <footer className="px-6 md:px-16 py-9 border-t border-line">
        <div className="max-w-page mx-auto flex flex-wrap justify-between items-center gap-4 text-[13px] text-muted">
          <div className="flex items-center gap-2.5">
            <CompassGlyph size={20} stroke="#7A7164" accent="#7A7164" />
            <span>Auswander-Kompass</span>
          </div>
          <div className="text-right">
            <Link href="/impressum" className="hover:text-ink mr-3">
              Impressum
            </Link>
            <Link href="/datenschutz" className="hover:text-ink">
              Datenschutz
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
