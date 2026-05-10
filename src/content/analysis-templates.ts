export const analysisTemplates: Record<string, string> = {
  // Portugal
  portugal_freelancer_konkret:
    "Basierend auf Ihren Angaben planen Sie mit {{childrenCount}} Kind(ern) den Umzug nach Portugal in etwa {{dDayMonths}} Monaten. Als Freiberufler ohne Unternehmensanteile ist Ihre steuerliche Ausgangslage überschaubar. Die zwei Bereiche, die in dieser Konstellation erfahrungsgemäß am häufigsten unterschätzt werden, sind die GKV-Kündigungsfrist und die Schulanmeldung.",
  portugal_freelancer_ready:
    "Basierend auf Ihren Angaben haben Sie noch etwa {{dDayMonths}} Monate bis zum Umzug nach Portugal. Bei diesem Zeitplan gibt es Fristen, die nicht mehr verschoben werden können — insbesondere die GKV-Kündigung und die Schulanmeldung für Ihre Kinder.",
  portugal_freelancer_plant:
    "Basierend auf Ihren Angaben haben Sie noch etwa {{dDayMonths}} Monate bis zum geplanten Umzug nach Portugal. Das ist ausreichend Zeit — wenn Sie jetzt mit der Strukturierung beginnen. Erfahrungsgemäß brauchen GKV, NHR-Antrag und Schulrecherche am meisten Vorlauf.",
  portugal_gmbh_konkret:
    "Basierend auf Ihren Angaben planen Sie mit GmbH-Beteiligung den Umzug nach Portugal in etwa {{dDayMonths}} Monaten. Das ist die Kombination, bei der in der Praxis am häufigsten steuerliche Fragen entstehen. Der wichtigste erste Schritt: einen auf Portugal spezialisierten Steuerberater kontaktieren — sowohl für §6 AStG als auch für die NHR-Antragsstrategie.",
  portugal_gmbh_ready:
    "Basierend auf Ihren Angaben ziehen Sie mit GmbH-Beteiligung nach Portugal in etwa {{dDayMonths}} Monaten. Das Zeitfenster für steuerliche Gestaltungsoptionen ist bei diesem Zeitplan eng. In der Praxis ist Steuerberatung hier nicht optional.",
  portugal_employed_konkret:
    "Basierend auf Ihren Angaben planen Sie als Angestellte(r) den Umzug nach Portugal in etwa {{dDayMonths}} Monaten. Ihre Situation ist steuerlich überschaubar. Die wichtigsten offenen Punkte: GKV-Kündigung, NHR-Antrag und Schulplanung.",

  // Dubai
  dubai_gmbh_konkret:
    "Basierend auf Ihren Angaben planen Sie mit GmbH-Beteiligung den Umzug nach Dubai in etwa {{dDayMonths}} Monaten. Das ist die Kombination, bei der in der Praxis am häufigsten steuerliche Überraschungen entstehen — nicht weil das Recht unklar ist, sondern weil der richtige Zeitpunkt für Beratung sehr eng ist.",
  dubai_gmbh_ready:
    "Basierend auf Ihren Angaben ziehen Sie mit GmbH-Beteiligung nach Dubai in etwa {{dDayMonths}} Monaten. Bei diesem Zeitplan ist das Fenster für Steuergestaltung eng. §6 AStG kann bei GmbH-Beteiligungen eine erhebliche Steuerforderung auslösen — eine Prüfung in den nächsten Wochen ist dringend empfohlen.",
  dubai_freelancer_konkret:
    "Basierend auf Ihren Angaben planen Sie als Freiberufler den Umzug nach Dubai in etwa {{dDayMonths}} Monaten. Ohne GmbH-Beteiligung ist Ihre steuerliche Ausgangslage gut. Die offenen Punkte: Visa-Strategie (Freezone vs. Mainland), GKV-Kündigung und UAE-Bankkonto.",
  dubai_employed_konkret:
    "Basierend auf Ihren Angaben planen Sie als Angestellte(r) den Umzug nach Dubai in etwa {{dDayMonths}} Monaten. Die wichtigsten Schritte: Residency Visa, Emirates ID, internationale Krankenversicherung und — falls Kinder — Schulrecherche.",

  // Spanien
  spanien_freelancer_konkret:
    "Basierend auf Ihren Angaben planen Sie als Freiberufler den Umzug nach Spanien in etwa {{dDayMonths}} Monaten. Relevante Besonderheit: Die Wahl der autonomen Gemeinschaft hat steuerliche Auswirkungen — Andalusien und Madrid bieten günstigere Rahmenbedingungen.",
  spanien_gmbh_konkret:
    "Basierend auf Ihren Angaben planen Sie mit GmbH-Beteiligung den Umzug nach Spanien. DBA Deutschland-Spanien ist vorhanden, aber eine §6 AStG-Prüfung ist trotzdem nötig. Steuerberater-Termin zeitnah empfohlen.",
  spanien_employed_konkret:
    "Basierend auf Ihren Angaben planen Sie als Angestellte(r) den Umzug nach Spanien in etwa {{dDayMonths}} Monaten. Ihre Situation ist steuerlich überschaubar. Die offenen Punkte: NIE-Nummer, Empadronamiento und — falls Kinder — Schulanmeldung.",

  // Süd-Zypern
  suedzypern_gmbh_konkret:
    "Basierend auf Ihren Angaben planen Sie mit GmbH-Beteiligung den Umzug nach Süd-Zypern. Die steuerlichen Vorteile Zyperns (12,5% Körperschaftsteuer) sind real — aber an echte wirtschaftliche Präsenz vor Ort geknüpft. Steuerliche Gestaltung sollte vor dem Umzug abgeschlossen sein.",
  suedzypern_freelancer_konkret:
    "Basierend auf Ihren Angaben planen Sie als Freiberufler den Umzug nach Süd-Zypern. Als EU-Bürger brauchen Sie keine Einreisegenehmigung, aber nach 3 Monaten ist die EU-Resident-Registrierung Pflicht. Offene Punkte: TIC-Nummer, Bankverbindung und GESY-Registrierung.",

  // Thailand
  thailand_freelancer_konkret:
    "Basierend auf Ihren Angaben planen Sie als Freiberufler den Umzug nach Thailand. Die Visa-Strategie ist hier die kritischste Entscheidung: Thailand Elite Visa, LTR Visa oder Retirement Visa haben sehr unterschiedliche Voraussetzungen und Kosten.",
  thailand_employed_plant:
    'Basierend auf Ihren Angaben planen Sie den Umzug nach Thailand. Mit noch {{dDayMonths}} Monaten Zeit ist der wichtigste erste Schritt die Visa-Strategie. In Thailand gibt es keinen einfachen „Expat-Aufenthalt" — jede Visa-Option hat spezifische Anforderungen.',

  // USA
  usa_gmbh_konkret:
    "Basierend auf Ihren Angaben planen Sie mit GmbH-Beteiligung den Umzug in die USA. Das ist steuerlich eine der komplexesten Konstellationen überhaupt: FATCA, FBAR-Meldepflichten und US-Steuerpflicht durch Aufenthaltsstatus erfordern frühzeitige Beratung durch einen US-deutschen Steuerberater.",
  usa_freelancer_konkret:
    "Basierend auf Ihren Angaben planen Sie als Freiberufler den Umzug in die USA. Die Visa-Strategie steht ganz vorne: O-1, E-2 und EB-2 NIW haben sehr unterschiedliche Anforderungen. Dazu kommt die private Krankenversicherung — das teuerste Element in den USA.",

  // Länder-Defaults (wenn keine Kombi passt)
  portugal_default:
    "Basierend auf Ihren Angaben planen Sie den Umzug nach Portugal. Die wichtigsten offenen Punkte: GKV-Kündigung, NHR-Antrag und — je nach Familie — Schulrecherche.",
  dubai_default:
    "Basierend auf Ihren Angaben planen Sie den Umzug nach Dubai. Die Kernthemen: Residency Visa, Emirates ID, Krankenversicherung und — bei GmbH-Beteiligung — eine §6-AStG-Prüfung.",
  spanien_default:
    "Basierend auf Ihren Angaben planen Sie den Umzug nach Spanien. Zentrale Schritte: NIE-Nummer, Wahl der autonomen Gemeinschaft, Empadronamiento und Krankenversicherung.",
  suedzypern_default:
    "Basierend auf Ihren Angaben planen Sie den Umzug nach Süd-Zypern. Wichtige Schritte: EU-Resident-Registrierung, TIC-Nummer und GESY-Anmeldung.",
  nordzypern_default:
    "Basierend auf Ihren Angaben planen Sie den Umzug nach Nord-Zypern. Wichtig: Nord-Zypern ist nicht EU — Sie verlieren EU-Rechte und brauchen eine lokale Aufenthaltserlaubnis. Bankverbindungen sind international eingeschränkt. Eine realistische Einschätzung vor dem Umzug ist wichtig.",
  thailand_default:
    "Basierend auf Ihren Angaben planen Sie den Umzug nach Thailand. Die Visa-Entscheidung (Elite, LTR, Retirement) ist die kritischste erste Frage — danach folgen Krankenversicherung und Banking.",
  argentinien_default:
    "Basierend auf Ihren Angaben planen Sie den Umzug nach Argentinien. Die wichtigsten offenen Punkte: Aufenthaltsstrategie (Rentista-Visa), Wechselkurs-Strategie und DNI-Beantragung. Steuerlich gibt es kein vollständiges DBA — Einzelfallprüfung empfohlen.",
  panama_default:
    "Basierend auf Ihren Angaben planen Sie den Umzug nach Panama. Das Friendly Nations Visa macht Deutschland zu einem berechtigten Herkunftsland. Die offenen Punkte: Bankkonto-Eröffnung (strenge KYC), Cedula und Aufenthaltserlaubnis.",
  usa_default:
    "Basierend auf Ihren Angaben planen Sie den Umzug in die USA. Zentrale erste Schritte: Visa-Wahl (O-1, E-2, EB-2), Krankenversicherung und — bei Beteiligungen — FATCA/FBAR-Klärung.",

  // Segment-Defaults
  unklar:
    "Basierend auf Ihren Angaben haben Sie Zielland und Zeitraum noch nicht festgelegt. Das ist kein Problem — es ist der normale Ausgangspunkt. Relevant ist jetzt, welche Länder zu Ihrer Situation passen, bevor Sie vertiefen.",
  plant:
    "Basierend auf Ihren Angaben sind Sie in der Planungsphase. Sie haben noch genug Zeit — wenn die richtigen Schritte jetzt in den richtigen Wochen beginnen.",
  konkret:
    "Basierend auf Ihren Angaben ist Ihr Umzug konkret. In dieser Phase entscheidet weniger die Menge an Information, sondern die Reihenfolge der Schritte.",
  ready:
    "Basierend auf Ihren Angaben sind Sie kurz vor dem Umzug. Bei diesem Zeitplan sind manche Entscheidungen nicht mehr verhandelbar.",

  // Globaler Fallback
  default:
    "Basierend auf Ihren Angaben haben wir Ihre Situation eingeschätzt. Unten sehen Sie Ihr persönliches Risikoprofil und Ihre wichtigsten nächsten Schritte.",
};
