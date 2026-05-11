# Claude Code — Auswander-Kompass · Vollständiger Build-Auftrag
## Landingpage + Quiz-Funnel + Ergebnis-Architektur

**Version:** 1.0 · Mai 2026  
**Projekt:** auswanderkompass.de  
**Brand:** Auswander-Kompass / Novamundi / AiGuys

---

## ── EINLEITENDER PROMPT FÜR CLAUDE CODE ──

> Lies dieses Dokument vollständig und in der angegebenen Reihenfolge durch, bevor du irgendeine Zeile Code schreibst. Alle Designentscheidungen, alle Texte und alle Logik-Regeln sind hier bereits festgelegt. Deine Aufgabe ist es, sie 1:1 umzusetzen — nicht zu interpretieren oder zu verbessern. Wenn etwas unklar ist, frage nach, bevor du beginnst.
>
> **Referenz-Dateien im Projekt (alle lesen vor Build-Start):**
> - `components/shared.jsx` — Design-Tokens, CompassGlyph, PrimaryCTA, FAQItem, Modal
> - `components/variant-cartographic.jsx` — vollständige visuelle Referenz (JSX-Mockup, Inline-Styles)
> - `MVP.md` — 10 Quiz-Fragen, Scoring-Logik, Segment-Texte, Ergebnis-Architektur
> - `CLAUDE_CODE_BUILD_SPEC.md` — Tech-Stack, Seitenstruktur, Akzeptanzkriterien
>
> **Arbeitsregel:** Übersetze die Inline-Styles aus `variant-cartographic.jsx` in Tailwind-Klassen mit den definierten Theme-Tokens. Visuell muss das Resultat pixelgenau zur Referenz passen.

---

## 1. PROJEKT-ÜBERSICHT

### Was gebaut wird

Eine produktionsfähige Next.js-Website für **auswanderkompass.de** bestehend aus:

| Seite | Zweck |
|-------|-------|
| `/` | Landingpage — Variante "Kartographisch" |
| `/check` | 10-Fragen-Quiz (1 Frage pro Schritt) |
| `/check/ergebnis` | Ergebnisseite mit Diagnose + Paywall |
| `/danke` | Dankeseite nach Kaufabschluss |
| `/datenschutz` | DSGVO-Pflichtseite |
| `/impressum` | §5 TMG Pflichtseite |

### Kern-Funktionsfluss

```
Landingpage
    ↓ CTA "Einschätzung starten"
/check (Frage 1–10, je ein Schritt)
    ↓ Letzte Frage abgeschickt
/check/ergebnis
    ↓ Zone A: kostenlos (Diagnose)
    ↓ Zone B: gelockt (Teaser weiterer Risiken)
    ↓ Zone C: CTA → Stripe Checkout (27 €)
    ↓ Nach erfolgreicher Zahlung
/danke
    ↓ E-Mail mit PDF-Bericht (Resend)
```

---

## 2. TECH-STACK (verbindlich, keine Abweichungen)

| Bereich | Technologie |
|---------|-------------|
| Framework | Next.js 14 (App Router) |
| Sprache | TypeScript |
| Styling | Tailwind CSS + Custom Theme-Tokens |
| UI-Primitives | shadcn/ui (Button, Input, RadioGroup, Accordion) |
| Formular-Validierung | react-hook-form + zod |
| E-Mail | Resend (EU-Region) |
| PDF-Erzeugung | @react-pdf/renderer (serverseitig) |
| Sessions | Vercel KV oder Supabase (Wahl beim Deploy) |
| Analytics | Plausible (cookielos) |
| Zahlungen | Stripe (mode: 'payment', 27 €) |
| Hosting | Vercel (Region: fra1 — Frankfurt) |
| Fonts | next/font/google: Fraunces + Inter Tight |

---

## 3. DESIGN-TOKENS (verbindlich)

### Farben — Tailwind-Theme (`tailwind.config.ts`)

```typescript
colors: {
  paper:      '#F3EDE2',   // background
  paperAlt:   '#EBE3D3',   // alt section bg
  highlight:  '#E8DCC2',   // pill bg
  ink:        '#1F2A24',   // primary text
  inkSoft:    '#44504A',   // body text
  muted:      '#7A7164',   // tertiary / labels
  line:       '#D8CDB8',   // borders / dividers
  fir:        '#1E3A34',   // primary brand (Tannengrün)
  firDeep:    '#162A25',   // hover
  copper:     '#C4926B',   // accent (Kupfer)
  copperDeep: '#A67353',   // accent hover
}
```

**Regel:** Niemals laute Sättigung. Niemals Gradient-Hintergründe. Akzent ist **immer** Kupfer auf Tannengrün oder Tannengrün auf Papier.

### Typografie

```typescript
// next/font/google — in app/layout.tsx
import { Fraunces, Inter_Tight } from 'next/font/google'

const serif = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--ak-serif',
})
const sans = Inter_Tight({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--ak-sans',
})
```

| Element | Größe (desktop) | Line-height | Letter-spacing |
|---------|----------------|-------------|----------------|
| h1 | 62px | 1.03 | −0.025em |
| h2 | 42px | 1.10 | −0.020em |
| h3 | 32px | 1.15 | — |
| Lead | 18px | 1.55 | — |
| Body | 16px | 1.65 | — |
| Eyebrow | 12px | — | 0.14em / uppercase |

Mobile (≤768px): h1 → 40px, h2 → 30px, h3 → 24px.

