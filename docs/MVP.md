# Auswander-Kompass — MVP.md
## Quiz-Logik · Scoring · Segmente · Ergebnis-Architektur

**Version:** 2.0 · **Mai 2026**  
**Verwendung:** Technische Referenz für Claude Code Build — direkt in `/lib/questions.ts`, `/lib/scoring.ts` und `/app/check/ergebnis` übertragen.

---

## 1. Scoring-System — Übersicht

| Regelwerk            | Wert                                  |
|----------------------|---------------------------------------|
| Anzahl Fragen        | 10                                    |
| Antwortoptionen      | 4 (A–D)                               |
| Punkte pro Antwort   | 1 (A) · 2 (B) · 3 (C) · 4 (D)        |
| Minimaler Score      | 10 Punkte (alle A)                    |
| Maximaler Score      | 40 Punkte (alle D)                    |

---

## 2. Scoring-Logik (TypeScript)

```typescript
// /lib/scoring.ts

export type Segment = 'dreamer' | 'planer' | 'fortgeschrittener' | 'starter'

export function calculateScore(answers: number[]): number {
  if (answers.length !== 10) {
    throw new Error(`Expected 10 answers, got ${answers.length}`)
  }
  return answers.reduce((sum, score) => sum + score, 0)
}

export function getSegment(score: number): Segment {
  if (score < 10 || score > 40) {
    throw new Error(`Score ${score} out of valid range (10–40)`)
  }
  if (score <= 18) return 'dreamer'
  if (score <= 27) return 'planer'
  if (score <= 35) return 'fortgeschrittener'
  return 'starter'
}
```

### Segmentgrenzen

| Score  | Segment-ID         | Anzeigename          | Grenzfall          |
|--------|--------------------|----------------------|--------------------|
| 10–18  | `dreamer`          | Der Träumer          | 18 → dreamer ✓     |
| 19–27  | `planer`           | Der Planer           | 19 → planer ✓      |
| 28–35  | `fortgeschrittener`| Der Fortgeschrittene | 28 → fortgeschr. ✓ |
| 36–40  | `starter`          | Der Starter          | 36 → starter ✓     |

**Unit-Test-Grenzwerte:** `18/19` · `27/28` · `35/36`

---

## 3. Die 10 Quiz-Fragen

```typescript
// /lib/questions.ts

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
  helpText?: string
  answers: QuizOption[]
}

export const QUESTIONS: QuizQuestion[] = [
```

---

### Frage 1 — Motivation & Klarheit
**Conversion-Hook:** Ziel-Bewusstsein

> **Warum möchtest du auswandern?**

| Option | Antworttext | Punkte |
|--------|-------------|--------|
| A | Ich träume davon, habe aber noch kein konkretes Warum. | 1 |
| B | Mehr Freiheit, Sonne und Lebensqualität für meine Familie. | 2 |
| C | Steueroptimierung und finanzielle Unabhängigkeit. | 3 |
| D | Ich habe ein klares Ziel und einen konkreten Plan dahinter. | 4 |

*Einstiegsfrage — niedrige Hemmschwelle, schafft sofort Identifikation. Antwort B trifft Primär-Zielgruppe (junge Familien) direkt.*

---

### Frage 2 — Zielland-Wissen
**Conversion-Hook:** Orientierungslücke

> **Wie klar ist dein Zielland?**

| Option | Antworttext | Punkte |
|--------|-------------|--------|
| A | Ich habe noch kein konkretes Land im Kopf. | 1 |
| B | Ich habe 2–3 Länder im Kopf, bin noch unentschlossen. | 2 |
| C | Ich weiß wohin, kenne aber die lokalen Regeln kaum. | 3 |
| D | Ich kenne Steuersystem, Visum und Alltag meines Ziellandes. | 4 |

*Antwort C ist die häufigste — Nutzer fühlen sich gut informiert, sind es aber nicht. Perfekte Conversion-Trigger-Zone.*

---

### Frage 3 — Zeitplan & Dringlichkeit
**Conversion-Hook:** Urgency-Aufbau

> **Wann möchtest du auswandern?**

| Option | Antworttext | Punkte |
|--------|-------------|--------|
| A | Irgendwann in den nächsten Jahren — kein fixer Plan. | 1 |
| B | In 1–2 Jahren, wenn alles passt. | 2 |
| C | In den nächsten 6–12 Monaten — es wird konkret. | 3 |
| D | In weniger als 6 Monaten — der Countdown läuft. | 4 |

