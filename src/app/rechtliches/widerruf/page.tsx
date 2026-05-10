export const metadata = {
  title: "Widerrufsbelehrung — Auswander-Kompass",
};

export default function WiderrufPage() {
  return (
    <article>
      <h1 className="font-display font-bold text-3xl text-navy mb-6">
        Widerrufsbelehrung
      </h1>

      <p className="text-gray-400 text-sm mb-8">
        Stand: [Datum des Betreibers eintragen]
      </p>

      <section className="space-y-6 text-gray-700 leading-relaxed">
        <div>
          <h2 className="font-display font-bold text-lg text-navy mb-2">
            Widerrufsrecht
          </h2>
          <p>
            Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen
            diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn
            Tage ab dem Tag des Vertragsabschlusses.
          </p>
          <p>
            Um Ihr Widerrufsrecht auszuüben, müssen Sie uns per eindeutiger
            Erklärung (z. B. E-Mail) über Ihren Entschluss, diesen Vertrag zu
            widerrufen, informieren.
          </p>
          <p className="font-semibold">
            E-Mail: [kontakt@auswanderkompass.de]
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold text-lg text-navy mb-2">
            Folgen des Widerrufs
          </h2>
          <p>
            Wenn Sie diesen Vertrag widerrufen, erstatten wir Ihnen alle
            Zahlungen, die wir von Ihnen erhalten haben, unverzüglich und
            spätestens binnen vierzehn Tagen ab dem Tag, an dem die Mitteilung
            über Ihren Widerruf bei uns eingegangen ist. Für diese Rückzahlung
            verwenden wir dasselbe Zahlungsmittel, das Sie bei der
            ursprünglichen Transaktion eingesetzt haben.
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold text-lg text-navy mb-2">
            Hinweis zur vorzeitigen Nutzung
          </h2>
          <p>
            Mit Abschluss des Checkouts bestätigen Sie, dass Sie bereits mit der
            Nutzung der digitalen Inhalte beginnen möchten und dass Ihr
            Widerrufsrecht mit Beginn der Nutzung erlischt (§ 356 Abs. 5 BGB).
            Sie können statt des Widerrufs das Abo jederzeit zum Ende des
            laufenden Monats kündigen.
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold text-lg text-navy mb-2">
            Kulanzregelung
          </h2>
          <p>
            Unabhängig vom gesetzlichen Widerrufsrecht erstatten wir innerhalb
            der ersten 14 Tage den Kaufpreis, wenn der Fahrplan in Ihrer
            Situation keinen Nutzen bringt. Eine formlose E-Mail genügt.
          </p>
        </div>
      </section>
    </article>
  );
}