**font-feature-settings:** `"ss01"` für Fraunces aktivieren.

### Spacing & Radius

| Token | Wert |
|-------|------|
| Section-Padding desktop | 112px vertikal / 64px horizontal |
| Section-Padding mobile | 64px vertikal / 24px horizontal |
| Container max-width | 1040px, zentriert |
| Border-Radius pills | 999px |
| Border-Radius cards | 12px |
| Border-Radius buttons | 999px |
| Border-Standard | 1px solid `line` |

### Map-Texture (Pseudo-Element)

Absolutes Pseudo-Element im `<body>`, hinter Inhalt:

```css
background-image: radial-gradient(#D8CDB8 0.6px, transparent 0.6px);
background-size: 24px 24px;
mask-image: linear-gradient(180deg, black 0%, black 92%, transparent 100%);
opacity: 0.35;
pointer-events: none;
```

---

## 4. KOMPONENTEN-STRUKTUR

```
app/
  layout.tsx                  // Fonts, Plausible, body-styles, map-texture
  page.tsx                    // Landingpage
  check/
    page.tsx                  // Quiz-Einstieg (redirect zu /check/1)
    [step]/
      page.tsx                // Einzelne Frage (1–10)
  check/ergebnis/
    page.tsx                  // Ergebnis + Paywall
  danke/
    page.tsx                  // Dankeseite
  api/
    report/
      route.ts                // POST: PDF erzeugen + Resend versenden
    create-checkout/
      route.ts                // POST: Stripe Checkout Session erstellen
    webhook/
      route.ts                // POST: Stripe Webhook verarbeiten

components/
  brand/
    CompassGlyph.tsx          // Aus shared.jsx — 1:1 übernehmen
    HeroCompass.tsx           // Aus variant-cartographic.jsx — 1:1 übernehmen
    SectionMarker.tsx         // Aus variant-cartographic.jsx
    RouteDivider.tsx          // RouteLine aus shared.jsx
    PrimaryCTA.tsx            // Aus shared.jsx
  landing/
    Hero.tsx
    Problem.tsx
    Outcome.tsx               // "Was du erhältst"
    Performance.tsx           // "Was es leistet"
    Audience.tsx              // "Für wen"
    HowItWorks.tsx
    TrustFAQ.tsx
    FinalCTA.tsx
    Footer.tsx
  check/
    QuestionStep.tsx
    Progress.tsx
    EmailForm.tsx
  ergebnis/
    RiskCompass.tsx           // Visuelles Risiko-Kompass-Profil (Ampel)
    LockedCard.tsx            // Verschwommene, gesperrte Risikokarte
    ResultHeader.tsx
    PaywallSection.tsx
  ui/                         // shadcn/ui

lib/
  questions.ts                // 10 Fragen — exakt aus MVP.md Section 4
  scoring.ts                  // calculateScore(), getSegment(), getRiskProfile()
  segments.ts                 // Segment-Texte — exakt aus MVP.md Section 5
  pdf/
    Report.tsx                // @react-pdf/renderer — PDF-Bericht
  email/
    template.tsx              // Resend HTML-Template
```

---

## 5. QUIZ-DATEN — direkt aus MVP.md

### `/lib/questions.ts` (vollständiger Inhalt)