*Zeitdruck aktiviert Kaufbereitschaft. Score 3 bekommt im Ergebnis: "Du hast weniger Zeit als du denkst."*

---

### Frage 4 — Rechtssicherheit
**Conversion-Hook:** Fehler-Angst (stärkster Pain Point)

> **Wie steht es um deine rechtliche & steuerliche Vorbereitung?**

| Option | Antworttext | Punkte |
|--------|-------------|--------|
| A | Ich habe keine Ahnung, was steuerlich auf mich zukommt. | 1 |
| B | Ich weiß, dass es Themen gibt — habe aber noch nichts geprüft. | 2 |
| C | Ich habe recherchiert, bin aber bei Details unsicher. | 3 |
| D | Ich habe einen Steuerberater und einen rechtlichen Plan. | 4 |

*85% der Teilnehmer wählen A oder B. Das Ergebnis nennt konkret: Wegzugsbesteuerung, Abmeldefristen, steuerliche Ansässigkeit — erzeugt echte Dringlichkeit.*

---

### Frage 5 — Finanzielle Bereitschaft
**Conversion-Hook:** Kosten-Schock-Prävention

> **Wie ist deine finanzielle Planung für die Auswanderung?**

| Option | Antworttext | Punkte |
|--------|-------------|--------|
| A | Ich habe keine Vorstellung, was Auswandern wirklich kostet. | 1 |
| B | Ich schätze grob — habe aber keine Detailplanung. | 2 |
| C | Ich kenne die Hauptkostenblöcke und habe begonnen zu sparen. | 3 |
| D | Ich habe einen konkreten Finanzplan inkl. Puffer. | 4 |

*Im Ergebnis wird ein konkreter Betrag genannt: "Ein typischer Auswanderungsstart kostet 8.000–15.000 €." Das schafft Respekt vor der Komplexität und Wunsch nach dem Kosten-Rechner.*

---

### Frage 6 — Familien-Logistik
**Conversion-Hook:** Eltern-Verantwortungs-Trigger

> **Hast du Kinder — und wie weit ist ihre Schulplanung?**

| Option | Antworttext | Punkte |
|--------|-------------|--------|
| A | Ich habe Kinder — das ist mein größtes Fragezeichen. | 1 |
| B | Ich habe Kinder, mache mir Sorgen, habe noch nichts recherchiert. | 2 |
| C | Ich habe Infos über Schulen gesammelt, aber nichts ist sicher. | 3 |
| D | Schule ist konkret geplant. / Ich habe keine Kinder. | 4 |

*"Keine Kinder" bekommt 4P — kein Teilnehmer fühlt sich ausgeschlossen. Für Eltern ist dies oft die emotionalste Frage. Das Ergebnis spricht Eltern mit Sabine-Persona-Sprache an.*

---

### Frage 7 — Familieneinigkeit
**Conversion-Hook:** Beziehungs-Risiko + Viral-Loop

> **Wie steht deine Familie / dein Partner zu dem Plan?**

| Option | Antworttext | Punkte |
|--------|-------------|--------|
| A | Mein Partner / meine Familie ist skeptisch oder nicht überzeugt. | 1 |
| B | Wir diskutieren es — sind uns aber noch nicht einig. | 2 |
| C | Wir sind grundsätzlich einig, haben aber noch offene Fragen. | 3 |
| D | Wir ziehen alle an einem Strang mit dem gleichen Ziel. | 4 |

*Ergebnis empfiehlt: "Lass deinen Partner den Kompass auch machen" → automatische Lead-Verdopplung durch Viral-Mechanik.*

---

### Frage 8 — Gesundheits-Absicherung
**Conversion-Hook:** Angst vor Notfall

> **Wie sicher bist du bei Krankenversicherung & Absicherung im Ausland?**

| Option | Antworttext | Punkte |
|--------|-------------|--------|
| A | Ich weiß nicht, wie ich im Ausland versichert wäre. | 1 |
| B | Ich weiß, dass ich mich darum kümmern muss — noch nichts getan. | 2 |
| C | Ich habe erste Optionen recherchiert, bin noch unentschlossen. | 3 |
| D | Ich habe eine internationale Krankenversicherung oder einen festen Plan. | 4 |

