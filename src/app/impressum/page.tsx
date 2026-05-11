import Link from "next/link";
import { CompassGlyph } from "@/components/brand/CompassGlyph";

export const metadata = {
  title: "Impressum",
};

export default function ImpressumPage() {
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

      <section className="px-6 md:px-16 py-12 md:py-20">
        <div className="max-w-[720px] mx-auto">
          <Link
            href="/"
            className="text-[14px] text-inkSoft hover:text-ink underline mb-6 inline-block"
          >
            ← Zurück
          </Link>
          <h1 className="font-serif font-normal text-3xl md:text-[42px] leading-[1.1] tracking-[-0.02em] mb-3">
            Impressum
          </h1>
          <p className="text-[12px] text-muted mb-10">
            Stand: [Datum des Betreibers eintragen]
          </p>

          <div className="space-y-8 text-[15.5px] leading-[1.65] text-inkSoft">
            <section>
              <h2 className="font-serif text-[20px] text-ink mb-2">
                Angaben gemäß § 5 TMG
              </h2>
              <p>
                [Vollständiger Name des Anbieters]
                <br />
                [Straße Hausnummer]
                <br />
                [PLZ Ort]
                <br />
                [Land]
              </p>
            </section>

            <section>
              <h2 className="font-serif text-[20px] text-ink mb-2">Kontakt</h2>
              <p>
                E-Mail:{" "}
                <a
                  href="mailto:kontakt@auswanderkompass.de"
                  className="text-fir underline"
                >
                  kontakt@auswanderkompass.de
                </a>
              </p>
            </section>

            <section>
              <h2 className="font-serif text-[20px] text-ink mb-2">
                Umsatzsteuer-ID
              </h2>
              <p>
                Umsatzsteuer-Identifikationsnummer gemäß § 27 a
                Umsatzsteuergesetz: [USt-ID eintragen]
              </p>
            </section>

            <section>
              <h2 className="font-serif text-[20px] text-ink mb-2">
                Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
              </h2>
              <p>[Vor- und Nachname, Anschrift wie oben]</p>
            </section>

            <section>
              <h2 className="font-serif text-[20px] text-ink mb-2">
                Haftungshinweis
              </h2>
              <p>
                Der Auswander-Kompass stellt eine strukturierte Einschätzung
                bereit und ersetzt keine rechtliche, steuerliche oder
                versicherungstechnische Beratung im Einzelfall. Alle Angaben
                sind sorgfältig recherchiert, jedoch ohne Gewähr auf
                Vollständigkeit oder Aktualität. Für verbindliche Entscheidungen
                ist eine individuelle Beratung durch qualifizierte Fachpersonen
                erforderlich.
              </p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