```typescript
export type SegmentId = 'dreamer' | 'planer' | 'fortgeschrittener' | 'starter'

export interface QuizOption {
  option: 'A' | 'B' | 'C' | 'D'
  score: 1 | 2 | 3 | 4
  text: string
}

export interface QuizQuestion {
  id: number
  question: string
  dimension: string
  hook: string
  answers: QuizOption[]
}

export const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Warum möchtest du auswandern?',
    dimension: 'Motivation & Klarheit',
    hook: 'Ziel-Bewusstsein',
    answers: [
      { option: 'A', score: 1, text: 'Ich träume davon, habe aber noch kein konkretes Warum.' },
      { option: 'B', score: 2, text: 'Mehr Freiheit, Sonne und Lebensqualität für meine Familie.' },
      { option: 'C', score: 3, text: 'Steueroptimierung und finanzielle Unabhängigkeit.' },
      { option: 'D', score: 4, text: 'Ich habe ein klares Ziel und einen konkreten Plan dahinter.' },
    ],
  },
  {
    id: 2,
    question: 'Wie klar ist dein Zielland?',
    dimension: 'Zielland-Wissen',
    hook: 'Orientierungslücke',
    answers: [
      { option: 'A', score: 1, text: 'Ich habe noch kein konkretes Land im Kopf.' },
      { option: 'B', score: 2, text: 'Ich habe 2–3 Länder im Kopf, bin noch unentschlossen.' },
      { option: 'C', score: 3, text: 'Ich weiß wohin, kenne aber die lokalen Regeln kaum.' },
      { option: 'D', score: 4, text: 'Ich kenne Steuersystem, Visum und Alltag meines Ziellandes.' },
    ],
  },
  {
    id: 3,
    question: 'Wann möchtest du auswandern?',
    dimension: 'Zeitplan & Dringlichkeit',
    hook: 'Urgency-Aufbau',
    answers: [
      { option: 'A', score: 1, text: 'Irgendwann in den nächsten Jahren — kein fixer Plan.' },
      { option: 'B', score: 2, text: 'In 1–2 Jahren, wenn alles passt.' },
      { option: 'C', score: 3, text: 'In den nächsten 6–12 Monaten — es wird konkret.' },
      { option: 'D', score: 4, text: 'In weniger als 6 Monaten — der Countdown läuft.' },
    ],
  },
  {
    id: 4,
    question: 'Wie steht es um deine rechtliche & steuerliche Vorbereitung?',
    dimension: 'Rechtssicherheit',
    hook: 'Fehler-Angst',
    answers: [
      { option: 'A', score: 1, text: 'Ich habe keine Ahnung, was steuerlich auf mich zukommt.' },
      { option: 'B', score: 2, text: 'Ich weiß, dass es Themen gibt — habe aber noch nichts geprüft.' },
      { option: 'C', score: 3, text: 'Ich habe recherchiert, bin aber bei Details unsicher.' },
      { option: 'D', score: 4, text: 'Ich habe einen Steuerberater und einen rechtlichen Plan.' },
    ],
  },
  {
    id: 5,
    question: 'Wie ist deine finanzielle Planung für die Auswanderung?',
    dimension: 'Finanzielle Bereitschaft',
    hook: 'Kosten-Schock-Prävention',
    answers: [
      { option: 'A', score: 1, text: 'Ich habe keine Vorstellung, was Auswandern wirklich kostet.' },
      { option: 'B', score: 2, text: 'Ich schätze grob — habe aber keine Detailplanung.' },
      { option: 'C', score: 3, text: 'Ich kenne die Hauptkostenblöcke und habe begonnen zu sparen.' },
      { option: 'D', score: 4, text: 'Ich habe einen konkreten Finanzplan inkl. Puffer.' },
    ],
  },
  {
    id: 6,
    question: 'Hast du Kinder — und wie weit ist ihre Schulplanung?',
    dimension: 'Familien-Logistik',
    hook: 'Eltern-Verantwortungs-Trigger',
    answers: [
      { option: 'A', score: 1, text: 'Ich habe Kinder — das ist mein größtes Fragezeichen.' },
      { option: 'B', score: 2, text: 'Ich habe Kinder, mache mir Sorgen, habe noch nichts recherchiert.' },
      { option: 'C', score: 3, text: 'Ich habe Infos über Schulen gesammelt, aber nichts ist sicher.' },
      { option: 'D', score: 4, text: 'Schule ist konkret geplant. / Ich habe keine Kinder.' },
    ],
  },
  {
    id: 7,
    question: 'Wie steht deine Familie / dein Partner zu dem Plan?',
    dimension: 'Familieneinigkeit',
    hook: 'Beziehungs-Risiko',
    answers: [
      { option: 'A', score: 1, text: 'Mein Partner / meine Familie ist skeptisch oder nicht überzeugt.' },
      { option: 'B', score: 2, text: 'Wir diskutieren es — sind uns aber noch nicht einig.' },
      { option: 'C', score: 3, text: 'Wir sind grundsätzlich einig, haben aber noch offene Fragen.' },
      { option: 'D', score: 4, text: 'Wir ziehen alle an einem Strang mit dem gleichen Ziel.' },
    ],
  },
  {
    id: 8,
    question: 'Wie sicher bist du bei Krankenversicherung & Absicherung im Ausland?',
    dimension: 'Gesundheits-Absicherung',
    hook: 'Angst vor Notfall',
    answers: [
      { option: 'A', score: 1, text: 'Ich weiß nicht, wie ich im Ausland versichert wäre.' },
      { option: 'B', score: 2, text: 'Ich weiß, dass ich mich darum kümmern muss — noch nichts getan.' },
      { option: 'C', score: 3, text: 'Ich habe erste Optionen recherchiert, bin noch unentschlossen.' },
      { option: 'D', score: 4, text: 'Ich habe eine internationale Krankenversicherung oder einen festen Plan.' },
    ],
  },
  {
    id: 9,
    question: 'Was passiert mit deiner Firma, Immobilien oder Verträgen in Deutschland?',
    dimension: 'Setup-Komplexität',
    hook: 'Versteckte Kosten',
    answers: [
      { option: 'A', score: 1, text: 'Ich weiß nicht, was mit meinen deutschen Verpflichtungen passiert.' },
      { option: 'B', score: 2, text: 'Ich habe Verpflichtungen, weiß aber nicht genau was zu tun ist.' },
      { option: 'C', score: 3, text: 'Ich habe erste Infos — bei Details bin ich noch unsicher.' },
      { option: 'D', score: 4, text: 'Alles ist mit Experten besprochen — ich habe einen klaren Plan.' },
    ],
  },
  {
    id: 10,
    question: 'Hast du ein Netzwerk aus Menschen, die den Schritt schon gegangen sind?',
    dimension: 'Community & Support',
    hook: 'Isolation-Angst',
    answers: [
      { option: 'A', score: 1, text: 'Nein — ich fühle mich damit ziemlich allein.' },
      { option: 'B', score: 2, text: 'Ich folge Accounts online, habe aber keine persönlichen Kontakte.' },
      { option: 'C', score: 3, text: 'Ich kenne einige Leute und habe erste Kontakte geknüpft.' },
      { option: 'D', score: 4, text: 'Ich habe ein aktives Netzwerk aus Experten und Gleichgesinnten.' },
    ],
  },
]
```

### `/lib/scoring.ts` (vollständiger Inhalt)

