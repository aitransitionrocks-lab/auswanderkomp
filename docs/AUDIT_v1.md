# Auswander-Kompass — Build-Audit v1
**Stand:** Mai 2026
**Branch:** `main` · Commit `6179d3a`
**Repository:** github.com/aitransitionrocks-lab/auswanderkomp
**Zweck dieses Dokuments:** Vollständige Bestandsaufnahme des aktuellen Builds zur unabhängigen technischen Prüfung durch eine weitere Claude-Instanz. Selbst-enthalten — keine Referenzen auf Chat-Verlauf nötig.

---

## 0. Executive Summary

**Produkt:** Validation Build für ein digitales Quiz-Produkt zur Auswanderungs-Orientierung. Nutzer beantworten 10 Fragen, erhalten kostenlos eine grobe Einschätzung (Segment + Risiko-Ampel + 1 sichtbarer Risikopunkt), zahlen 27 € einmalig für vollständigen Bericht (PDF per Mail) mit priorisiertem Fahrplan.

**Validierungsfrage:** Zahlen DACH-Auswanderwillige 27 € einmalig für einen strukturierten Fahrplan?

**Status:**
- Codebase fertig (3.414 LOC TS/TSX)
- Build grün, Lint clean
- 8/8 interne Logik-Tests bestanden
- Auf Vercel deployed unter `auswanderkompass-…vercel.app`
- Custom-Domain `auswanderkompass.de` DNS noch nicht final
- Stripe-Keys, Resend-Sender und Legal-Pages-Inhalte fehlen für Live-Betrieb

**Stack:**
- Next.js 14.2.35 App Router · TypeScript · Tailwind CSS
- Stripe (Checkout, mode `payment`, 27 € einmalig)
- Resend (E-Mail mit PDF-Anhang)
- @react-pdf/renderer (PDF-Generation server-side)
- PostHog (Tracking — bewusst statt Plausible aus Spec)
- Vercel (Hosting · Region `fra1`)

**Bewusst nicht implementiert** (gegen Spec):
- shadcn/ui · react-hook-form · zod (native React + Tailwind reicht für Validation-MVP)
- Supabase / Vercel KV (Stateless: Antworten via sessionStorage → Stripe metadata → Webhook)
- Plausible (User wünschte PostHog)

---

## 1. Stack & Versions

### Dependencies (`package.json`)
```json
{
  "dependencies": {
    "@react-pdf/renderer": "^4.4.0",
    "@stripe/stripe-js": "^9.3.1",
    "next": "14.2.35",
    "posthog-js": "^1.371.2",
    "react": "^18",
    "react-dom": "^18",
    "resend": "^6.12.2",
    "stripe": "^22.1.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "eslint": "^8",
    "eslint-config-next": "14.2.35",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
}
```

**Anmerkungen:**
- `resend` ist nur als Hilfs-SDK installiert — aktueller Code nutzt direkten `fetch()` an `api.resend.com/emails` (siehe `src/app/api/webhook/route.ts`). Das `resend` Package wird aktuell nicht importiert. → Kandidat für Entfernung oder Refactor.
- `@stripe/stripe-js` wird ebenfalls aktuell nicht importiert (Checkout läuft via Hosted-Stripe-Redirect, kein Stripe.js im Client). → Kandidat für Entfernung.

### Tailwind-Tokens (`tailwind.config.ts`)
```ts
colors: {
  paper: "#F3EDE2", paperAlt: "#EBE3D3", highlight: "#E8DCC2",
  ink: "#1F2A24", inkSoft: "#44504A", muted: "#7A7164", line: "#D8CDB8",
  fir: { DEFAULT: "#1E3A34", deep: "#162A25" },
  copper: { DEFAULT: "#C4926B", deep: "#A67353" },
  riskGreen: "#5C8B62", riskYellow: "#C4926B", riskRed: "#A33B2A",
}
fontFamily: {
  serif: ["var(--ak-serif)", "Georgia", "serif"],
  sans: ["var(--ak-sans)", "system-ui", "sans-serif"],
}
```

### TypeScript-Config
- `strict: true` aktiv
- `moduleResolution: bundler`
- `target: ES2017`
- Paths: `@/*` → `./src/*`

---

## 2. Vollständiger File-Tree

