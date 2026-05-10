export interface RiskItem {
  label: string;
  text: string;
}

export const risksMap: Record<string, RiskItem[]> = {
  portugal: [
    {
      label: "GKV-Timing",
      text: "Bei Ihrem Zeitplan ist die GKV-Kündigungsfrist bereits eng. In der Praxis bedeutet das: Kündigung diese Woche einleiten oder Beiträge für Zeit im Ausland in Kauf nehmen.",
    },
    {
      label: "NHR-Antrag",
      text: "Das NHR-Regime muss im ersten Jahr der steuerlichen Ansässigkeit in Portugal beantragt werden. Bei einem Umzug in {{dDayMonths}} Monaten ist das machbar — aber nicht mehr aufschiebbar.",
    },
  ],
  dubai: [
    {
      label: "Steuergestaltung GmbH",
      text: "Bei GmbH-Beteiligungen und Ihrem Zeitplan ist das Fenster für steuerliche Gestaltungsoptionen eng. Eine Beratung in den nächsten zwei Wochen ist realistisch und empfohlen.",
    },
    {
      label: "Emirates ID Vorlaufzeit",
      text: "Die Emirates ID benötigt 1–3 Wochen nach Visum-Ausstellung. Ohne Emirates ID sind Bankkonto, Schulanmeldung und Wohnungsvertrag nicht möglich. Zeitplanung ist kritisch.",
    },
  ],
  spanien: [
    {
      label: "Schulanmeldung",
      text: "Bei Ihrem Zeitplan sollte die Schulrecherche diese Woche starten. Öffentliche Schulen in Spanien melden über das Schulamt an — mit Fristen, die Wochen im Voraus liegen.",
    },
    {
      label: "NIE-Nummer",
      text: "Die spanische Ausländer-Identifikationsnummer (NIE) ist Voraussetzung für Mietvertrag, Bankkonto und Schulanmeldung. Beantragung auf dem spanischen Konsulat vor Einreise ist möglich.",
    },
  ],
  suedzypern: [
    {
      label: "Non-Dom-Antrag",
      text: "Der Non-Dom-Status ist das zentrale steuerliche Element in Zypern. Bei Ihrem Zeitplan sollte die Antragstellung in den ersten Wochen nach Ankunft erfolgen.",
    },
  ],
  nordzypern: [
    {
      label: "EU-Rechte-Verlust",
      text: "Bei Ihrem Zeitplan ist eine realistische Einschätzung der eingeschränkten EU-Rechte vor dem Umzug wichtig — inklusive Auswirkungen auf Bankkonten und Reisen.",
    },
  ],
  thailand: [
    {
      label: "Visa-Entscheidung",
      text: "Ohne bestätigte Visa-Strategie kann die Einreise nicht geplant werden. Bei Ihrem Zeitplan sollte die Entscheidung (Elite vs. LTR) in den nächsten Wochen fallen.",
    },
  ],
  argentinien: [
    {
      label: "Devisenstrategie",
      text: "Bei Ihrem Zeitplan sollte die Wechselkurs- und Banking-Strategie (Wise, Krypto, Blue Dollar) vor dem Umzug geklärt sein — ohne das sind die ersten Wochen schwierig.",
    },
  ],
  panama: [
    {
      label: "Anwaltsterminierung",
      text: "Bei Ihrem Zeitplan sollte der lokale Anwalt für Cedula und Bankkonto in den nächsten Wochen beauftragt werden — ohne das verzögern sich fast alle Folgeschritte.",
    },
  ],
  usa: [
    {
      label: "Visa-Vorlaufzeit",
      text: "US-Visa-Verfahren dauern typischerweise 3–6 Monate. Bei Ihrem Zeitplan ist eine sofortige Einleitung des Verfahrens notwendig.",
    },
    {
      label: "Steuerberater USA-DE",
      text: "Für einen US-Umzug mit FATCA-Relevanz sollte ein auf USA-Deutschland spezialisierter Steuerberater eingebunden werden — am besten noch vor dem Auszug aus Deutschland.",
    },
  ],
  default: [
    {
      label: "Zeitplan",
      text: "Bei Ihrem Zeitplan sollten die kritischen Schritte in den nächsten Wochen beginnen. Was konkret das sind, sehen Sie in Ihrem vollständigen Fahrplan.",
    },
  ],
};