```typescript
export type Segment = 'dreamer' | 'planer' | 'fortgeschrittener' | 'starter'
export type RiskLevel = 'green' | 'yellow' | 'red'

export interface RiskProfile {
  steuerRecht:   RiskLevel
  absicherung:   RiskLevel
  planungTiming: RiskLevel
  familieUmfeld: RiskLevel
}

export function calculateScore(answers: number[]): number {
  if (answers.length !== 10) throw new Error(`Expected 10 answers, got ${answers.length}`)
  return answers.reduce((sum, score) => sum + score, 0)
}

export function getSegment(score: number): Segment {
  if (score < 10 || score > 40) throw new Error(`Score ${score} out of range`)
  if (score <= 18) return 'dreamer'
  if (score <= 27) return 'planer'
  if (score <= 35) return 'fortgeschrittener'
  return 'starter'
}

export function getRiskProfile(answers: number[]): RiskProfile {
  const q = (n: number) => answers[n - 1]
  return {
    steuerRecht:   toRisk(q(4), q(9)),
    absicherung:   toRisk(q(8)),
    planungTiming: toRisk(q(3), q(5)),
    familieUmfeld: toRisk(q(6), q(7), q(10)),
  }
}

function toRisk(...scores: number[]): RiskLevel {
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length
  if (avg <= 1.5) return 'red'
  if (avg <= 2.5) return 'yellow'
  return 'green'
}
```

---

## 6. LANDINGPAGE — SEKTIONEN & COPY

### Reihenfolge der Sektionen

1. Header / Nav
2. Hero (zweispaltig)
3. Problem
4. Route-Divider (SVG)
5. Was du erhältst
6. Was es leistet
7. Für wen
8. So funktioniert es
9. Vertrauen + FAQ
10. Final CTA
11. Footer

---

### 6.1 Header / Nav

```
Logo links: [CompassGlyph 32px] + Schriftzug "Auswander-Kompass" (Serif, 19px)
           Darunter: "Orientierung · Reihenfolge · Klarheit" (Uppercase, 11px, muted)
Rechts: "N · Norden" | [24px horizontal line] | "Kurs setzen" (uppercase, 12px, muted)
Border-bottom: 1px solid line
Padding: 24px 64px
```

---

### 6.2 Hero

**Links-Spalte (1.3fr):**

Eyebrow-Pill: `● Kurs setzen · in 3 Minuten` (Kupfer-Punkt, highlight bg)

Headline:
```
Beim Auswandern entscheidet die
[italic, fir-color]Reihenfolge[/italic]
— und Fehler können teuer werden.
```
*("Reihenfolge" bekommt handgezeichnete Kupfer-Unterstreichung als SVG-Path)*

Lead-Text 1:
> Der Auswander-Kompass zeigt dir auf Basis deiner Situation, welche Schritte du zuerst erledigen musst — und wo kritische Risiken entstehen.

Lead-Text 2 (muted):
> In 3–4 Minuten erhältst du eine persönliche Einschätzung mit klar priorisierten nächsten Schritten.

CTA-Bereich:
```
[PrimaryCTA: "Einschätzung starten"] + "Dauer: ca. 3 Minuten · keine E-Mail erforderlich"
```

**Rechts-Spalte (1fr):** `HeroCompass` SVG (aus `variant-cartographic.jsx` 1:1 übernehmen)

**Stat-Strip darunter (4 Spalten, paperAlt-Background):**
```
| 10        | ~3 min | 0 €    | anonym       |
| Fragen    | Zeit   | Kosten | keine E-Mail |
```

---

### 6.3 Problem

Section-Marker: `02 — Problem`

**Headline:**
> Die meisten Auswanderungen scheitern nicht am Wissen — sondern an der falschen Reihenfolge.

**Body:**
> Die meisten Familien haben bereits recherchiert. Checklisten gelesen. Videos gesehen. Und stehen trotzdem an genau derselben Stelle: sie wissen nicht, womit sie anfangen sollen.
>
> Was oft fehlt, ist nicht Information — sondern Struktur. Genau hier entstehen die meisten Fehler: nicht aus Unwissen, sondern durch falsche Priorisierung.

**Rechts: 3 Karten (gestapelt)**
```
[DUNKELGRÜN] prio 1 | "Was muss zuerst geklärt werden?"
[PAPERALT]   frist  | "Was ist zeitkritisch?"
[PAPERALT]   später | "Was kann warten, ohne Risiko zu erzeugen?"
```

---

### 6.4 Was du erhältst

Section-Marker: `03 — Was du erhältst`

Background: `paperAlt`

**Headline:**
> Eine Einschätzung, die zu deiner Situation passt.

**Lead:**
> Nach wenigen Minuten weißt du ganz konkret:

**2×2 Grid (4 Karten):**
```
[N] kritisch  | "welche Themen bei dir aktuell kritisch sind"
[O] zuerst    | "womit du konkret beginnen solltest"
[S] später    | "welche Schritte noch Zeit haben"
[W] risiko    | "wo typische Fehler entstehen können"
```
*(Badge: Himmelsrichtung in Serif-Kreis, Tag in Kupfer, Text in Serif-Kursiv)*

**Grundlage-Box (gepunktet):**
```
"Grundlage der Einschätzung"
[Zielland] [Zeitplan] [Familiensituation] [Berufliche Situation]
```

---

### 6.5 Was es leistet

Section-Marker: `04 — Was es leistet`

**Headline:**
> Drei häufige Fehler — und wie der Kompass sie sichtbar macht.

**3-Spalten-Karten:**