```
auswander-kompass/
├── .env.local              (gitignored — Secrets)
├── .eslintrc.json          ({ extends: 'next/core-web-vitals' })
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
├── next.config.mjs         (leer — keine Custom-Config)
├── postcss.config.mjs      (nur tailwindcss-Plugin)
├── tailwind.config.ts
├── vercel.json             (Region fra1 + maxDuration 30s für /api/webhook + /api/report)
│
├── docs/
│   ├── CLAUDE_CODE_AUSWANDERKOMPASS_BUILD.md    (Spec v1.0)
│   ├── MVP.md                                    (Quiz + Scoring + Segmente v2.0)
│   ├── shared.jsx                                (Brand-Primitives Referenz)
│   ├── variant-cartographic.jsx                  (Visuelle Referenz für Landingpage)
│   └── AUDIT_v1.md                               (DIESES DOKUMENT)
│
└── src/
    ├── app/
    │   ├── globals.css                           (Tailwind + Map-Texture body::before)
    │   ├── layout.tsx                            (Fonts + PostHog + Metadata)
    │   ├── not-found.tsx                         (404)
    │   ├── robots.ts                             (Disallow /check + /api + /danke)
    │   ├── sitemap.ts                            ( /, /impressum, /datenschutz )
    │   ├── page.tsx                              (Landing — 11 Sektionen)
    │   │
    │   ├── check/
    │   │   ├── page.tsx                          (Redirect → /check/1)
    │   │   ├── [step]/page.tsx                   (Dyn. Quiz-Frame, lädt QuestionStep)
    │   │   └── ergebnis/page.tsx                 (Client Component — sessionStorage-basiert)
    │   │
    │   ├── danke/page.tsx
    │   ├── impressum/page.tsx                    (Platzhalter!)
    │   ├── datenschutz/page.tsx                  (Platzhalter!)
    │   │
    │   └── api/
    │       ├── create-checkout/route.ts          (POST → Stripe Session 27€)
    │       ├── webhook/route.ts                  (POST Stripe → PDF + Resend)
    │       └── qa/scoring/route.ts               (GET → 8 Logik-Tests)
    │
    ├── components/
    │   ├── brand/
    │   │   ├── Arrow.tsx
    │   │   ├── CompassGlyph.tsx
    │   │   ├── HeroCompass.tsx                   (Inline-SVG, hardcodierte Hex-Farben!)
    │   │   ├── PrimaryCTA.tsx                    (filled · ghost · accent · md|lg)
    │   │   ├── RouteDivider.tsx
    │   │   └── SectionMarker.tsx
    │   │
    │   ├── check/
    │   │   ├── Progress.tsx                      (10 Pills)
    │   │   └── QuestionStep.tsx                  (Client — Frage + Antwort-Karten + Nav)
    │   │
    │   ├── ergebnis/
    │   │   ├── LockedCard.tsx                    (Blur + Lock-Icon)
    │   │   ├── PaywallCTA.tsx                    (Client — E-Mail-Form + Checkout-Call)
    │   │   └── RiskCompass.tsx                   (4-Kacheln Ampel)
    │   │
    │   ├── shared/
    │   │   └── PostHogInit.tsx                   (Client — lazy init via useEffect)
    │   │
    │   └── ui/
    │       └── FAQItem.tsx                       (Accordion)
    │
    ├── data/
    │   └── tasks.json                            (9 Länder × ~15 Tasks aus altem Build)
    │
    └── lib/
        ├── answers.ts                            (sessionStorage Wrapper)
        ├── env.ts                                (Hilfsfunktionen für Config-Checks)
        ├── questions.ts                          (10 Quiz-Fragen + Types)
        ├── scoring.ts                            (calculateScore, getSegment, getRiskProfile)
        ├── segments.ts                           (Segment-Texte für 4 Segmente)
        ├── track.ts                              (PostHog event capture wrapper)
        │
        ├── email/
        │   └── template.ts                       (HTML-Template für Resend)
        │
        └── pdf/
            ├── ResultPDF.tsx                     (2-seitiges PDF via @react-pdf/renderer)
            └── tasks-priority.ts                 (Task-Aggregation aus 9 Ländern)
```

**LOC-Summe:** 3.414 Zeilen TS/TSX in `src/`.

---

## 3. Routen-Übersicht

| Pfad | Typ | Render | Zweck |
|---|---|---|---|
| `/` | static | RSC | Landingpage 11 Sektionen |
| `/check` | static | RSC redirect | → `/check/1` |
| `/check/[step]` | dynamic | client | Quiz Frage 1–10, sessionStorage |
| `/check/ergebnis` | client-only | CSR | Liest sessionStorage, berechnet Score+Segment+Risk, rendert Zone A/B/C |
| `/danke` | static | RSC | Post-Payment-Bestätigung |
| `/impressum` | static | RSC | Legal, mit `[Platzhalter]` |
| `/datenschutz` | static | RSC | Legal, mit `[Platzhalter]` |
| `/not-found` | static | RSC | 404 |
| `/robots.txt` | generated | metadata-route | Erlaubt `/`, sperrt `/check*`, `/danke`, `/api/` |
| `/sitemap.xml` | generated | metadata-route | 3 Einträge (`/`, `/impressum`, `/datenschutz`) |
| `/api/create-checkout` | API | POST | Erzeugt Stripe Checkout Session, gibt URL zurück |
| `/api/webhook` | API | POST | Empfängt Stripe Events, generiert PDF, schickt Mail |
| `/api/qa/scoring` | API | GET | 8 Logik-Tests, gibt JSON-Report |

**Build-Output (Production):**
```
┌ ○ /                                    601 B    96.6 kB
├ ○ /_not-found                          142 B    87.4 kB
├ ƒ /api/create-checkout                 0 B      0 B
├ ƒ /api/qa/scoring                      0 B      0 B
├ ƒ /api/webhook                         0 B      0 B
├ ○ /check                               142 B    87.4 kB
├ ƒ /check/[step]                        3.94 kB  161 kB
├ ○ /check/ergebnis                      6.42 kB  163 kB
├ ○ /danke                               184 B    96.1 kB
├ ○ /datenschutz                         184 B    96.1 kB
├ ○ /impressum                           184 B    96.1 kB
├ ○ /robots.txt                          0 B      0 B
└ ○ /sitemap.xml                         0 B      0 B
+ First Load JS shared by all            87.3 kB
```

---

## 4. End-to-End User-Journey

### 4.1 Pfad „Happy Path" (Cold Visit → Kauf → Bericht)

