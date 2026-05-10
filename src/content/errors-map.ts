export interface ErrorItem {
  title: string;
  text: string;
}

export const errorsMap: Record<string, ErrorItem[]> = {
  portugal: [
    {
      title: "GKV zu spät kündigen",
      text: "Die meisten Familien warten, bis sie den Mietvertrag in Portugal unterschrieben haben. Dann läuft die zweimonatige Kündigungsfrist oft leer — und Beiträge werden für einen Zeitraum erhoben, in dem man längst im Ausland lebt.",
    },
    {
      title: "NHR-Status nicht im ersten Jahr beantragen",
      text: "Das portugiesische Steuerregime (Non-Habitual Resident) lässt sich nicht rückwirkend aktivieren. Wer den Antrag im ersten Jahr verpasst, verliert den Status dauerhaft.",
    },
  ],
  dubai: [
    {
      title: "Steuerberatung zu spät einleiten",
      text: "Bei GmbH-Beteiligungen gibt es ein enges Zeitfenster für Gestaltungsoptionen vor dem Wegzug. Wer erst nach der Abmeldung zum Steuerberater geht, hat häufig keine Optionen mehr.",
    },
    {
      title: "UAE-Bankkonto unterschätzen",
      text: "Ein Bankkonto in den UAE zu eröffnen dauert in der Praxis 2–4 Wochen und setzt Emirates ID voraus. Wer nicht früh damit beginnt, ist in den ersten Wochen ohne funktionierende Bankverbindung.",
    },
  ],
  spanien: [
    {
      title: "Autonome Gemeinschaft nicht berücksichtigen",
      text: "Die Wahl der Region in Spanien hat steuerliche Auswirkungen, die viele erst nach dem Umzug bemerken. Madrid und Andalusien haben günstigere Rahmenbedingungen als andere Regionen.",
    },
    {
      title: "Schulanmeldung zu spät starten",
      text: "Öffentliche Schulen in Spanien melden Kinder über das Schulamt an — mit festen Anmeldefenstern Monate im Voraus. Wer zu spät kommt, findet keinen öffentlichen Schulplatz.",
    },
  ],
  suedzypern: [
    {
      title: "Wirtschaftliche Substanz unterschätzen",
      text: "Zyperns steuerliche Vorteile sind an nachweisbare wirtschaftliche Aktivität vor Ort geknüpft. Ohne echte Substanz — Büro, Mitarbeiter oder aktive Geschäftsführung — riskiert man Nachversteuerung in Deutschland.",
    },
    {
      title: "GESY-Registrierung vergessen",
      text: "Das zyprische Gesundheitssystem (GESY) muss aktiv registriert werden. Wer es vergisst, hat in der Übergangszeit keinen Krankenversicherungsschutz über das lokale System.",
    },
  ],
  nordzypern: [
    {
      title: "EU-Status-Verlust nicht einkalkuliert",
      text: "Viele unterschätzen, was es bedeutet, kein EU-Aufenthaltsrecht mehr zu haben — bei Reisen, bei Bankkonten oder bei Behördengängen im Heimatland.",
    },
    {
      title: "Bankverbindung nicht gesichert",
      text: "Nord-Zypern hat eingeschränkte internationale Bankanbindung. Wer kein funktionierendes internationales Konto (Wise, Revolut) vor dem Umzug einrichtet, hat in den ersten Monaten Liquiditätsprobleme.",
    },
  ],
  thailand: [
    {
      title: "Visa-Strategie zu spät klären",
      text: "Thailand hat kein generisches Expat-Visum. Jede Option (Elite, LTR, Retirement) hat andere Voraussetzungen. Wer die Entscheidung zu spät trifft, kann nicht pünktlich einreisen.",
    },
    {
      title: "90-Day-Reporting ignorieren",
      text: "Langzeitvisum-Inhaber müssen sich alle 90 Tage bei der Einwanderungsbehörde melden. Das Vergessen führt zu Bußgeldern — und im Wiederholungsfall zu Problemen bei der Visa-Verlängerung.",
    },
  ],
  argentinien: [
    {
      title: "DNI-Beantragung unterschätzen",
      text: "Die Beantragung des argentinischen DNI dauert in der Praxis 3–6 Monate. Viele alltägliche Transaktionen — Bankkonten, Verträge, Behördengänge — sind ohne DNI in dieser Zeit nicht möglich.",
    },
    {
      title: "Keine Übergangslösung für Bankverbindung",
      text: "Ein argentinisches Bankkonto ohne DNI ist kaum zu eröffnen. Wise als internationale Übergangslösung zu haben, ist kein Nice-to-Have, sondern notwendig.",
    },
  ],
  panama: [
    {
      title: "Bankkonto ohne lokalen Anwalt versuchen",
      text: "Panamaische Banken verlangen seit Jahren strenge KYC-Nachweise. Eine Bankkonto-Eröffnung ohne lokalen Anwalt dauert häufig Monate und scheitert regelmäßig.",
    },
    {
      title: "Cedula-Beantragung zu spät starten",
      text: "Die Cedula (Aufenthaltserlaubnis) ist Voraussetzung für fast alles — Wohnen, Telefonverträge, weitere Behördengänge. Sie muss direkt nach Einreise beantragt werden.",
    },
  ],
  usa: [
    {
      title: "FATCA und FBAR-Meldepflichten nicht kennen",
      text: "US-Steuerpflichtige (auch durch Aufenthalt) müssen ausländische Konten über bestimmten Schwellenwerten melden. Unwissen schützt nicht vor Strafen.",
    },
    {
      title: "Krankenversicherungskosten unterschätzen",
      text: "Eine seriöse private Krankenversicherung in den USA kostet für eine Familie typischerweise mehr pro Monat als viele es aus Europa kennen. Das muss im Haushaltsplan stehen, bevor man einreist.",
    },
  ],
  default: [
    {
      title: "Reihenfolge der Schritte nicht beachten",
      text: "In der Praxis scheitern Auswanderungen nicht an fehlenden Informationen — sondern daran, dass Schritte in der falschen Reihenfolge gemacht werden.",
    },
    {
      title: "Fristen zu spät prüfen",
      text: "Kündigungsfristen, Antragsfristen und Anmeldefenster haben feste Zeitpunkte. Wer zu spät startet, zahlt entweder oder verliert Optionen.",
    },
  ],
};