```
[Fehler 01]
Icon: ⚠
"Steuerliche Fristen verpasst"
Viele Auswanderer erfahren erst nach dem Wegzug von Meldepflichten oder Steuerkonsequenzen.
Der Kompass zeigt dir, welche davon für dich relevant sind.

[Fehler 02]
Icon: ↻
"Schritte in falscher Reihenfolge"
Wer zuerst kündigt und dann die Formalitäten prüft, macht teure Fehler.
Der Kompass priorisiert deine Schritte.

[Fehler 03]
Icon: ○
"Versicherungslücken entstehen unbemerkt"
Zwischen GKV-Abmeldung und neuer Absicherung entsteht oft eine kritische Lücke.
Der Kompass macht sie sichtbar.
```

**Banner-Box (dunkelgrün, full-width):**
```
[CompassGlyph] "Nicht was zu tun ist — sondern in welcher Reihenfolge und bis wann."
```

---

### 6.6 Für wen

Section-Marker: `05 — Für wen`

Background: `paperAlt`

**4 Zeilen-Karten:**

```
[01] Familien mit Kindern
     Schulwechsel, Kita-Suche und die Sorgerechts-Absicherung bei Auslandsumzug
     sind eigene Themenstränge.

[02] Selbstständige & Freelancer
     Wer keine GmbH hat, aber als Freiberufler tätig ist, hat eigene steuerliche
     Fristen und Abmelderegeln.

[03] Unternehmer mit GmbH oder Anteilen
     Wegzugsbesteuerung, Haltefristen und die internationale Unternehmensstruktur
     sind komplex — und zeitkritisch.

[04] Angestellte im Wechsel
     Wer mit einem Jobangebot ins Ausland wechselt, hat andere Fristen als
     jemand, der remote arbeitet oder kündigt.
```

**Schlusssatz (kursiv, zentriert):**
> Wenn dir einer dieser Punkte bekannt vorkommt, bist du hier richtig.

---

### 6.7 So funktioniert es

Section-Marker: `06 — So funktioniert es`

**Headline:**
> Drei Etappen — und dein Weg wird klarer.

**3-Schritt-Route (gestrichelter SVG-Pfad als Verbindung):**

```
[01] 10 Fragen
     Du beantwortest 10 kurze Fragen zu deiner Situation.

[02] Risiken sichtbar
     Du siehst sofort, wo Risiken entstehen können.

[03] Deine Reihenfolge
     Du erhältst deine nächsten Schritte in sinnvoller Reihenfolge.
```

*(Jede Karte: 52px Kreis-Badge mit fir-Border, Eyebrow "Schritt 01/02/03" in Kupfer)*

---

### 6.8 Vertrauen + FAQ

Section-Marker: `07 — Vertrauen`

Background: `paperAlt` | Zweispaltig (1fr / 1.2fr)

**Links:**
> Basiert auf realen Abläufen — nicht auf allgemeinen Checklisten.
>
> Der Auswander-Kompass basiert auf realen Abläufen aus Auswanderungsprozessen. Er hilft dir, Struktur in ein komplexes Thema zu bringen und typische Fehler zu vermeiden.
>
> *(Muted)* Er ersetzt jedoch keine rechtliche oder steuerliche Beratung.

**Rechts — FAQ-Accordion (4 Items, erstes initial offen):**

```
Q: Wie lange dauert die Einschätzung wirklich?
A: Die meisten Nutzer beantworten die 10 Fragen in 3 bis 4 Minuten. Du kannst jede Frage auslassen und später ergänzen.

Q: Muss ich eine E-Mail-Adresse angeben?
A: Nein. Die Einschätzung läuft vollständig anonym. Wenn du das Ergebnis speichern möchtest, kannst du es am Ende als PDF herunterladen — ohne Registrierung.

Q: Ersetzt das eine Beratung?
A: Nein. Die Einschätzung ordnet deine Situation strukturell ein und zeigt, wo Priorität liegt. Rechtliche, steuerliche oder behördliche Beratung bleibt individuell.

Q: Für welche Zielländer funktioniert der Kompass?
A: Der Kompass ist länderunabhängig aufgebaut. Die Fragen berücksichtigen die spezifischen Fristen und Abläufe typischer Zielländer im europäischen Raum, Nordamerika und weiteren Regionen.
```

---

### 6.9 Final CTA

Background: `fir` (Tannengrün)
Kompass-Watermark rechts (opacity 0.12, Kupfer)

**Eyebrow (Kupfer):** `08 — Jetzt Kurs setzen`

**Headline:**
> Die Entscheidung ist bereits gefallen.
> Die Frage ist jetzt die Reihenfolge.

**Kursive Frage (Kupfer, Serif):**
> Womit beginnst du — und was darf nicht warten?

**Body:**
> Genau das klärt der Auswander-Kompass für dich.

**CTA-Button (Kupfer-Background, fir-Text):** `Einschätzung starten →`
**Sub-Text (Kupfer, muted):** `Dauer: ca. 3 Minuten · keine E-Mail erforderlich`

---

### 6.10 Footer

```
Links: [CompassGlyph 20px] "Auswander-Kompass"
Rechts: "Keine Werbung · keine Verpflichtung · nur eine erste,
         strukturierte Einordnung deiner Situation."
Border-top: 1px solid line
```

---

## 7. QUIZ-SEITEN (`/check/[step]`)

### Verhalten