```
1. Visitor öffnet  /
   → Landing rendert (RSC)
   → PostHog-Event: lp_view (autocapture via PostHogInit + capture_pageview: true)
   → CTA-Buttons verweisen auf /check

2. Klick auf "Einschätzung starten"
   → Browser navigiert zu /check
   → Server-Redirect 307 → /check/1
   → Client-Komponente QuestionStep mountet
   → useEffect: track('diagnose_start') falls erste Frage + leerer Storage

3. Frage 1–10 (je eigene URL /check/N)
   → User wählt Karte (1–4 Punkte)
   → State: useState<number|null>(selected)
   → Klick auf "Weiter" → saveAnswers() in sessionStorage
   → track('q_answered', {q_num, score})
   → router.push(`/check/N+1`)
   → Frage 10 → router.push('/check/ergebnis')

4. /check/ergebnis
   → useEffect: loadAnswers()
   → calculateScore() · getSegment() · getRiskProfile()
   → Tracking: diagnose_complete, result_view, paywall_view
   → Rendert Zone A (Segment-Header + Opening + RiskCompass + Bridge + erster Risikopunkt)
   → Zone B (2 LockedCards mit Blur)
   → Zone C (PaywallCTA mit E-Mail-Input + Button)

5. User gibt E-Mail ein + klickt CTA
   → track('checkout_start')
   → POST /api/create-checkout mit { segment, answers, score, email }
   → Server erstellt Stripe Checkout Session (mode='payment', 2700 cents)
   → metadata: { segment, score, answers: JSON.stringify(answers) }
   → success_url: /danke?session_id={CHECKOUT_SESSION_ID}
   → cancel_url:  /check/ergebnis
   → Antwort { url } → window.location.href = url

6. User bezahlt auf Stripe-Hosted-Checkout
   → 27 € via Card
   → Stripe sendet `checkout.session.completed` Event an /api/webhook
   → Stripe redirect zu /danke

7. /api/webhook
   → Verifiziert Signatur (constructEvent)
   → Parsed metadata.segment, .score, .answers
   → calculateScore + getSegment erneut (defensive Re-Validation)
   → renderToBuffer(ResultPDF(...))
   → POST an api.resend.com/emails mit PDF-Anhang
   → console.error bei Resend-Fehler, kein Retry

8. /danke wird gerendert (statisch)
   → Hinweistext "Mail ist unterwegs"
   → Keine Stripe-Session-Validation hier (nur die Hinweis-Seite)
```

### 4.2 Edge-Paths