*Aktiviert Worst-Case-Denken konstruktiv: "Was passiert, wenn du krank wirst?" Ergebnis nennt konkrete KV-Optionen — Affiliate-Potenzial für Novamundi.*

---

### Frage 9 — Setup-Komplexität
**Conversion-Hook:** Versteckte Kosten

> **Was passiert mit deiner Firma, Immobilien oder Verträgen in Deutschland?**

| Option | Antworttext | Punkte |
|--------|-------------|--------|
| A | Ich weiß nicht, was mit meinen deutschen Verpflichtungen passiert. | 1 |
| B | Ich habe Verpflichtungen, weiß aber nicht genau was zu tun ist. | 2 |
| C | Ich habe erste Infos — bei Details bin ich noch unsicher. | 3 |
| D | Alles ist mit Experten besprochen — ich habe einen klaren Plan. | 4 |

*Trifft Unternehmer-Persona direkt. Auch für Angestellte relevant (Mietvertrag, Versicherungen, Rente). Ergebnis: "Das vergessen 90% der Auswanderer."*

---

### Frage 10 — Community & Support
**Conversion-Hook:** Isolation-Angst (emotionaler Abschluss)

> **Hast du ein Netzwerk aus Menschen, die den Schritt schon gegangen sind?**

| Option | Antworttext | Punkte |
|--------|-------------|--------|
| A | Nein — ich fühle mich damit ziemlich allein. | 1 |
| B | Ich folge Accounts online, habe aber keine persönlichen Kontakte. | 2 |
| C | Ich kenne einige Leute und habe erste Kontakte geknüpft. | 3 |
| D | Ich habe ein aktives Netzwerk aus Experten und Gleichgesinnten. | 4 |

*Letzte Frage endet emotional und leise. "Allein" resoniert stark. Das Ergebnis positioniert Novamundi Community als direkte Antwort — kein Druck, nur Einladung.*

---

## 4. TypeScript-Datenstruktur (direkt in `/lib/questions.ts` einfügen)