- 1 Frage pro URL-Schritt (`/check/1` bis `/check/10`)
- Progress-Strip: 10 Pills, aktiver Schritt in `fir`, abgeschlossen in `fir` (50% opacity), ausstehend in `line`
- Antworten: klickbare Karten (kein Radio-Button), hover: `paperAlt` bg + `fir` border
- Ausgewählte Karte: `fir` bg, `primaryInk` Text, volle Border
- Navigation: `← Zurück` + `Weiter →` (Weiter nur aktiv wenn Antwort gewählt)
- State: `sessionStorage` für Antworten (kein Server-State vor E-Mail-Eingabe)
- Nach Frage 10: direkt → `/check/ergebnis`

### Seiten-Layout

```
[CompassGlyph 28px] + "Auswander-Kompass" (Nav)
---
[Progress-Strip: 10 Pills]
---
[Eyebrow: Frage X von 10 · Dimension-Label]
[Question-Text: Fraunces, 32px]
---
[4 Antwort-Karten: 2×2 Grid auf Desktop, 1 Spalte Mobile]
---
[← Zurück]   [Weiter →]
```

---

## 8. ERGEBNIS-SEITE (`/check/ergebnis`)

Die Ergebnisseite ist in drei Zonen gegliedert.

### Zone A — Diagnose (kostenlos, vollständig sichtbar)

**Score-Anzeige:**
```
[Segment-Name: Fraunces, 52px, fir]
[Score: "Du hast X von 40 Punkten"]
[Segment-Beschreibung: Eröffnungstext aus MVP.md]
```

**Risiko-Kompass-Profil (visuell):**
4 Kategorien mit Ampel-Farben (Rot/Gelb/Grün):

| Kategorie | Label | Farbe |
|-----------|-------|-------|
| Steuern & Recht | Fragen 4+9 | red/yellow/green |
| Absicherung | Frage 8 | red/yellow/green |
| Planung & Timing | Fragen 3+5 | red/yellow/green |
| Familie & Umfeld | Fragen 6+7+10 | red/yellow/green |

**Implementierung `getRiskProfile()`:** aus `/lib/scoring.ts` — bereits definiert.

**Ampel-Labels:**
- 🔴 `red` → "Kritisch — unmittelbarer Handlungsbedarf"
- 🟡 `yellow` → "Prüfen — Lücke vorhanden, noch kein Notfall"
- 🟢 `green` → "Solide — weiter beobachten"

**Erster sichtbarer Risikopunkt:** Kategorie mit niedrigstem Score wird vollständig angezeigt.

---

### Zone B — Locked (sichtbar, Inhalt verborgen)

```
"Wir haben [X] weitere kritische Punkte in deiner Situation identifiziert."
```

2 weitere Risikokarten: Titel lesbar, Inhalt mit `backdrop-blur-sm` + `opacity-40` überlagert + Lock-Icon.

**Zeitbasierte Warnung** (wenn Frage 3 Score ≥ 3):
> *"Du planst deinen Wegzug in den nächsten 6–12 Monaten. Punkt [Kategorie] muss vor deinem Wegzug geklärt sein."*

---

### Zone C — Paywall / CTA

Segment-spezifische CTA-Headline (aus MVP.md Section 5).

**3 Bullet Points "Was du erhältst":**
```
✓ Vollständige Risiko-Karte — alle 4 Kategorien aufgedeckt
✓ Priorisierter Fahrplan: Was zuerst, was kann warten, was hat Fristen
✓ PDF-Download mit deinem persönlichen Profil
```

**Preis:** `27 €` (einmalig, groß dargestellt)

**CTA-Button** (segment-spezifisch, aus MVP.md):
- dreamer → "Auswander-Kompass freischalten — 27 €"
- planer → "Jetzt Lücken schließen — 27 €"
- fortgeschrittener → "Plan vervollständigen — 27 €"
- starter → "Startfahrplan freischalten — 27 €"

**Vertrauens-Element:**
> Sofortiger Zugang nach Zahlung · keine Mitgliedschaft · keine Abo-Falle

---

## 9. STRIPE-INTEGRATION

### `/api/create-checkout/route.ts`

```typescript
// POST: Erwartet { segment, answers } im Body
// Erstellt Stripe Checkout Session

const session = await stripe.checkout.sessions.create({
  mode: 'payment',
  line_items: [{
    price_data: {
      currency: 'eur',
      unit_amount: 2700, // 27 €
      product_data: {
        name: 'Auswander-Kompass — Persönlicher Fahrplan',
        description: `Segment: ${segmentNames[segment]}`,
      },
    },
    quantity: 1,
  }],
  success_url: `${origin}/danke?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${origin}/check/ergebnis`,
  metadata: {
    segment,
    score: totalScore.toString(),
    answers: JSON.stringify(answers),
  },
})

return NextResponse.json({ url: session.url })
```

### `/api/webhook/route.ts`

Verarbeitet `checkout.session.completed`:
1. Liest `metadata.answers` + `metadata.segment`
2. Generiert PDF via `/lib/pdf/Report.tsx`
3. Sendet E-Mail via Resend
4. Optional: Speichert Session in Supabase/KV

---

## 10. PDF-BERICHT

### Inhalt pro Segment

Der PDF-Bericht enthält (in dieser Reihenfolge):

1. **Header:** Logo + "Dein persönlicher Auswander-Fahrplan"
2. **Segment:** Name + Score
3. **Risiko-Profil:** Alle 4 Kategorien mit Ampel-Status
4. **Eröffnungstext** (aus MVP.md, segment-spezifisch)
5. **3 Kernlücken** (aus MVP.md, segment-spezifisch)
6. **Empfehlungen** (aus MVP.md Section 9)
7. **Footer:** "Dieser Bericht ersetzt keine rechtliche oder steuerliche Beratung."

