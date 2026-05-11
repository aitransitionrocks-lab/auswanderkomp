import Link from "next/link";
import { CompassGlyph } from "@/components/brand/CompassGlyph";
import { HeroCompass } from "@/components/brand/HeroCompass";
import { SectionMarker } from "@/components/brand/SectionMarker";
import { RouteDivider } from "@/components/brand/RouteDivider";
import { PrimaryCTA } from "@/components/brand/PrimaryCTA";
import { Arrow } from "@/components/brand/Arrow";
import { FAQItem } from "@/components/ui/FAQItem";

export default function LandingPage() {
  return (
    <main className="bg-paper text-ink">
      {/* ─── 01 Header ─── */}
      <header className="border-b border-line">
        <div className="max-w-page mx-auto px-6 md:px-16 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <CompassGlyph size={32} stroke="#1E3A34" accent="#C4926B" />
            <div>
              <div className="font-serif text-[19px] tracking-tight leading-none">
                Auswander-Kompass
              </div>
              <div className="text-[11px] uppercase tracking-[0.12em] text-muted mt-1">
                Orientierung · Reihenfolge · Klarheit
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-5 text-xs text-muted uppercase tracking-[0.08em]">
            <span>N · Norden</span>
            <span className="w-6 h-px bg-line" />
            <span>Kurs setzen</span>
          </div>
        </div>
      </header>

      {/* ─── 02 Hero ─── */}
      <section className="px-6 md:px-16 py-16 md:py-28">
        <div className="max-w-page mx-auto grid md:grid-cols-[1.3fr_1fr] gap-10 md:gap-16 items-center">
          <div>
            <span className="inline-flex items-center gap-2.5 px-3.5 py-2 bg-highlight border border-line rounded-pill text-[12.5px] text-inkSoft mb-7">
              <span className="w-1.5 h-1.5 rounded-pill bg-copper" />
              Kurs setzen · in 3 Minuten
            </span>

            <h1 className="font-serif font-normal text-4xl md:text-[62px] leading-[1.03] tracking-[-0.025em] mb-7 text-balance">
              Beim Auswandern entscheidet die{" "}
              <span className="relative text-fir italic">
                Reihenfolge
                <svg
                  className="absolute left-0 right-0 -bottom-1 w-full h-2 block"
                  viewBox="0 0 120 8"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M1 5 Q30 1 60 4 T119 3"
                    stroke="#C4926B"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              — und Fehler können teuer werden.
            </h1>

            <p className="text-[18px] leading-[1.55] text-inkSoft mb-4 max-w-[52ch]">
              Der Auswander-Kompass zeigt dir auf Basis deiner Situation, welche
              Schritte du zuerst erledigen musst — und wo kritische Risiken
              entstehen.
            </p>
            <p className="text-[15px] text-muted mb-9 max-w-[50ch]">
              In 3–4 Minuten erhältst du eine persönliche Einschätzung mit klar
              priorisierten nächsten Schritten.
            </p>

            <div className="flex flex-wrap items-center gap-5">
              <PrimaryCTA href="/check">Einschätzung starten</PrimaryCTA>
              <div className="text-[13px] text-muted leading-snug">
                Dauer: ca. 3 Minuten
                <br />
                keine E-Mail erforderlich
              </div>
            </div>
          </div>

          <HeroCompass />
        </div>

        {/* Stat-Strip */}
        <div className="max-w-page mx-auto mt-16 md:mt-28 grid grid-cols-2 md:grid-cols-4 border border-line rounded-card overflow-hidden bg-paperAlt">
          {[
            ["10", "Fragen"],
            ["~3 min", "Zeit"],
            ["0 €", "Kosten"],
            ["anonym", "keine E-Mail"],
          ].map(([n, l], i, arr) => (
            <div
              key={i}
              className={`px-6 py-5 flex flex-col gap-1.5 ${
                i < arr.length - 1
                  ? i === 1
                    ? "md:border-r border-line"
                    : "border-r border-line"
                  : ""
              } ${i < 2 ? "border-b md:border-b-0 border-line" : ""}`}
            >
              <div className="font-serif text-[28px] md:text-[30px] leading-none text-fir tracking-tight">
                {n}
              </div>
              <div className="text-xs text-muted uppercase tracking-[0.08em]">
                {l}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 03 Problem ─── */}
      <section className="px-6 md:px-16 py-16 md:py-28">
        <div className="max-w-page mx-auto">
          <SectionMarker number="02" label="Problem" />
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start mt-7">
            <div>
              <h2 className="font-serif font-normal text-3xl md:text-[42px] leading-[1.1] tracking-[-0.02em] mb-6 text-balance">
                Die meisten Auswanderungen scheitern nicht am Wissen — sondern
                an der falschen Reihenfolge.
              </h2>
              <p className="text-[16.5px] leading-[1.65] text-inkSoft mb-4">
                Die meisten Familien haben bereits recherchiert. Checklisten
                gelesen. Videos gesehen. Und stehen trotzdem an genau derselben
                Stelle: sie wissen nicht, womit sie anfangen sollen.
              </p>
              <p className="text-[16.5px] leading-[1.65] text-inkSoft">
                Was oft fehlt, ist nicht Information — sondern Struktur. Genau
                hier entstehen die meisten Fehler: nicht aus Unwissen, sondern
                durch falsche Priorisierung.
              </p>
            </div>

            <div className="grid gap-3">
              {[
                ["Was muss zuerst geklärt werden?", "prio 1", true],
                ["Was ist zeitkritisch?", "frist", false],
                ["Was kann warten, ohne Risiko zu erzeugen?", "später", false],
              ].map(([q, tag, primary], i) => (
                <div
                  key={i}
                  className={`flex items-center gap-4 px-5 py-4 rounded-[10px] border ${
                    primary
                      ? "bg-fir text-paper border-fir"
                      : "bg-paperAlt text-ink border-line"
                  }`}
                >
                  <div
                    className={`text-[10.5px] uppercase tracking-[0.12em] font-medium w-14 shrink-0 ${
                      primary ? "text-copper" : "text-muted"
                    }`}
                  >
                    {tag}
                  </div>
                  <div className="font-serif text-[20px] leading-[1.3] tracking-tight">
                    {q}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Route Divider */}
      <div className="px-6 md:px-16 text-line">
        <div className="max-w-page mx-auto">
          <RouteDivider />
        </div>
      </div>

      {/* ─── 04 Was du erhältst ─── */}
      <section className="px-6 md:px-16 py-16 md:py-28 bg-paperAlt">
        <div className="max-w-page mx-auto">
          <SectionMarker number="03" label="Was du erhältst" />
          <h2 className="font-serif font-normal text-3xl md:text-[42px] leading-[1.1] tracking-[-0.02em] mt-7 mb-3 max-w-[26ch] text-balance">
            Eine Einschätzung, die zu deiner Situation passt.
          </h2>
          <p className="text-[16.5px] text-inkSoft mb-10 max-w-[54ch]">
            Nach wenigen Minuten weißt du ganz konkret:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              ["N", "kritisch", "welche Themen bei dir aktuell kritisch sind"],
              ["O", "zuerst", "womit du konkret beginnen solltest"],
              ["S", "später", "welche Schritte noch Zeit haben"],
              ["W", "risiko", "wo typische Fehler entstehen können"],
            ].map(([dir, tag, text], i) => (
              <div
                key={i}
                className="p-7 bg-paper border border-line rounded-card flex flex-col gap-4"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-pill border border-fir text-fir flex items-center justify-center font-serif text-sm">
                    {dir}
                  </div>
                  <div className="text-[11px] uppercase tracking-[0.14em] text-copper font-medium">
                    {tag}
                  </div>
                </div>
                <div className="font-serif text-[20px] leading-[1.3] text-ink tracking-tight">
                  {text}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-9 px-7 py-5 border border-dashed border-line rounded-card">
            <div className="text-[11.5px] uppercase tracking-[0.12em] text-muted mb-3">
              Grundlage der Einschätzung
            </div>
            <div className="flex flex-wrap gap-2">
              {["Zielland", "Zeitplan", "Familiensituation", "Berufliche Situation"].map(
                (x) => (
                  <span
                    key={x}
                    className="px-3.5 py-1.5 bg-paper border border-line rounded-pill text-[13px] text-ink"
                  >
                    {x}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 05 Was es leistet ─── */}
      <section className="px-6 md:px-16 py-16 md:py-28">
        <div className="max-w-page mx-auto">
          <SectionMarker number="04" label="Was es leistet" />
          <h2 className="font-serif font-normal text-3xl md:text-[42px] leading-[1.1] tracking-[-0.02em] mt-7 mb-5 max-w-[24ch] text-balance">
            Drei häufige Fehler — und wie der Kompass sie sichtbar macht.
          </h2>
          <p className="text-[16.5px] leading-[1.65] text-inkSoft mb-11 max-w-[60ch]">
            Die Einschätzung ersetzt keine individuelle Beratung. Sie zeigt dir
            jedoch, wo du aktuell stehst — und was jetzt wichtig wird. So
            vermeidest du typische Fehler:
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              [
                "Steuerliche Fristen verpasst",
                "Viele Auswanderer erfahren erst nach dem Wegzug von Meldepflichten oder Steuerkonsequenzen. Der Kompass zeigt dir, welche davon für dich relevant sind.",
                "✱",
              ],
              [
                "Schritte in falscher Reihenfolge",
                "Wer zuerst kündigt und dann die Formalitäten prüft, macht teure Fehler. Der Kompass priorisiert deine Schritte.",
                "↻",
              ],
              [
                "Versicherungslücken unbemerkt",
                "Zwischen GKV-Abmeldung und neuer Absicherung entsteht oft eine kritische Lücke. Der Kompass macht sie sichtbar.",
                "✕",
              ],
            ].map(([title, body, icon], i) => (
              <div
                key={i}
                className="p-7 bg-paper border border-line rounded-card"
              >
                <div className="w-9 h-9 rounded-lg bg-highlight text-fir flex items-center justify-center text-lg mb-5">
                  {icon}
                </div>
                <div className="text-[11px] uppercase tracking-[0.14em] text-muted mb-2">
                  Fehler {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="text-[17.5px] leading-[1.35] text-ink tracking-tight mb-3">
                  {title}
                </h3>
                <p className="text-[14.5px] text-inkSoft leading-[1.5]">
                  {body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-9 px-8 py-7 bg-fir text-paper rounded-card flex items-center gap-5">
            <CompassGlyph size={36} stroke="#F3EDE2" accent="#C4926B" />
            <div className="font-serif text-[18px] md:text-[20px] italic leading-[1.4] tracking-tight">
              Nicht was zu tun ist — sondern in welcher Reihenfolge und bis
              wann.
            </div>
          </div>
        </div>
      </section>

      {/* ─── 06 Für wen ─── */}
      <section className="px-6 md:px-16 py-16 md:py-28 bg-paperAlt">
        <div className="max-w-page mx-auto">
          <SectionMarker number="05" label="Für wen" />
          <h2 className="font-serif font-normal text-3xl md:text-[42px] leading-[1.1] tracking-[-0.02em] mt-7 mb-12 max-w-[24ch] text-balance">
            Für Familien, Selbstständige und Unternehmer mit klarem Wegzugs­plan.
          </h2>

          <div className="grid gap-3.5">
            {[
              [
                "Familien mit Kindern",
                "Schulwechsel, Kita-Suche und die Sorgerechts-Absicherung bei Auslandsumzug sind eigene Themenstränge.",
              ],
              [
                "Selbstständige & Freelancer",
                "Wer keine GmbH hat, aber als Freiberufler tätig ist, hat eigene steuerliche Fristen und Abmelderegeln.",
              ],
              [
                "Unternehmer mit GmbH oder Anteilen",
                "Wegzugsbesteuerung, Haltefristen und die internationale Unternehmensstruktur sind komplex — und zeitkritisch.",
              ],
              [
                "Angestellte im Wechsel",
                "Wer mit einem Jobangebot ins Ausland wechselt, hat andere Fristen als jemand, der remote arbeitet oder kündigt.",
              ],
            ].map(([label, text], i) => (
              <div
                key={i}
                className="grid md:grid-cols-[220px_1fr] gap-4 md:gap-7 items-baseline px-6 py-5 bg-paper border border-line rounded-[10px]"
              >
                <div className="flex items-center gap-2.5 text-[12.5px] text-fir font-medium tracking-wide">
                  <span className="font-serif text-[18px] text-copper w-6 text-right">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {label}
                </div>
                <div className="text-[16px] leading-[1.5] text-ink">
                  {text}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-9 text-[16px] text-inkSoft italic font-serif text-center">
            Wenn dir einer dieser Punkte bekannt vorkommt, bist du hier richtig.
          </p>
        </div>
      </section>

      {/* ─── 07 So funktioniert es ─── */}
      <section className="px-6 md:px-16 py-16 md:py-28">
        <div className="max-w-page mx-auto">
          <SectionMarker number="06" label="So funktioniert es" />
          <h2 className="font-serif font-normal text-3xl md:text-[42px] leading-[1.1] tracking-[-0.02em] mt-7 mb-14 max-w-[24ch] text-balance">
            Drei Etappen — und dein Weg wird klarer.
          </h2>

          <div className="relative">
            <svg
              viewBox="0 0 1000 40"
              preserveAspectRatio="none"
              className="hidden md:block absolute left-5 right-5 top-7 w-[calc(100%-2.5rem)] h-10 z-0"
              aria-hidden="true"
            >
              <path
                d="M40 20 Q200 0 340 20 T660 20 T960 20"
                stroke="#C4926B"
                strokeWidth="1.5"
                strokeDasharray="3 6"
                fill="none"
                strokeLinecap="round"
              />
            </svg>

            <div className="grid md:grid-cols-3 gap-6 relative z-10">
              {[
                ["10 Fragen", "Du beantwortest 10 kurze Fragen zu deiner Situation."],
                [
                  "Risiken sichtbar",
                  "Du siehst sofort, wo Risiken entstehen können.",
                ],
                [
                  "Deine Reihenfolge",
                  "Du erhältst deine nächsten Schritte in sinnvoller Reihenfolge.",
                ],
              ].map(([title, body], i) => (
                <div
                  key={i}
                  className="p-7 bg-paper border border-line rounded-card"
                >
                  <div className="w-13 h-13 rounded-pill bg-paper border-[1.5px] border-fir flex items-center justify-center font-serif text-[22px] text-fir mb-5 tracking-tight w-[52px] h-[52px]">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="text-[11.5px] uppercase tracking-[0.14em] text-copper mb-2.5 font-medium">
                    Schritt {i + 1}
                  </div>
                  <h3 className="font-serif text-[22px] leading-[1.25] text-ink tracking-tight mb-3">
                    {title}
                  </h3>
                  <p className="text-[14.5px] text-inkSoft leading-[1.5]">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 08 Vertrauen + FAQ ─── */}
      <section className="px-6 md:px-16 py-16 md:py-28 bg-paperAlt">
        <div className="max-w-page mx-auto grid md:grid-cols-[1fr_1.2fr] gap-10 md:gap-16 items-start">
          <div>
            <SectionMarker number="07" label="Vertrauen" />
            <h2 className="font-serif font-normal text-2xl md:text-[32px] leading-[1.15] tracking-[-0.02em] mt-6 mb-6 text-balance">
              Basiert auf realen Abläufen — nicht auf allgemeinen Checklisten.
            </h2>
            <p className="text-[15.5px] leading-[1.65] text-inkSoft mb-4">
              Der Auswander-Kompass basiert auf realen Abläufen aus
              Auswanderungs­prozessen. Er hilft dir, Struktur in ein komplexes
              Thema zu bringen und typische Fehler zu vermeiden.
            </p>
            <p className="text-[14px] leading-[1.6] text-muted">
              Er ersetzt jedoch keine rechtliche oder steuerliche Beratung.
            </p>
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.14em] text-muted font-medium mb-3">
              Häufige Fragen
            </div>
            <div className="border-b border-line">
              <FAQItem
                initiallyOpen
                q="Wie lange dauert die Einschätzung wirklich?"
                a="Die meisten Nutzer beantworten die 10 Fragen in 3 bis 4 Minuten. Du kannst jede Frage auslassen und später ergänzen."
              />
              <FAQItem
                q="Muss ich eine E-Mail-Adresse angeben?"
                a="Nein. Die Einschätzung läuft vollständig anonym. Wenn du das Ergebnis als PDF speichern oder zugeschickt bekommen möchtest, gibst du sie erst beim Checkout an."
              />
              <FAQItem
                q="Ersetzt das eine Beratung?"
                a="Nein. Die Einschätzung ordnet deine Situation strukturell ein und zeigt, wo Priorität liegt. Rechtliche, steuerliche oder behördliche Beratung bleibt individuell."
              />
              <FAQItem
                q="Für welche Zielländer funktioniert der Kompass?"
                a="Der Kompass ist länderunabhängig aufgebaut. Die Fragen berücksichtigen die spezifischen Fristen und Abläufe typischer Zielländer im europäischen Raum, Nordamerika und weiteren Regionen."
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── 09 Final CTA ─── */}
      <section className="relative overflow-hidden bg-fir text-paper px-6 md:px-16 py-16 md:py-28">
        <div className="absolute -right-20 -top-10 opacity-[0.12] text-copper pointer-events-none">
          <CompassGlyph size={420} stroke="#C4926B" accent="#C4926B" />
        </div>
        <div className="max-w-page mx-auto relative z-10 max-w-[720px]">
          <div className="text-xs uppercase tracking-[0.14em] text-copper mb-6 font-medium">
            08 — Jetzt Kurs setzen
          </div>
          <h2 className="font-serif font-normal text-3xl md:text-[46px] leading-[1.08] tracking-[-0.025em] mb-6 text-balance text-paper">
            Die Entscheidung ist bereits gefallen. Die Frage ist jetzt die
            Reihenfolge.
          </h2>
          <p className="font-serif italic text-[18px] leading-[1.55] text-copper mb-4 max-w-[50ch]">
            Womit beginnst du — und was darf nicht warten?
          </p>
          <p className="text-[16px] text-paper opacity-80 mb-9 max-w-[52ch]">
            Genau das klärt der Auswander-Kompass für dich.
          </p>

          <div className="flex flex-wrap items-center gap-5">
            <Link
              href="/check"
              className="inline-flex items-center gap-2.5 px-7 py-[18px] text-[17px] font-medium bg-copper text-fir rounded-pill hover:bg-copper-deep hover:text-paper transition-colors"
            >
              Einschätzung starten <Arrow size={16} />
            </Link>
            <span className="text-[13.5px] text-copper opacity-85">
              Dauer: ca. 3 Minuten · keine E-Mail erforderlich
            </span>
          </div>
        </div>
      </section>

      {/* ─── 10 Footer ─── */}
      <footer className="px-6 md:px-16 py-9 border-t border-line">
        <div className="max-w-page mx-auto flex flex-wrap justify-between items-center gap-4 text-[13px] text-muted">
          <div className="flex items-center gap-2.5">
            <CompassGlyph size={20} stroke="#7A7164" accent="#7A7164" />
            <span>Auswander-Kompass</span>
          </div>
          <div className="text-right max-w-[55ch]">
            <Link href="/impressum" className="hover:text-ink mr-3">
              Impressum
            </Link>
            <Link href="/datenschutz" className="hover:text-ink">
              Datenschutz
            </Link>
          </div>
        </div>
        <div className="max-w-page mx-auto mt-3 text-[12px] text-muted text-right">
          Keine Werbung · keine Verpflichtung · nur eine erste, strukturierte
          Einordnung deiner Situation.
        </div>
      </footer>
    </main>
  );
}
