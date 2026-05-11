import type { Segment } from "./scoring";

export interface SegmentContent {
  id: Segment;
  scoreRange: string;
  name: string;
  opening: string;
  bridge: string;
  gaps: [string, string, string];
  ctaHeadline: string;
  ctaButton: string;
  emailSubject: string;
  emailOpening: string;
}

export const SEGMENTS: Record<Segment, SegmentContent> = {
  dreamer: {
    id: "dreamer",
    scoreRange: "10–18 Punkte",
    name: "Der Träumer",
    opening:
      "Du bist ein Träumer — und das ist deine größte Stärke. Dein Ergebnis zeigt: Der Wunsch, auszuwandern, ist in dir — aber der erste konkrete Schritt fehlt noch. Das ist kein Problem. Das ist der normalste Ausgangspunkt der Welt. Die meisten Menschen, die heute glücklich im Ausland leben, haben genau hier angefangen: mit einem Traum und einem großen Fragezeichen dahinter.",
    bridge:
      "Was dich aktuell bremst, ist kein fehlendes Geld und kein fehlendes Können. Es ist das Fehlen eines klaren Fahrplans — und die Angst, beim ersten Schritt einen Fehler zu machen, den du nicht rückgängig machen kannst.",
    gaps: [
      'Du brauchst zuerst Klarheit über dein Zielland und dein konkretes „Warum" — ohne das dreht sich jede Recherche im Kreis.',
      "Die steuerlichen und rechtlichen Grundlagen musst du kennen, bevor du irgendeine Entscheidung triffst — sonst kostet dich Unwissenheit später viel Geld.",
      "Du brauchst einen Zeitplan — auch wenn er noch grob ist.",
    ],
    ctaHeadline: "Fang heute an — mit dem Auswander-Kompass.",
    ctaButton: "Auswander-Kompass freischalten — 27 €",
    emailSubject: "Dein Auswander-Fahrplan ist da — hier startest du",
    emailOpening: "Du hast den ersten Schritt gemacht. Jetzt wird es konkret.",
  },
  planer: {
    id: "planer",
    scoreRange: "19–27 Punkte",
    name: "Der Planer",
    opening:
      "Du denkst in die richtige Richtung — aber deine Antworten zeigen 3–4 kritische Lücken, die teuer werden können. Besonders bei Steuern, Versicherung und dem richtigen Setup. Jetzt ist genau der richtige Moment, sie zu schließen — bevor sie dich einholen.",
    bridge:
      "Du hast die erste Phase hinter dir: den Entschluss. Was jetzt fehlt, ist die Struktur. Viele in deiner Situation recherchieren parallel auf 10 verschiedenen Kanälen — YouTube, Reddit, Foren — und verlieren dabei das Wesentliche aus dem Blick: die richtige Reihenfolge.",
    gaps: [
      "Deine steuerliche und rechtliche Situation ist noch nicht konkret bewertet — das ist das größte finanzielle Risiko in deiner Phase.",
      "Dein Zeitplan ist unklar oder zu vage — ohne Datum laufen Fristen unbemerkt ab.",
      "Die Koordination der einzelnen Schritte fehlt — wer macht was, bis wann?",
    ],
    ctaHeadline: "Schließ die Lücken, bevor sie dich einholen.",
    ctaButton: "Jetzt Lücken schließen — 27 €",
    emailSubject: "Deine 3 kritischen Lücken — und wie du sie schließt",
    emailOpening: "Hier sind die Punkte, die du jetzt angehen musst.",
  },
  fortgeschrittener: {
    id: "fortgeschrittener",
    scoreRange: "28–35 Punkte",
    name: "Der Fortgeschrittene",
    opening:
      "Du bist weiter als 80% derer, die über Auswandern nachdenken. Das zeigt dein Score. Jetzt geht es nicht mehr um den Überblick — sondern um die Details, die den Unterschied zwischen einem stressfreien Start und teuren Überraschungen ausmachen.",
    bridge:
      "In deiner Phase entstehen die meisten Fehler nicht aus Unwissen — sondern aus falscher Priorisierung. Du weißt, was zu tun ist. Die Frage ist: in welcher Reihenfolge, und bis wann?",
    gaps: [
      "Einzelne Lücken — oft genau dort, wo du dich am sichersten fühlst — können das gesamte Setup teurer machen.",
      "Die zeitliche Taktung der Schritte ist entscheidend: ein zu früher oder zu später Schritt kostet.",
      "Die Koordination zwischen deinen Experten (Steuerberater, Anwalt, Bank) läuft oft nicht von selbst.",
    ],
    ctaHeadline: "Vervollständige deinen Plan — kein Detail vergessen.",
    ctaButton: "Plan vervollständigen — 27 €",
    emailSubject: "Dein persönlicher Feinplan — kein Detail vergessen",
    emailOpening: "Du bist nah dran. Das hier bringt dich über die Ziellinie.",
  },
  starter: {
    id: "starter",
    scoreRange: "36–40 Punkte",
    name: "Der Starter",
    opening:
      "Respekt — du hast dich ernsthaft vorbereitet. Dein Score zeigt, dass du die Grundlagen hast. Was du jetzt brauchst, ist kein weiterer Überblick. Sondern deinen finalen, persönlichen Aktionsplan: Was genau, in welcher Reihenfolge, bis wann.",
    bridge:
      'In deiner Phase ist der häufigste Fehler: zu lange warten, weil „noch nicht alles perfekt ist." Der Kompass zeigt dir, was wirklich noch fehlt — und was bereits erledigt ist.',
    gaps: [
      "Den finalen Check aller zeitkritischen Fristen — damit kurz vor dem Wegzug nichts mehr offenbleibt.",
      "Den vollständigen Überblick über deine deutsche Seite: Verträge, Versicherungen, Abmeldung.",
      "Den personalisierten Startfahrplan für die ersten 90 Tage nach dem Umzug.",
    ],
    ctaHeadline: "Hole dir deinen persönlichen Startfahrplan.",
    ctaButton: "Startfahrplan freischalten — 27 €",
    emailSubject: "Dein Startfahrplan für die ersten 90 Tage",
    emailOpening: "Alles auf einen Blick — was jetzt, was als nächstes.",
  },
};