```typescript
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
    hook: 'Beziehungs-Risiko + Viral-Loop',
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

---

## 5. Segment-Texte — Ergebnisseite

### Segment: Der Träumer (10–18 Punkte)

**Eröffnungstext:**
> Du bist ein Träumer — und das ist deine größte Stärke. Dein Ergebnis zeigt: Der Wunsch, auszuwandern, ist in dir — aber der erste konkrete Schritt fehlt noch. Das ist kein Problem. Das ist der normalste Ausgangspunkt der Welt. Die meisten Menschen, die heute glücklich im Ausland leben, haben genau hier angefangen: mit einem Traum und einem großen Fragezeichen dahinter.

**Lücken-Absatz:**
> Was dich aktuell bremst, ist kein fehlendes Geld und kein fehlendes Können. Es ist das Fehlen eines klaren Fahrplans — und die Angst, beim ersten Schritt einen Fehler zu machen, den du nicht rückgängig machen kannst.

**3 Kernlücken (Liste):**
1. Du brauchst zuerst Klarheit über dein Zielland und dein konkretes "Warum" — ohne das dreht sich jede Recherche im Kreis.
2. Die steuerlichen und rechtlichen Grundlagen musst du kennen, bevor du irgendeine Entscheidung triffst — sonst kostet dich Unwissenheit später viel Geld.
3. Du brauchst einen Zeitplan — auch wenn er noch grob ist.

**CTA-Headline:** Fang heute an — mit dem Auswander-Kompass.
**CTA-Button:** Auswander-Kompass freischalten — 27 €

---

### Segment: Der Planer (19–27 Punkte)

**Eröffnungstext:**
> Du denkst in die richtige Richtung — aber deine Antworten zeigen 3–4 kritische Lücken, die teuer werden können. Besonders bei Steuern, Versicherung und dem richtigen Setup. Jetzt ist genau der richtige Moment, sie zu schließen — bevor sie dich einholen.

**Lücken-Absatz:**
> Du hast die erste Phase hinter dir: den Entschluss. Was jetzt fehlt, ist die Struktur. Viele in deiner Situation recherchieren parallel auf 10 verschiedenen Kanälen — YouTube, Reddit, Foren — und verlieren dabei das Wesentliche aus dem Blick: die richtige Reihenfolge.

**3 Kernlücken (Liste):**
1. Deine steuerliche und rechtliche Situation ist noch nicht konkret bewertet — das ist das größte finanzielle Risiko in deiner Phase.
2. Dein Zeitplan ist unklar oder zu vage — ohne Datum laufen Fristen unbemerkt ab.
3. Die Koordination der einzelnen Schritte fehlt — wer macht was, bis wann?

**CTA-Headline:** Schließ die Lücken, bevor sie dich einholen.
**CTA-Button:** Jetzt Lücken schließen — 27 €

---

### Segment: Der Fortgeschrittene (28–35 Punkte)

**Eröffnungstext:**
> Du bist weiter als 80% derer, die über Auswandern nachdenken. Das zeigt dein Score. Jetzt geht es nicht mehr um den Überblick — sondern um die Details, die den Unterschied zwischen einem stressfreien Start und teuren Überraschungen ausmachen.

**Lücken-Absatz:**
> In deiner Phase entstehen die meisten Fehler nicht aus Unwissen — sondern aus falscher Priorisierung. Du weißt, was zu tun ist. Die Frage ist: in welcher Reihenfolge, und bis wann?

**3 Kernlücken (Liste):**
1. Einzelne Lücken — oft genau dort, wo du dich am sichersten fühlst — können das gesamte Setup teurer machen.
2. Die zeitliche Taktung der Schritte ist entscheidend: ein zu früher oder zu später Schritt kostet.
3. Die Koordination zwischen deinen Experten (Steuerberater, Anwalt, Bank) läuft oft nicht von selbst.

**CTA-Headline:** Vervollständige deinen Plan — kein Detail vergessen.
**CTA-Button:** Plan vervollständigen — 27 €

---

### Segment: Der Starter (36–40 Punkte)

**Eröffnungstext:**
> Respekt — du hast dich ernsthaft vorbereitet. Dein Score zeigt, dass du die Grundlagen hast. Was du jetzt brauchst, ist kein weiterer Überblick. Sondern deinen finalen, persönlichen Aktionsplan: Was genau, in welcher Reihenfolge, bis wann.

**Lücken-Absatz:**
> In deiner Phase ist der häufigste Fehler: zu lange warten, weil "noch nicht alles perfekt ist." Der Kompass zeigt dir, was wirklich noch fehlt — und was bereits erledigt ist.

**3 Kernlücken (Liste):**
1. Den finalen Check aller zeitkritischen Fristen — damit kurz vor dem Wegzug nichts mehr offenbleibt.
2. Den vollständigen Überblick über deine deutsche Seite: Verträge, Versicherungen, Abmeldung.
3. Den personalisierten Startfahrplan für die ersten 90 Tage nach dem Umzug.

**CTA-Headline:** Hole dir deinen persönlichen Startfahrplan.
**CTA-Button:** Startfahrplan freischalten — 27 €

---

## 6. Ergebnis-Architektur — Was der Nutzer sieht (und kauft)

### Aufbau der Ergebnisseite `/check/ergebnis`

Die Ergebnisseite ist in drei Zonen gegliedert:

#### Zone A — Diagnose (kostenlos, vollständig sichtbar)

- Segment-Label + Score-Anzeige ("Du hast 22 von 40 Punkten")
- Segment-Name in Serif: "Der Planer"
- Eröffnungstext (segment-spezifisch, siehe Kapitel 5)
- **Risiko-Kompass-Profil:** visuell, 4 Kategorien mit Ampelfarben

  | Kategorie | Bestimmt durch Fragen | Signal |
  |-----------|----------------------|--------|
  | Steuern & Recht | 4, 9 | Rot / Gelb / Grün |
  | Absicherung | 8 | Rot / Gelb / Grün |
  | Planung & Timing | 3, 5 | Rot / Gelb / Grün |
  | Familie & Umfeld | 6, 7, 10 | Rot / Gelb / Grün |

- **Erster Risikopunkt** sichtbar (z.B. "Steuern & Recht: kritisch — du hast noch keinen rechtlichen Plan")

#### Zone B — Locked (sichtbar als Teaser, Inhalt verborgen)

- "Wir haben **[X] weitere kritische Punkte** in deiner Situation identifiziert"
- 2 weitere Risikokarten: Titel lesbar, Inhalt hinter Blur/Lock
- Zeitbasierte Warnung (wenn Frage 3 Score ≥ 3):
  > *"Du planst deinen Wegzug in den nächsten 6–12 Monaten. Das bedeutet: Punkt X muss bis spätestens [Monat] geklärt sein."*

#### Zone C — CTA-Bereich

- Segment-spezifische CTA-Headline (siehe Kapitel 5)
- Was der Käufer erhält (3 konkrete Bullet Points):
  - ✓ Vollständige Risiko-Karte — alle 4 Kategorien aufgedeckt
  - ✓ Priorisierter Fahrplan: Was zuerst, was kann warten, was hat Fristen
  - ✓ PDF-Download mit deinem persönlichen Profil
- Preis: **27 €** (einmalig)
- CTA-Button (segment-spezifisch)
- Vertrauens-Element: "Sofortiger Zugang nach Zahlung · keine Mitgliedschaft · keine Abo-Falle"

---

## 7. Ampel-Logik (Risiko-Kompass-Profil)

```typescript
// /lib/scoring.ts — Ergänzung

