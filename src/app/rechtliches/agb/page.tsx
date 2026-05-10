export const metadata = {
  title: "AGB — Auswander-Kompass",
};

export default function AGBPage() {
  return (
    <article>
      <h1 className="font-display font-bold text-3xl text-navy mb-6">
        Allgemeine Geschäftsbedingungen
      </h1>

      <p className="text-gray-400 text-sm mb-8">
        Stand: [Datum des Betreibers eintragen]
      </p>

      <section className="space-y-6 text-gray-700 leading-relaxed">
        <div>
          <h2 className="font-display font-bold text-lg text-navy mb-2">
            § 1 Anbieter
          </h2>
          <p>[Anbieter-Angaben wie im Impressum]</p>
        </div>

        <div>
          <h2 className="font-display font-bold text-lg text-navy mb-2">
            § 2 Gegenstand der Leistung
          </h2>
          <p>
            Der Auswander-Kompass ist ein digitales Informations- und
            Strukturierungsprodukt für Personen, die einen Wohnsitzwechsel ins
            Ausland planen. Die Leistung umfasst den Zugang zu einer
            personalisierten Einschätzung und einem strukturierten Fahrplan mit
            priorisierten Aufgaben und Fristen.
          </p>
          <p>
            Die Leistung ersetzt keine Steuer-, Rechts- oder
            Versicherungsberatung. Auf konkreten Beratungsbedarf weisen wir im
            Fahrplan explizit hin.
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold text-lg text-navy mb-2">
            § 3 Vertragsschluss
          </h2>
          <p>
            Der Vertrag kommt mit erfolgreichem Abschluss des Stripe-Checkouts
            zustande. Die Bestätigungs-E-Mail dokumentiert den
            Vertragsabschluss.
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold text-lg text-navy mb-2">
            § 4 Preis, Abrechnung und Laufzeit
          </h2>
          <p>
            Der Preis beträgt 29,00 € pro Monat inkl. gesetzlicher Umsatzsteuer
            (für DE/AT/CH). Das Abo ist ein fortlaufendes Monatsabo, das sich
            automatisch verlängert, bis es gekündigt wird.
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold text-lg text-navy mb-2">
            § 5 Kündigung
          </h2>
          <p>
            Sie können Ihr Abo jederzeit zum Ende des laufenden Monats
            selbständig über den Stripe-Kundenbereich kündigen. Der Link dazu
            ist im eingeloggten Dashboard jederzeit verfügbar.
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold text-lg text-navy mb-2">
            § 6 Widerrufsrecht
          </h2>
          <p>
            Verbraucher:innen haben ein 14-tägiges Widerrufsrecht ab
            Vertragsabschluss. Details entnehmen Sie der{" "}
            <a href="/rechtliches/widerruf" className="text-teal underline">
              Widerrufsbelehrung
            </a>
            .
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold text-lg text-navy mb-2">
            § 7 Haftung
          </h2>
          <p>
            Wir haften unbeschränkt bei Vorsatz und grober Fahrlässigkeit sowie
            bei Verletzung von Leben, Körper und Gesundheit. Für leichte
            Fahrlässigkeit haften wir nur bei Verletzung wesentlicher
            Vertragspflichten und begrenzt auf den vertragstypischen,
            vorhersehbaren Schaden.
          </p>
          <p>
            Keine Haftung für Schäden, die aus Handlungen oder
            Unterlassungen Dritter (z. B. Behörden, Steuerberater, Banken)
            entstehen, die durch Informationen im Fahrplan angestoßen werden.
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold text-lg text-navy mb-2">
            § 8 Anwendbares Recht
          </h2>
          <p>Es gilt das Recht der Bundesrepublik Deutschland.</p>
        </div>
      </section>
    </article>
  );
}
