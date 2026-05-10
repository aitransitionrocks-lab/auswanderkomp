import Link from "next/link";
import { PageViewTracker } from "@/components/shared/PageViewTracker";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <PageViewTracker event="lp_view" />
      {/* Hero */}
      <section className="bg-navy text-white">
        <div className="max-w-4xl mx-auto px-6 py-20 md:py-28">
          <p className="text-teal-mid font-display font-semibold text-sm tracking-[0.2em] uppercase mb-6">
            Auswander-Kompass
          </p>
          <h1 className="font-display font-bold text-3xl md:text-5xl leading-[1.15] mb-6 text-balance">
            Ein strukturierter Fahrplan — statt noch mehr Artikel, Foren und
            Widersprüche.
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed">
            Zehn Fragen genügen, um Ihre Situation einzuschätzen — und Ihnen zu
            zeigen, welche Schritte in welcher Reihenfolge wirklich wichtig sind.
          </p>

          <Link
            href="/diagnose"
            className="inline-block px-8 py-4 bg-teal hover:bg-teal-mid text-white font-display font-bold text-lg rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Einschätzung starten
          </Link>

          <p className="mt-4 text-sm text-gray-400">
            Kostenlos. Dauert etwa 3 Minuten. Keine Anmeldung nötig.
          </p>
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-navy text-center mb-14">
            Warum die meisten Auswanderungen nicht an Information scheitern
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card
              title="Überall andere Aussagen"
              body="Foren, YouTube, Facebook-Gruppen — jede Quelle sagt etwas anderes. Je mehr Sie lesen, desto unsicherer werden Sie."
            />
            <Card
              title="Reihenfolge unklar"
              body="Steuer, KV, Visa, Schule — alles gleichzeitig. Was zuerst, was später? Ohne Struktur bleibt alles offen."
            />
            <Card
              title="Fristen werden verpasst"
              body="Wer zu spät mit den richtigen Schritten anfängt, zahlt entweder Geld nach — oder verliert Gestaltungsoptionen."
            />
          </div>
        </div>
      </section>

      {/* Lösung */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-navy text-center mb-4">
            Ein Ablaufplan in der richtigen Reihenfolge
          </h2>
          <p className="text-center text-gray-500 mb-14 max-w-xl mx-auto">
            Zugeschnitten auf Ihr Zielland, Ihren Zeitplan und Ihre
            Familien­situation — nicht generisch.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <Step
              num={1}
              title="10 Fragen beantworten"
              body="Zielland, Zeitplan, Familien­situation, Steuer, Krankenversicherung."
            />
            <Step
              num={2}
              title="Persönliche Einschätzung"
              body="Risikoprofil, typische Fehler in Ihrer Situation, konkrete erste Schritte."
            />
            <Step
              num={3}
              title="Strukturierter Fahrplan"
              body="Vollständiger Plan mit Fristen und kurzen Begründungen — für 29 €/Monat freischaltbar."
            />
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-16 bg-teal-faint">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="font-display font-semibold text-teal text-lg mb-3">
            Für Menschen, die strukturiert statt emotional entscheiden.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Der Auswander-Kompass ersetzt keinen Steuerberater und keinen
            Anwalt. Er zeigt Ihnen, wann Sie einen brauchen — und welche Schritte
            Sie selbst in welcher Reihenfolge machen sollten.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-navy text-white">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-display font-bold text-2xl md:text-3xl mb-4">
            Beginnen Sie mit der Einschätzung.
          </h2>
          <p className="text-gray-300 mb-10">
            Zehn Fragen. Drei Minuten. Ein ehrliches Bild Ihrer Situation.
          </p>
          <Link
            href="/diagnose"
            className="inline-block px-8 py-4 bg-teal hover:bg-teal-mid text-white font-display font-bold text-lg rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Einschätzung starten
          </Link>
        </div>
      </section>

      <footer className="py-8 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 text-sm text-gray-400 text-center space-x-2">
          <span>Auswander-Kompass ·</span>
          <Link href="/rechtliches/impressum" className="hover:text-gray-600">Impressum</Link>
          <span>·</span>
          <Link href="/rechtliches/datenschutz" className="hover:text-gray-600">Datenschutz</Link>
          <span>·</span>
          <Link href="/rechtliches/agb" className="hover:text-gray-600">AGB</Link>
          <span>·</span>
          <Link href="/rechtliches/widerruf" className="hover:text-gray-600">Widerruf</Link>
        </div>
      </footer>
    </main>
  );
}

function Card({ title, body }: { title: string; body: string }) {
  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
      <h3 className="font-display font-bold text-lg text-navy mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{body}</p>
    </div>
  );
}

function Step({
  num,
  title,
  body,
}: {
  num: number;
  title: string;
  body: string;
}) {
  return (
    <div>
      <div className="w-12 h-12 bg-teal-light text-teal rounded-full flex items-center justify-center mb-4 font-display font-bold text-xl">
        {num}
      </div>
      <h3 className="font-display font-bold text-lg text-navy mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{body}</p>
    </div>
  );
}