### Design

```
Hintergrund: #F3EDE2 (paper)
Primärfarbe: #1E3A34 (fir)
Akzent: #C4926B (copper)
Schrift: Fraunces (Serif) für Headlines, Inter Tight für Body
```

---

## 11. E-MAIL-VERSAND

### Konfiguration

```
Provider: Resend (resend.com)
Region: EU
Absender: bericht@auswanderkompass.de
Reply-To: kontakt@auswanderkompass.de
Betreff: "Dein persönlicher Auswander-Fahrplan ist da"
```

### E-Mail-Inhalte (segment-spezifisch)

| Segment | Eröffnungssatz |
|---------|----------------|
| dreamer | "Du hast den ersten Schritt gemacht. Jetzt wird es konkret." |
| planer | "Hier sind die Punkte, die du jetzt angehen musst." |
| fortgeschrittener | "Du bist nah dran. Das hier bringt dich über die Ziellinie." |
| starter | "Alles auf einen Blick — was jetzt, was als nächstes." |

**Anhang:** PDF-Bericht (generiert in `/api/webhook/route.ts`)

---

## 12. DANKE-SEITE (`/danke`)

```
Headline: "Dein Bericht ist unterwegs."
Body: "Schau in deinen Posteingang — die E-Mail ist auf dem Weg.
       Manchmal landet sie kurz im Spam-Ordner."

Nächste Schritte:
1. E-Mail-Postfach prüfen (auch Spam-Ordner)
2. Bericht in Ruhe lesen
3. Bei Fragen: kontakt@auswanderkompass.de

[Sekundärer CTA: "Zurück zur Startseite"]
```

---

## 13. DATENSCHUTZ / DSGVO

### Implementierungsregeln

1. **Kein Tracking-Consent nötig:** Plausible ist cookielos
2. **Quiz-Antworten anonym:** `sessionStorage` bis zur freiwilligen E-Mail-Eingabe im Checkout
3. **Server-Speicherung** erst nach Stripe-Webhook (Einwilligung via Kaufabschluss)
4. **Datenlöschung:** Nach E-Mail-Versand werden Antworten nicht dauerhaft gespeichert (oder pseudonymisiert max. 90 Tage)
5. **EU-Server:** Vercel Region `fra1` (Frankfurt)
6. **AV-Verträge abschließen** mit: Vercel, Resend, Stripe, ggf. Supabase

### `/datenschutz` — Muss enthalten

- Verantwortlicher (Impressum-Daten)
- Server-Standort: Vercel, Frankfurt (fra1)
- E-Mail-Provider: Resend
- Analytics: Plausible (cookielos, kein Consent nötig)
- Cookies: Nur Session-Cookie für Quiz-Fortschritt
- Zahlungsverarbeitung: Stripe
- Auskunfts- und Löschungsrechte
- Kontakt für DSGVO-Anfragen

---

## 14. TECHNISCHE AKZEPTANZKRITERIEN

| Kriterium | Zielwert |
|-----------|---------|
| Lighthouse Performance (Mobile) | ≥ 95 |
| Lighthouse Accessibility | 100 |
| Lighthouse SEO | 100 |
| Funktioniert ohne JavaScript | Ja (Hero + Inhalt SSR) |
| Responsive: 375px / 768px / 1280px+ | Vollständig |
| Tastatur-Navigation | Vollständig + sichtbare Focus-States (`fir` outline, 2px offset) |
| Reduced-motion | Respektiert |
| Open-Graph Meta | 1200×630, Tannengrün-BG, Kompass, Headline |
| Favicon + Apple-Touch-Icon | Aus Brandguide |
| Sitemap.xml + robots.txt | Ja |
| DSGVO-konform | Ja (siehe Section 13) |
| PDF-Bericht | Brand-konform, A4, strukturiert nach Kategorien |
| E-Mail-Zustellung | DKIM verified |

---

## 15. ENVIRONMENT-VARIABLEN

```bash
# .env.local

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Resend
RESEND_API_KEY=re_...

# Supabase (optional)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Vercel KV (alternative zu Supabase)
KV_URL=redis://...
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...

# App
NEXT_PUBLIC_BASE_URL=https://auswanderkompass.de
```

---

## 16. PHASENPLAN FÜR AUTONOMEN BUILD

### Phase 1 — Foundation

**Aufgaben:**
- Next.js 14 App Router Setup mit TypeScript
- Tailwind-Konfiguration mit allen Design-Tokens (Section 3)
- Font-Einbindung: Fraunces + Inter Tight via `next/font/google`
- `app/layout.tsx` mit Body-Styles + Map-Texture
- `.env.local` Struktur anlegen und dokumentieren
- Alle `/lib/*.ts` Dateien anlegen: `questions.ts`, `scoring.ts`, `segments.ts`

**Validierung:** `npm run build` ohne Fehler, Fonts laden korrekt, Tailwind-Tokens verfügbar

---

### Phase 2 — Brand-Komponenten

**Aufgaben:**
- `CompassGlyph.tsx` — 1:1 aus `shared.jsx` in TypeScript übersetzen
- `HeroCompass.tsx` — 1:1 aus `variant-cartographic.jsx` in TypeScript übersetzen
- `SectionMarker.tsx` — aus `variant-cartographic.jsx`
- `RouteDivider.tsx` — aus `shared.jsx`
- `PrimaryCTA.tsx` — aus `shared.jsx`
- `FAQItem.tsx` — Accordion mit shadcn/ui

