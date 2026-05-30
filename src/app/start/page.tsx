import Link from "next/link";
import { CompassGlyph } from "@/components/brand/CompassGlyph";
import { Arrow } from "@/components/brand/Arrow";
import { LeadMagnetInline } from "@/components/blog/LeadMagnetInline";
import { START_PAGE_CONFIG } from "@/config/start-page";

export const metadata = {
  title: "Auswander-Kompass — Dein Start",
  description:
    "Quiz, kostenloser Leitfaden und aktuelle Guides für Familien aus DACH.",
  robots: { index: false, follow: true },
};

export default function StartPage() {
  const { featuredArticle, showModules, modules } = START_PAGE_CONFIG;

  return (
    <main className="min-h-screen bg-paper text-ink">
      <div className="max-w-sm mx-auto px-5 py-8 space-y-5">
        {/* Logo + Tagline */}
        <header className="text-center pt-2 pb-4">
          <div className="flex justify-center mb-3">
            <CompassGlyph size={48} stroke="#1E3A34" accent="#C4926B" />
          </div>
          <div className="font-serif text-[22px] text-ink tracking-tight">
            Auswander-Kompass
          </div>
          <p className="text-[13px] text-muted mt-1">
            Strukturierte Auswanderung für Familien
          </p>
        </header>

        {/* Block 1: Quiz-CTA */}
        <section className="rounded-xl bg-fir text-paper p-6">
          <div className="text-[10px] uppercase tracking-[0.16em] text-copper font-medium mb-3">
            Kostenlose Einschätzung
          </div>
          <h2 className="font-serif text-[22px] leading-snug mb-2">
            Dein persönlicher Auswanderungs-Fahrplan
          </h2>
          <p className="text-[14px] text-paper/75 mb-5">
            10 Fragen · 3 Minuten · sofortiges Ergebnis
          </p>
          <Link
            href="/check"
            className="flex items-center justify-center gap-2 w-full px-5 py-3.5 bg-copper text-fir rounded-pill font-medium hover:bg-copper-deep hover:text-paper transition-colors"
          >
            Einschätzung starten <Arrow size={14} />
          </Link>
          <p className="text-[11px] text-paper/50 mt-3 text-center">
            Detaillierter PDF-Bericht optional für 27 €
          </p>
        </section>

        <div className="h-px bg-line" />

        {/* Block 2: Lead-Magnet */}
        <LeadMagnetInline
          title="Die Auswanderungs-Reihenfolge"
          description="Was zuerst, was danach, was nie gleichzeitig — als PDF für Familien."
          source="start"
        />

        <div className="h-px bg-line" />

        {/* Block 3: Aktueller Artikel */}
        <section className="rounded-xl bg-white border border-line p-5">
          <div className="text-[10px] uppercase tracking-[0.14em] text-copper font-medium mb-2">
            Aktuell im Blog
          </div>
          <h3 className="font-serif text-[18px] text-ink leading-snug mb-2">
            {featuredArticle.title}
          </h3>
          <p className="text-[13px] text-muted leading-[1.5] mb-3">
            {featuredArticle.teaser}
          </p>
          <Link
            href={featuredArticle.slug}
            className="inline-flex items-center gap-1.5 text-[14px] text-fir hover:text-fir-deep font-medium"
          >
            Jetzt lesen <Arrow size={12} />
          </Link>
        </section>

        {/* Block 4: Module (nur wenn aktiviert) */}
        {showModules && modules.length > 0 && (
          <section>
            <div className="text-[10px] uppercase tracking-[0.14em] text-copper font-medium mb-3">
              Unsere Vertiefungs-Module
            </div>
            <div className="space-y-3">
              {modules.map((m) => (
                <Link
                  key={m.slug}
                  href={m.slug}
                  className="block rounded-xl bg-white border border-line p-4 hover:border-fir transition-colors"
                >
                  <div className="font-serif text-[16px] text-ink">{m.title}</div>
                  <div className="text-[13px] text-copper-deep mt-1">{m.price}</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="pt-6 pb-4 text-center text-[11px] text-muted space-x-2">
          <a href="#" className="hover:text-ink">Instagram</a>
          <span>·</span>
          <a href="#" className="hover:text-ink">TikTok</a>
          <span>·</span>
          <Link href="/impressum" className="hover:text-ink">Impressum</Link>
          <span>·</span>
          <Link href="/datenschutz" className="hover:text-ink">Datenschutz</Link>
        </footer>
      </div>
    </main>
  );
}
