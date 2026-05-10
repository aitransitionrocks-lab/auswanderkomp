export const metadata = {
  title: "Impressum — Auswander-Kompass",
};

export default function ImpressumPage() {
  return (
    <article>
      <h1 className="font-display font-bold text-3xl text-navy mb-6">
        Impressum
      </h1>

      <p className="text-gray-400 text-sm mb-8">
        Stand: [Datum des Betreibers eintragen]
      </p>

      <section className="space-y-6 text-gray-700 leading-relaxed">
        <div>
          <h2 className="font-display font-bold text-lg text-navy mb-2">
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
        </div>

        <div>
          <h2 className="font-display font-bold text-lg text-navy mb-2">
            Kontakt
          </h2>
          <p>
            E-Mail: [kontakt@auswanderkompass.de]
            <br />
            Telefon: [optional]
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold text-lg text-navy mb-2">
            Umsatzsteuer-ID
          </h2>
          <p>
            Umsatzsteuer-Identifikationsnummer gemäß § 27 a
            Umsatzsteuergesetz: [USt-ID eintragen]
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold text-lg text-navy mb-2">
            Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
          </h2>
          <p>[Vor- und Nachname, Anschrift wie oben]</p>
        </div>

        <div>
          <h2 className="font-display font-bold text-lg text-navy mb-2">
            Haftungshinweis
          </h2>
          <p>
            Der Auswander-Kompass stellt allgemeine strukturelle Orientierung
            bereit und ersetzt keine steuerliche, rechtliche oder
            versicherungstechnische Beratung im Einzelfall. Alle Angaben sind
            sorgfältig recherchiert, aber ohne Gewähr auf Vollständigkeit oder
            Aktualität. Für verbindliche Entscheidungen ist eine individuelle
            Beratung durch qualifizierte Fachpersonen erforderlich.
          </p>
        </div>
      </section>
    </article>
  );
}