**Validierung:** Alle Komponenten rendern in Storybook oder separater Test-Seite korrekt

---

### Phase 3 — Landingpage

**Aufgaben:**
- `app/page.tsx` aufbauen — alle 11 Sektionen in korrekter Reihenfolge
- Jede Sektion als eigene Komponente in `/components/landing/`
- Exakter Copy aus Section 6 dieses Dokuments
- Responsive: Mobile-Breakpoints aus Section 3
- CTA-Button verlinkt auf `/check`

**Validierung:** Visuell pixelgenau zu `variant-cartographic.jsx`, Lighthouse Performance ≥ 95

---

### Phase 4 — Quiz-Flow

**Aufgaben:**
- `app/check/[step]/page.tsx` — dynamische Route
- `QuestionStep.tsx` — Layout mit Progress-Strip + Antwort-Karten
- State via `sessionStorage` (kein Server-State)
- Navigation: Zurück/Weiter, Weiter nur bei gewählter Antwort
- Nach Schritt 10: Redirect zu `/check/ergebnis`

**Validierung:** Alle 10 Fragen korrekt angezeigt, State persistiert bei Zurück-Navigation

---

### Phase 5 — Ergebnis & Paywall

**Aufgaben:**
- `app/check/ergebnis/page.tsx` — liest Antworten aus `sessionStorage`
- `calculateScore()` + `getSegment()` + `getRiskProfile()` aufrufen
- Zone A: Score, Segment-Name, Risiko-Kompass-Profil, erster Risikopunkt
- Zone B: 2 gesperrte Karten mit Blur + Lock
- Zone C: Segment-spezifischer CTA → POST `/api/create-checkout`
- Zeitbasierte Warnung wenn Frage 3 Score ≥ 3

**Validierung:** Alle 4 Segmente korrekt dargestellt, Paywall-Logik funktioniert

---

### Phase 6 — Stripe + E-Mail + PDF

**Aufgaben:**
- `/api/create-checkout/route.ts` — Stripe Session erstellen
- `/api/webhook/route.ts` — Webhook verarbeiten
- `/lib/pdf/Report.tsx` — PDF mit @react-pdf/renderer
- `/lib/email/template.tsx` — HTML-E-Mail
- `/api/report/route.ts` — PDF generieren + Resend senden
- `app/danke/page.tsx`

**Validierung:** Vollständiger End-to-End-Test: Quiz → Checkout → Webhook → E-Mail kommt an

---

### Phase 7 — SEO + DSGVO + Launch-Check

**Aufgaben:**
- OG-Image (1200×630) generieren
- Favicon + Apple-Touch-Icon
- `sitemap.xml` + `robots.txt`
- `/datenschutz` + `/impressum` Seiten
- Alle Lighthouse-Werte prüfen und auf Zielwerte bringen
- DKIM für `auswanderkompass.de` in Resend verifizieren
- DNS-Records dokumentieren

---

## 17. UNIT-TEST-REFERENZ

```typescript
// __tests__/scoring.test.ts

describe('Scoring — Grenzwerte', () => {
  it('Score 18 → dreamer', () => expect(getSegment(18)).toBe('dreamer'))
  it('Score 19 → planer',  () => expect(getSegment(19)).toBe('planer'))
  it('Score 27 → planer',  () => expect(getSegment(27)).toBe('planer'))
  it('Score 28 → fortgeschrittener', () => expect(getSegment(28)).toBe('fortgeschrittener'))
  it('Score 35 → fortgeschrittener', () => expect(getSegment(35)).toBe('fortgeschrittener'))
  it('Score 36 → starter', () => expect(getSegment(36)).toBe('starter'))
  it('Score 40 → starter', () => expect(getSegment(40)).toBe('starter'))

  it('alle A = 10 Punkte', () =>
    expect(calculateScore([1,1,1,1,1,1,1,1,1,1])).toBe(10))
  it('alle D = 40 Punkte', () =>
    expect(calculateScore([4,4,4,4,4,4,4,4,4,4])).toBe(40))
})

describe('Risiko-Ampel', () => {
  it('alle 1er → alles Rot', () => {
    const profile = getRiskProfile([1,1,1,1,1,1,1,1,1,1])
    expect(profile.steuerRecht).toBe('red')
    expect(profile.absicherung).toBe('red')
  })
  it('alle 4er → alles Grün', () => {
    const profile = getRiskProfile([4,4,4,4,4,4,4,4,4,4])
    expect(profile.steuerRecht).toBe('green')
  })
})
```

---

## 18. WAS DU NOCH LIEFERN MUSST (vor Deployment)

| Element | Status | Hinweis |
|---------|--------|---------|
| Resend API-Key | ⬜ ausstehend | account.resend.com |
| Stripe API-Keys (live) | ⬜ ausstehend | dashboard.stripe.com |
| Vercel-Projekt Zugang | ⬜ ausstehend | vercel.com |
| DNS-Zugang auswanderkompass.de | ⬜ ausstehend | Für DKIM + Deployment |
| Datenschutz-Text (rechtlich geprüft) | ⬜ ausstehend | §13 DSGVO |
| Impressum-Text | ⬜ ausstehend | §5 TMG |
| Favicon-Datei | ⬜ ausstehend | Aus Brandguide |

---

*Ende des Dokuments · CLAUDE_CODE_AUSWANDERKOMPASS_BUILD.md · Version 1.0*