- **Direktaufruf `/check/ergebnis`** ohne sessionStorage → `router.replace('/check')` → redirect zu `/check/1`
- **Direktaufruf `/check/[step]`** mit step=11 oder step=0 → `notFound()` → 404-Page
- **`/api/create-checkout` ohne Stripe-Config** → HTTP 503, JSON-Error-Body. PaywallCTA zeigt Meldung.
- **`/api/webhook` ohne `stripe-signature` Header** → 400
- **`/api/webhook` mit ungültiger Signatur** → 400
- **Webhook ohne valide `metadata.answers` (Länge ≠ 10)** → loggt Warnung, sendet nichts, gibt aber 200 zurück (Stripe würde sonst retry'en)
- **Cancel im Stripe-Checkout** → cancel_url führt zurück zu `/check/ergebnis` (sessionStorage noch da, Quiz nicht verloren)

---

## 5. Core Logic Walkthrough

### 5.1 Quiz (`src/lib/questions.ts`)

10 Fragen, jeweils 4 Antworten A/B/C/D mit Score 1/2/3/4.

Datenstruktur:
```ts
interface QuizQuestion {
  id: number;
  question: string;
  dimension: string;
  hook: string;
  helpText?: string;
  answers: QuizOption[];
}
interface QuizOption {
  option: "A" | "B" | "C" | "D";
  score: 1 | 2 | 3 | 4;
  text: string;
}
```

**Themen der Fragen:**
1. Motivation & Klarheit
2. Zielland-Wissen
3. Zeitplan & Dringlichkeit
4. Rechtssicherheit (Steuer)
5. Finanzielle Bereitschaft
6. Familien-Logistik / Kinder
7. Familieneinigkeit / Partner
8. Gesundheits-Absicherung / KV
9. Setup-Komplexität (DE-Verpflichtungen)
10. Community & Support

Exporte: `QUESTIONS` (Array), `TOTAL_QUESTIONS` (Konstante = 10).

### 5.2 Scoring (`src/lib/scoring.ts`)

```ts
calculateScore(answers: number[]) → 10..40
  - wirft Error wenn length ≠ 10

getSegment(score: number) → "dreamer" | "planer" | "fortgeschrittener" | "starter"
  - wirft Error wenn score < 10 oder > 40
  - Grenzen: 10..18 dreamer · 19..27 planer · 28..35 fortgeschrittener · 36..40 starter

getRiskProfile(answers: number[]) → RiskProfile
  - 4 Kategorien:
    - steuerRecht   = avg(Q4, Q9)
    - absicherung   = avg(Q8)
    - planungTiming = avg(Q3, Q5)
    - familieUmfeld = avg(Q6, Q7, Q10)
  - scoreToRisk: avg ≤ 1.5 → red · ≤ 2.5 → yellow · sonst green

Labels exportiert: RISK_LABEL, RISK_CATEGORY_LABEL, RISK_CATEGORY_HINT
```

### 5.3 Segments (`src/lib/segments.ts`)

Pro Segment ein `SegmentContent`:
```ts
{
  id, scoreRange, name,
  opening,    // Ergebnisseiten-Text (~ 4 Sätze)
  bridge,     // Übergangstext (~ 2 Sätze)
  gaps,       // [string, string, string]  — 3 Kernlücken
  ctaHeadline, ctaButton,
  emailSubject, emailOpening,
}
```

Inhalte stammen 1:1 aus `docs/MVP.md` Section 5.

### 5.4 Tasks-Integration (`src/lib/pdf/tasks-priority.ts`)

Übernommen aus altem Build, country-agnostisch verwendet:

```ts
getPriorityTasks(segment, risk) → Task[]
```

- Lädt alle Tasks aus `src/data/tasks.json` (9 Länder × ~15 Tasks ≈ 135 Items)
- Flach-mappt + dedupliziert nach `title`
- Sortiert nach Priorität: kritisch < wichtig < optional
- Boost: Bei `risk[x] === 'red'` werden Tasks, deren Titel mit der jeweiligen Kategorie matcht, im Ranking nach oben gezogen
  - Regex-Mapping: `steuer|wegzug|gmbh|astg|tin|nif|sozial` → steuerRecht
  - `krankenversicherung|kv|gkv|gesundheit` → absicherung
  - `visum|residenc|emirates|cedula|aufenthalt|dni` → planungTiming
  - `schule|kind` → familieUmfeld
- Schneidet auf `SEGMENT_BUDGET`: dreamer=6, planer=9, fortgeschrittener=12, starter=14

**Bewusste Vereinfachung gegenüber altem Build:** Quiz fragt nicht mehr nach konkretem Zielland. Daher Tasks ländergemischt — als „Best-Effort"-Vorschau.

---

## 6. PDF-Generation (`src/lib/pdf/ResultPDF.tsx`)

2 Seiten, A4, via `@react-pdf/renderer`:

**Seite 1 — Diagnose**
- Header-Bar mit Branding
- Eyebrow + Segment-Name (Display) + Score
- Opening-Text aus Segment
- Risiko-Profil (2×2 Grid, 4 Kategorien mit Ampelfarbe)
- Bridge-Box (highlight-Hintergrund)
- 3 Kernlücken als Liste mit Pfeil-Bullets
- Footer mit Disclaimer

**Seite 2 — Priorisierter Fahrplan**
- Header-Bar
- Headline „Was zuerst, was zeitkritisch, was kann warten"
- Task-Liste in Reihen:
  - Prio-Label (farbig: rot=kritisch, copper=wichtig, grün=optional)
  - Titel + Beschreibung
  - Phase + Deadline-Hinweis (italic-Meta)
- Footer

**Fonts:** Default Helvetica (kein Font-Register-Call). Fraunces für PDF nicht angebunden — würde explizite Font-Registrierung erfordern. → Bewusst akzeptiert für MVP.

---

## 7. E-Mail-Flow

### 7.1 Template (`src/lib/email/template.ts`)
Funktion `renderResultEmailHtml({ segmentContent, score, baseUrl })` → HTML-String:
- Tabellen-basiertes Layout (Outlook-kompatibel)
- Header dunkelgrün (fir) mit Segment-Name + Score
- Body: Eröffnungstext aus `emailOpening` + Opening-Text aus Segment
- Bulletpoints: was im PDF-Anhang
- CTA-Button → `/check/ergebnis` (online-Ansicht)
- Footer mit Disclaimer
- HTML-Escaping für alle Variablen via `escape()`-Helper

### 7.2 Versand (in `webhook/route.ts`)
- Direkter `fetch()` an `https://api.resend.com/emails`
- Authorization-Header: `Bearer ${RESEND_API_KEY}`
- Body: `{ from, reply_to, to, subject, html, attachments: [{ filename, content: base64 }] }`
- From: `Auswander-Kompass <bericht@auswanderkompass.de>`
- Reply-To: `kontakt@auswanderkompass.de`
- Filename: `Auswander-Kompass-Bericht.pdf`
- Bei `!res.ok`: nur `console.error`, kein Retry, kein Fallback-Pfad

---

## 8. Stripe-Integration

### 8.1 Checkout Session (`src/app/api/create-checkout/route.ts`)
```ts
mode: "payment"
payment_method_types: ["card"]
customer_email: <input>
line_items: [{
  price_data: {
    currency: "eur",
    unit_amount: 2700,   // 27 € einmalig
    product_data: { name, description }
  },
  quantity: 1
}]
success_url: ${baseUrl}/danke?session_id={CHECKOUT_SESSION_ID}
cancel_url:  ${baseUrl}/check/ergebnis
locale: "de"
metadata: {
  segment, score (string),
  answers: JSON.stringify([n,n,n,n,n,n,n,n,n,n])
}
```

**Edge-Cases im Code:**
- `email` fehlt oder `answers.length !== 10` → 400
- `stripeReady()` false → 503 mit deutscher Fehlermeldung
- Stripe-Error im try/catch → 500 mit generischem Hinweis

### 8.2 Webhook (`src/app/api/webhook/route.ts`)
- `req.text()` für Raw Body (Stripe-Anforderung)
- `stripe.webhooks.constructEvent(body, sig, secret)` → Signatur-Check
- Nur `checkout.session.completed` wird verarbeitet
- Verifiziert metadata + email
- Re-runs `calculateScore` + `getSegment` (defensive Re-Validation, ignoriert metadata.score/segment)
- `renderToBuffer(ResultPDF(...))` → Buffer → base64 → Resend
- Antwort: 200 `{ received: true }` (auch bei Resend-Fehler — kritisch für Stripe-Idempotenz)

**Nicht implementiert:**
- Idempotenz-Map (gleiches Event 2× = 2 Mails)
- `customer.subscription.deleted` (irrelevant für mode=payment)
- Retry-Queue bei Resend-Fehler

---

## 9. Tracking (PostHog)

### 9.1 Init (`src/components/shared/PostHogInit.tsx`)
- Client Component, mounted im Root-Layout
- useEffect: prüft Key + initialisiert einmalig (`window.__ak_ph_init` Flag)
- Optionen: `api_host: NEXT_PUBLIC_POSTHOG_HOST ?? https://eu.posthog.com`, `capture_pageview: true`, `persistence: 'memory'`, `autocapture: false`

### 9.2 Custom Events (via `src/lib/track.ts`)
| Event | Wo getrackt | Props |
|---|---|---|
| `lp_view` | implizit via `capture_pageview: true` | — |
| `diagnose_start` | QuestionStep auf step=1 | — |
| `q_answered` | QuestionStep nach Auswahl | `q_num`, `score` |
| `diagnose_complete` | Ergebnisseite | `segment`, `score`, `risk_level` |
| `result_view` | Ergebnisseite | `segment`, `score` |
| `paywall_view` | Ergebnisseite | `segment` |
| `checkout_start` | PaywallCTA | `segment`, `score` |

**Fehlend gegenüber Spec:**
- `roadmap_view` (Spec hatte Paid-Bereich, hier irrelevant)
- `expert_link_click` (Spec hatte externe Affiliate-Links, hier nicht)

**Persistence: 'memory'** — bewusst gewählt, weil cookielose Variante für DSGVO ohne Consent-Banner. Trade-off: keine Wiedererkennung über Sessions hinweg.

---

## 10. Configuration & ENV

### 10.1 Erwartete Variablen
```bash
# Stripe
STRIPE_SECRET_KEY=sk_test_… (oder sk_live_…)
STRIPE_WEBHOOK_SECRET=whsec_…
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_… (aktuell unused im Code)

# Resend
RESEND_API_KEY=re_…

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=phc_…
NEXT_PUBLIC_POSTHOG_HOST=https://eu.posthog.com

# App
NEXT_PUBLIC_BASE_URL=https://auswanderkompass.de
```

### 10.2 Defensive Defaults
`src/lib/env.ts` exportiert Boolean-Checks:
- `stripeReady()` — prüft Key existiert + nicht `sk_test_placeholder`
- `stripeWebhookReady()` — analog für Webhook-Secret
- `resendReady()` — analog für Resend-Key
- `supabaseAdminReady()` — Legacy, aktuell ungenutzt

API-Routen prüfen vor Aktion und antworten mit klaren 503-Meldungen wenn Config fehlt.

---

## 11. Test-Coverage

**Vorhanden:** `/api/qa/scoring` — 8 deterministische Logik-Tests:
1. alle A → score 10, dreamer
2. alle D → score 40, starter
3. Grenzwerte 18/19/27/28/35/36 (6 Assertions in 1 Case)
4. alle A → 4×red (Risk-Profile)
5. alle D → 4×green
6. Mix [1,2,3,4,2,3,4,2,1,3] → score 25, planer
7. `calculateScore` wirft bei falscher Länge
8. `getSegment` wirft bei score < 10

**Nicht abgedeckt:**
- Webhook Happy-Path (Signatur, Metadata-Parse, PDF-Gen)
- PDF-Rendering (rendert tatsächlich? Bricht bei großen Strings?)
- Resend-Aufruf (Mock fehlt)
- Tasks-Priority-Aggregation
- Locale-Edge-Cases
- Quiz-State-Hydration aus sessionStorage
- Browser-Back-Navigation im Quiz
- Stripe Checkout-Session-Erstellung (kein Mock)

**Kein jest/vitest installiert.** Tests laufen ausschließlich über die HTTP-Route.

---

## 12. Spec-Adherence Matrix

| Spec-Anforderung | Status | Anmerkung |
|---|---|---|
| Next.js 14 App Router | ✓ | 14.2.35 |
| TypeScript | ✓ | strict |
| Tailwind CSS + Custom-Tokens | ✓ | Forest-Palette aus shared.jsx |
| shadcn/ui | ✗ | nicht implementiert — native + Tailwind |
| react-hook-form + zod | ✗ | nicht implementiert — native State |
| Resend EU | ✓ | direkt via fetch |
| @react-pdf/renderer | ✓ | server-side |
| Sessions: Vercel KV oder Supabase | ✗ | stateless, sessionStorage + Stripe metadata |
| Analytics: Plausible | ✗ | **bewusst durch PostHog ersetzt** (User-Wunsch) |
| Stripe mode='payment' 27€ | ✓ | unit_amount: 2700 |
| Vercel fra1 | ✓ | vercel.json |
| Fonts: Fraunces + Inter Tight | ✓ | via next/font/google |
| Routen: /, /check, /check/[step], /check/ergebnis, /danke, /datenschutz, /impressum | ✓ | alle vorhanden |
| API: /create-checkout, /webhook, /report | partial | `/api/report` nicht implementiert — Webhook macht alles |
| Landingpage 11 Sektionen | ✓ | aber in **einer** page.tsx, nicht in `/components/landing/*` wie Spec |
| Quiz 10 Fragen scored 1-4 | ✓ | aus MVP.md |
| 4 Segmente | ✓ | dreamer/planer/fortgeschrittener/starter |
| Score-Grenzen 18/19, 27/28, 35/36 | ✓ | im Test bestätigt |
| Risk-Profile 4 Kategorien | ✓ | Q4+Q9, Q8, Q3+Q5, Q6+Q7+Q10 |
| Ampel red/yellow/green | ✓ | scoreToRisk: 1.5 / 2.5 Schwellen |
| Ergebnisseite Zone A/B/C | ✓ | Diagnose · Locked · Paywall |
| PDF-Anhang | ✓ | 2 Seiten, A4, Tasks integriert |
| E-Mail mit DKIM via Resend | ⚠ | DKIM-Setup für `bericht@auswanderkompass.de` ist User-Aufgabe |
| Sitemap + Robots | ✓ | metadata-routes |
| /impressum + /datenschutz | ⚠ | Seiten existieren, Inhalt `[Platzhalter]` |
| Favicon + Apple-Touch-Icon | ✗ | nicht erstellt |
| OG-Image 1200×630 | ✗ | nicht erstellt |
| Lighthouse Performance ≥ 95 | ? | nicht gemessen |
| Tastatur-Navigation | ⚠ | Buttons funktionieren, aber kein explizites Focus-Ring-Styling |
| Reduced-motion respect | ✓ | globals.css |
| Unit-Tests (jest) | ✗ | nur `/api/qa/scoring` |
| Mobile Responsive | ⚠ | Tailwind-Breakpoints im Code; nicht visuell verifiziert |

---

## 13. Known Issues / Gaps / Risks

### 13.1 Funktional
| # | Issue | Impact | Severity |
|---|---|---|---|
| F1 | Webhook hat keine Idempotenz | Duplicate Stripe-Event = 2 Mails an Kunde | mittel |
| F2 | Bei Resend-Fehler kein Retry, kein Fallback (z.B. SendGrid) | Kunde zahlt aber bekommt nichts, manuelle Recovery nötig | hoch |
| F3 | `/danke` validiert die `session_id` nicht | Direkter Link-Aufruf zeigt Erfolgsseite ohne Kauf | niedrig (kosmetisch) |
| F4 | `sessionStorage` ist Tab-scoped | User schließt Tab → sieht Ergebnis neu = leer | mittel |
| F5 | Tasks im PDF country-agnostisch | Tasks für Argentinien-Quiz-User sehen Tasks für USA. Wert reduziert. | hoch (Kern-Wert) |
| F6 | Webhook-Validierung: bei `answers.length !== 10` → Skip ohne Fehler | Kunde zahlt 27 € und bekommt keinen Bericht | hoch |
| F7 | `metadata.answers` ist stringifizierte 10-Zahl-Array (~30 chars), Stripe-metadata-Limit 500 chars OK | — | n/a (nur prüfen) |

### 13.2 Sicherheit
| # | Issue | Severity |
|---|---|---|
| S1 | Kein Rate-Limit auf `/api/create-checkout` | mittel (Stripe-Kosten bei Bot-Spam) |
| S2 | Kein Rate-Limit auf `/api/qa/scoring` | niedrig (read-only, cheap) |
| S3 | Webhook validiert NUR Signatur, prüft nicht Stripe-Account-ID | niedrig (Default-Verhalten) |
| S4 | `RESEND_API_KEY` und `STRIPE_SECRET_KEY` direkt in `process.env` ohne Validierung beim Boot | niedrig (Routen failen graceful) |
| S5 | Quiz-Antworten in Stripe-metadata → für Stripe-Dashboard-User einsehbar | niedrig (nicht sensibel) |
| S6 | Keine CSP-Header, kein HSTS-explizit konfiguriert | mittel |

### 13.3 UX / Content
| # | Issue | Severity |
|---|---|---|
| U1 | Legal-Pages `[Platzhalter]` (Impressum, Datenschutz) | **kritisch für Launch** (Abmahngefahr) |
| U2 | Kein Favicon, kein OG-Image | mittel (Social-Sharing leer) |
| U3 | Quiz-Antworten nicht editierbar nach Submit | mittel (User bemerkt Fehler nicht) |
| U4 | Kein Auto-Save-Hinweis beim Quiz | niedrig |
| U5 | Cancel-URL führt zurück zu `/check/ergebnis`, dort ist Ergebnis intakt — gut | n/a |
| U6 | Hero-CTA „Einschätzung starten" zweimal auf Page (Hero + FinalCTA) | n/a (gut) |

### 13.4 Code-Qualität
| # | Issue | Severity |
|---|---|---|
| C1 | `HeroCompass.tsx` hardcodiert Hex-Farben (nicht Tailwind-Tokens) | niedrig (SVG-Native, kein klares Refactor-Ziel) |
| C2 | `Landingpage` in einer `page.tsx` statt Spec-konform in `/components/landing/*` | niedrig (Wartbarkeit) |
| C3 | `@stripe/stripe-js` + `resend` Packages installiert aber ungenutzt | niedrig (dead deps) |
| C4 | `src/lib/env.ts` exportiert `supabaseAdminReady()` (Legacy, nirgends genutzt) | niedrig |
| C5 | `src/components/check/QuestionStep.tsx` mischt Tracking + Storage + Routing | niedrig (akzeptabel für MVP-Größe) |
| C6 | Kein zentraler Error-Boundary | mittel (Crash auf Ergebnisseite = white screen) |
| C7 | `next.config.mjs` ist leer — keine Image-Optimization-Config, keine Header-Config | niedrig |

### 13.5 SEO / Performance
| # | Issue | Severity |
|---|---|---|
| P1 | First Load JS shared = 87.3 kB — akzeptabel | n/a |
| P2 | `/check/[step]` lädt 161 kB First Load — kein Code-Splitting der Question-Daten | niedrig |
| P3 | PDF-Generation auf Vercel (Cold Start) — kann 2-5s dauern | mittel (Mail-Latenz) |
| P4 | Kein Preload für kritische Fonts | niedrig |
| P5 | `metadataBase` korrekt gesetzt | ✓ |

---

## 14. Build-Verification

### Lint
```bash
npx next lint
✔ No ESLint warnings or errors
```

### Build
```bash
npx next build
✓ Compiled successfully
✓ Generating static pages (13/13)
```

### QA-Route lokal
```bash
curl http://localhost:3000/api/qa/scoring
{"status":"pass","passed":8,"failed":0,"total":8,…}
```

---

## 15. Offene Setup-Schritte

Diese Items sind NICHT Code-Issues, sondern operative Setup-Tasks die User selbst erledigen muss:

1. **Stripe Sandbox + Live Setup**
   - Product „Auswander-Kompass" anlegen
   - Test- und Live-Keys in Vercel ENV (Production + Preview Scope)
   - Webhook-Endpunkt `/api/webhook` für beide Modes registrieren
   - 2 separate `STRIPE_WEBHOOK_SECRET` (sandbox vs. live) — Code erwartet aktuell nur eines, Switch wird zur Live-Schaltung notwendig

2. **Resend**
   - Domain `auswanderkompass.de` verifizieren (SPF + DKIM)
   - Sender `bericht@auswanderkompass.de` registrieren (anders als bisher genutztes `hallo@`)
   - API-Key in Vercel ENV

3. **PostHog**
   - Projekt anlegen (EU-Instanz)
   - `phc_…` Key + Host in Vercel ENV

4. **Vercel**
   - Custom Domain `auswanderkompass.de` an Project anhängen
   - DNS beim Registrar: A `@` → `76.76.21.21`, CNAME `www` → `cname.vercel-dns.com`
   - Deployment Protection für Production → Disabled
   - Production-Build wird automatisch beim nächsten Push ausgelöst

5. **Legal-Texte**
   - `[Platzhalter]` in `src/app/impressum/page.tsx` und `src/app/datenschutz/page.tsx` ersetzen
   - Anwaltsprüfung **vor Launch dringend empfohlen** (Abmahnrisiko)

6. **Brand-Assets**
   - Favicon (16×16, 32×32, apple-touch-icon)
   - OG-Image 1200×630
   - In `src/app/` ablegen, Metadata-Hooks ergänzen

7. **End-to-End-Test mit Test-Karte `4242 4242 4242 4242`**
   - Quiz vollständig
   - Stripe Checkout-Flow
   - Webhook → Mail kommt an
   - PDF im Postfach öffnen + Inhalt prüfen

---

## 16. Empfohlene Audit-Fokusbereiche

Für die analysierende Claude-Instanz — hier sind die Stellen mit dem höchsten Erkenntnis-Wert:

### Hohe Prio
1. **`src/app/api/webhook/route.ts`** — verifiziere:
   - Signatur-Check korrekt
   - PDF wird bei JEDER `checkout.session.completed`-Event versucht (keine Filter zu früh)
   - Defensive Re-Validation mit `calculateScore` ist sinnvoll
   - Was passiert wenn `renderToBuffer` wirft? (kein try/catch um den Aufruf)
   - Idempotenz-Strategie fehlt — wie sollte sie aussehen?

2. **`src/lib/pdf/tasks-priority.ts`** — verifiziere:
   - Sind die Regex-Boost-Patterns sinnvoll für ROT-Kategorien?
   - SEGMENT_BUDGET (6/9/12/14) — passt das zur PDF-Layout-Kapazität (2 Seiten A4)?
   - Dedupe über `title` korrekt? (was bei sehr ähnlichen Titel-Strings?)

3. **`src/app/check/ergebnis/page.tsx`** — verifiziere:
   - sessionStorage-Hydration race-condition-frei?
   - Tracking-Events feuern genau einmal? (kein StrictMode-Doppelfeuer?)
   - `worstRisk()` / `lowestRiskKey()` Logik korrekt für alle Edge-Cases?

4. **`src/lib/scoring.ts`** — verifiziere:
   - `scoreToRisk` Schwellen (1.5 / 2.5) sinnvoll bei Risk-Profile-Boundaries?
   - Beispiel: avg = 2.5 → "yellow" (≤ 2.5) — gewollt?

### Mittlere Prio
5. **`src/app/api/create-checkout/route.ts`** — verifiziere:
   - `unit_amount: 2700` → Stripe rechnet in Cent → 27,00 € OK
   - `customer_email` Pre-Fill — UX-Sicht: kann User noch ändern? (Ja, Stripe-Default)
   - Metadata-Size: 10 Zahlen × ~2 Chars = ~30 chars + Wrapper = ~50 chars. Stripe-Limit 500 chars. Reserve da.

6. **`src/lib/segments.ts`** — Lesbarkeits-Check:
   - Tonalität der 4 Segmente konsistent?
   - „Punkt 3" / Bridge / Gaps stimmig mit Eröffnung?

7. **Landing-Page-Hierarchie** in `src/app/page.tsx`:
   - 11 Sektionen mit unterschiedlichen Background-Farben (paper vs. paperAlt) — Rhythmus OK?
   - Hero-CTA und Final-CTA verlinken auf `/check` — kein Duplikat-Tracking-Problem? (Beides löst `lp_view` aus, nicht `cta_click`)

### Niedrigere Prio
8. **Type-Safety** in `src/app/api/qa/scoring/route.ts` — `as unknown as Record<string,unknown>` Cast bei RiskProfile-Vergleich. Sauberer wäre eigener Vergleichs-Helper.

9. **A11y** — alle interaktiven Komponenten haben `<button>` Tags, aber:
   - `aria-current` bei Progress-Indicator?
   - `aria-live` für Quiz-Frage-Wechsel?
   - Focus-Ring-Styling konsistent?

10. **i18n-Vorbereitung** — alle Strings sind hardcoded auf Deutsch. Bewusste Entscheidung für MVP. Refactor-Pfad: `lib/i18n.ts` mit dictionary-Pattern.

---

## 17. Spezifische Fragen zur Investigation

Bitte (Audit-Claude) prüfen und beantworten:

**Architektur:**
1. Sollte das Tasks-System Country-Picker ins Quiz zurückbringen, damit Tasks personalisierter werden? Trade-off: 11 Fragen statt 10 + Quiz-Verlängerung.
2. Ist „Stateless via Stripe-metadata" robust genug, oder sollte minimaler DB-Layer (z.B. Vercel KV) für Audit-Logs + Recovery ergänzt werden?
3. Ist die Idempotenz im Webhook ein Blocker für Launch oder akzeptabler MVP-Trade-off?

**Code-Qualität:**
4. Sollten die 11 Landingpage-Sektionen aus `page.tsx` in `/components/landing/*` extrahiert werden? Bei 700+ Zeilen pro Seite ist Wartung Thema.
5. Ist die Trennung Brand-Komponenten vs. Section-Inline-Markup konsistent?
6. Gibt es offensichtliche Performance-Regressionen (z.B. nicht-memoizes Komponenten, große Re-Renders)?

**Geschäftslogik:**
7. Ist der „erste Risikopunkt" sichtbar in Zone A einfach `lowestRiskKey()` — oder sollte das vom Segment abhängen?
8. Sollte `urgent`-Banner (Frage 3 Score ≥ 3) zusätzliche Logik bekommen (z.B. abhängig vom Segment)?
9. Stripe `cancel_url` = `/check/ergebnis` — sollte stattdessen eine eigene „Abgebrochen"-Seite folgen?

**SEO / Marketing:**
10. Welche Schema.org-Markup wäre sinnvoll? (Product mit Price, FAQPage)
11. Reicht das aktuelle `<title>`-Template für SEO oder besser sektion-spezifisch?
12. Sollten die Legal-Pages noindex sein (aktuell indexed)?

**Compliance:**
13. Reicht die `persistence: 'memory'`-Setting für PostHog für DSGVO ohne Consent-Banner? (Kein Cookie wird gesetzt → ja)
14. Sind die im PDF erwähnten „Empfehlungen" hinreichend allgemein, um nicht als Rechts- oder Steuerberatung interpretiert zu werden?

---

## 18. Diff zum altem Build (Validation v1.0)

Falls relevant für Audit-Verständnis: Der Build wurde am 10. Mai 2026 vollständig neu aufgesetzt. Folgendes wurde aus dem alten Build (Sprint 1–4, 29 €/Monat Subscription mit Dashboard) übernommen:

- **`src/data/tasks.json`** — exakt portiert (9 Länder × ~15 Tasks)
- **Brand-Disziplin** (Tailwind-Token-Strategie, keine inline Hex außer in SVGs)
- **API-Route-Pattern** (defensive Config-Checks, klare HTTP-Status-Codes)
- **PostHog-Setup** (statt Plausible)

Verworfen:
- Supabase + Schema (3 Tabellen)
- Magic-Link-Auth via Cookie-Sessions
- Stripe Subscription mode + Customer Portal
- Dashboard `/willkommen` mit Task-Checkboxen
- 29 €/Monat → ersetzt durch **27 € einmalig**
- Navy/Teal-Brand → ersetzt durch **paper/fir/copper „Kartographisch"**

---

## 19. Hinweis an den prüfenden Claude

Wenn Du Issues findest, kategorisiere sie bitte nach:
- **Blocker** (Launch unmöglich)
- **Hoch** (UX/Conversion/Daten kompromittiert)
- **Mittel** (akzeptabel für MVP, vor Skalierung beheben)
- **Niedrig** (Polish)

Bitte konkret nennen:
- Datei + Zeile
- Was schiefläuft
- Vorgeschlagener Fix (1–3 Sätze)

Verzichte auf Style-Korrekturen ohne Substanz. Fokus auf:
- Conversion-Risiken (User zahlt, bekommt nichts)
- Daten-Integrität (Antworten verloren, falsche Segmente)
- Rechts-Risiken (DSGVO, Abmahnung)
- Performance-Cliffs (PDF-Cold-Start, sehr großes JS-Bundle)

Danke.

---

*Ende AUDIT_v1.md*
