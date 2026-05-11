import Link from "next/link";
import { CompassGlyph } from "@/components/brand/CompassGlyph";

export const metadata = {
  title: "Datenschutz",
};

export default function DatenschutzPage() {
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
            Datenschutzerklärung
          </h1>
          <p className="text-[12px] text-muted mb-10">
            Stand: [Datum des Betreibers eintragen]
          </p>

          <div className="space-y-8 text-[15.5px] leading-[1.65] text-inkSoft">
            <section>
              <h2 className="font-serif text-[20px] text-ink mb-2">
                1. Verantwortlicher
              </h2>
              <p>[Vollständiger Name und Anschrift — siehe Impressum]</p>
            </section>

            <section>
              <h2 className="font-serif text-[20px] text-ink mb-2">
                2. Daten, die wir verarbeiten
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-ink">Quiz-Antworten:</strong> Anonyme
                  Angaben aus 10 Fragen. Werden ausschließlich im
                  Browser-Tab-Speicher (sessionStorage) gehalten — bis du den
                  Kauf abschließt.
                </li>
                <li>
                  <strong className="text-ink">E-Mail-Adresse:</strong> Wird im
                  Stripe-Checkout erhoben und genutzt, um deinen PDF-Bericht
                  zuzustellen.
                </li>
                <li>
                  <strong className="text-ink">Zahlungsdaten:</strong>{" "}
                  Verarbeitet ausschließlich Stripe. Wir speichern keine
                  Kreditkartendaten.
                </li>
                <li>
                  <strong className="text-ink">Analytics:</strong> PostHog (EU)
                  zur anonymen Reichweiten- und Nutzungsmessung. Ohne Cookies in
                  Default-Konfiguration.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-[20px] text-ink mb-2">
                3. Rechtsgrundlagen
              </h2>
              <p>
                Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) für Quiz und
                Bericht-Zustellung. Art. 6 Abs. 1 lit. f DSGVO (berechtigtes
                Interesse) für aggregierte Nutzungsmessung.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-[20px] text-ink mb-2">
                4. Auftragsverarbeiter
              </h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Vercel Inc. (Hosting) — Region Frankfurt</li>
                <li>Stripe Payments Europe (Zahlungsabwicklung)</li>
                <li>Resend Inc. (Bericht-Zustellung per E-Mail)</li>
                <li>PostHog Inc. (Produkt-Analytics, EU-Instanz)</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-[20px] text-ink mb-2">
                5. Speicherdauer
              </h2>
              <p>
                Quiz-Antworten werden nicht serverseitig persistiert. Kauf- und
                Rechnungsdaten werden im Rahmen der gesetzlichen
                Aufbewahrungsfristen gespeichert.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-[20px] text-ink mb-2">
                6. Deine Rechte
              </h2>
              <p>
                Auskunft (Art. 15), Berichtigung (Art. 16), Löschung (Art. 17),
                Einschränkung (Art. 18), Datenübertragbarkeit (Art. 20) und
                Widerspruch (Art. 21). Anfragen an:{" "}
                <a
                  href="mailto:kontakt@auswanderkompass.de"
                  className="text-fir underline"
                >
                  kontakt@auswanderkompass.de
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
