export const metadata = {
  title: "Datenschutz — Auswander-Kompass",
};

export default function DatenschutzPage() {
  return (
    <article>
      <h1 className="font-display font-bold text-3xl text-navy mb-6">
        Datenschutzerklärung
      </h1>

      <p className="text-gray-400 text-sm mb-8">
        Stand: [Datum des Betreibers eintragen]
      </p>

      <section className="space-y-6 text-gray-700 leading-relaxed">
        <div>
          <h2 className="font-display font-bold text-lg text-navy mb-2">
            1. Verantwortlicher
          </h2>
          <p>
            [Vollständiger Name und Anschrift des Anbieters — siehe Impressum]
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold text-lg text-navy mb-2">
            2. Daten, die wir verarbeiten
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Quiz-Antworten:</strong> Anonyme Angaben zu Zielland,
              Zeitplan, Familien- und Berufssituation. Werden zur Erstellung
              Ihrer Einschätzung verwendet.
            </li>
            <li>
              <strong>E-Mail-Adresse:</strong> Erhoben im Stripe-Checkout,
              gespeichert mit dem Abo zur Zustellung des Zugangslinks und für
              Rechnungsstellung.
            </li>
            <li>
              <strong>Zahlungsdaten:</strong> Werden ausschließlich von Stripe
              verarbeitet. Wir selbst speichern keine Kreditkartendaten.
            </li>
            <li>
              <strong>Technische Daten:</strong> Seitenaufruf-Events (anonym
              aggregiert über PostHog, Hosting in der EU).
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-display font-bold text-lg text-navy mb-2">
            3. Rechtsgrundlagen
          </h2>
          <p>
            Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) für Quiz und
            Abo-Verwaltung. Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)
            für anonymisiertes Produkt-Tracking.
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold text-lg text-navy mb-2">
            4. Auftragsverarbeiter
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Vercel Inc. (Hosting) — Server in der EU</li>
            <li>Supabase Inc. (Datenbank) — Server in der EU</li>
            <li>Stripe Payments Europe (Zahlungsabwicklung)</li>
            <li>Resend Inc. (E-Mail-Versand)</li>
            <li>PostHog Inc. (Produkt-Analytics, EU-Instanz)</li>
          </ul>
          <p className="mt-3">
            Mit allen Dienstleistern bestehen Auftragsverarbeitungsverträge nach
            Art. 28 DSGVO.
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold text-lg text-navy mb-2">
            5. Speicherdauer
          </h2>
          <p>
            Quiz-Daten werden 24 Monate nach Erhebung gelöscht, wenn kein Abo
            darauf folgt. Abo- und Rechnungsdaten werden im Rahmen der
            gesetzlichen Aufbewahrungsfristen (10 Jahre) gespeichert.
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold text-lg text-navy mb-2">
            6. Ihre Rechte
          </h2>
          <p>
            Sie haben das Recht auf Auskunft (Art. 15), Berichtigung (Art. 16),
            Löschung (Art. 17), Einschränkung (Art. 18), Datenübertragbarkeit
            (Art. 20) und Widerspruch (Art. 21) nach DSGVO. Anfragen richten Sie
            an: [kontakt@auswanderkompass.de]
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold text-lg text-navy mb-2">
            7. Cookies
          </h2>
          <p>
            Wir verwenden einen HttpOnly-Session-Cookie nach erfolgreicher
            Zahlung, um Ihren Zugang zum Paid-Bereich zu ermöglichen.
            PostHog-Cookies werden nur mit Ihrer Einwilligung gesetzt.
          </p>
        </div>
      </section>
    </article>
  );
}