export type RiskLevel = 'green' | 'yellow' | 'red'

export interface RiskProfile {
  steuerRecht: RiskLevel
  absicherung: RiskLevel
  planungTiming: RiskLevel
  familieUmfeld: RiskLevel
}

export function getRiskProfile(answers: number[]): RiskProfile {
  // answers[index] = Punkte für Frage index+1 (1-basiert)
  const q = (n: number) => answers[n - 1] // 1-basierte Frage-ID

  return {
    steuerRecht:   scoreToRisk(q(4), q(9)),
    absicherung:   scoreToRisk(q(8)),
    planungTiming: scoreToRisk(q(3), q(5)),
    familieUmfeld: scoreToRisk(q(6), q(7), q(10)),
  }
}

function scoreToRisk(...scores: number[]): RiskLevel {
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length
  if (avg <= 1.5) return 'red'
  if (avg <= 2.5) return 'yellow'
  return 'green'
}
```

**Ampel-Bedeutung auf der Ergebnisseite:**
- 🔴 Rot = "Kritisch — unmittelbarer Handlungsbedarf"
- 🟡 Gelb = "Prüfen — Lücke vorhanden, noch kein Notfall"
- 🟢 Grün = "Solide — weiter beobachten"

---

## 8. Unit-Tests (Referenz für QA-Agent)

```typescript
// __tests__/scoring.test.ts

describe('calculateScore', () => {
  it('returns 10 for all A answers', () => {
    expect(calculateScore([1,1,1,1,1,1,1,1,1,1])).toBe(10)
  })
  it('returns 40 for all D answers', () => {
    expect(calculateScore([4,4,4,4,4,4,4,4,4,4])).toBe(40)
  })
  it('throws for wrong length', () => {
    expect(() => calculateScore([1,2,3])).toThrow()
  })
})

describe('getSegment — Grenzwerte', () => {
  it('score 18 → dreamer', () => expect(getSegment(18)).toBe('dreamer'))
  it('score 19 → planer', () => expect(getSegment(19)).toBe('planer'))
  it('score 27 → planer', () => expect(getSegment(27)).toBe('planer'))
  it('score 28 → fortgeschrittener', () => expect(getSegment(28)).toBe('fortgeschrittener'))
  it('score 35 → fortgeschrittener', () => expect(getSegment(35)).toBe('fortgeschrittener'))
  it('score 36 → starter', () => expect(getSegment(36)).toBe('starter'))
  it('score 40 → starter', () => expect(getSegment(40)).toBe('starter'))
})
```

---

## 9. Produkt-Versprechen pro Segment (für E-Mail nach Kauf)

| Segment | E-Mail Betreff | Eröffnungssatz |
|---------|---------------|----------------|
| Träumer | Dein Auswander-Fahrplan ist da — hier startest du | Du hast den ersten Schritt gemacht. Jetzt wird es konkret. |
| Planer | Deine 3 kritischen Lücken — und wie du sie schließt | Hier sind die Punkte, die du jetzt angehen musst. |
| Fortgeschrittener | Dein persönlicher Feinplan — kein Detail vergessen | Du bist nah dran. Das hier bringt dich über die Ziellinie. |
| Starter | Dein Startfahrplan für die ersten 90 Tage | Alles auf einen Blick — was jetzt, was als nächstes. |

---

*Ende MVP.md — Version 2.0*
