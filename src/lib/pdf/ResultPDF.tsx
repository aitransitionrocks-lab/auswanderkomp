import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { RiskLevel, RiskProfile, Segment } from "@/lib/scoring";
import {
  RISK_CATEGORY_LABEL,
  RISK_LABEL,
} from "@/lib/scoring";
import type { SegmentContent } from "@/lib/segments";
import { countryLabel, type CountryCode } from "@/lib/questions";
import {
  getPriorityTasks,
  deadlineLabel,
  phaseLabel,
  prioLabel,
  type Task,
} from "./tasks-priority";

const COLORS = {
  paper: "#F3EDE2",
  ink: "#1F2A24",
  inkSoft: "#44504A",
  muted: "#7A7164",
  line: "#D8CDB8",
  fir: "#1E3A34",
  copper: "#C4926B",
  highlight: "#E8DCC2",
  riskRed: "#A33B2A",
  riskYellow: "#C4926B",
  riskGreen: "#5C8B62",
};

const styles = StyleSheet.create({
  page: {
    padding: 44,
    backgroundColor: COLORS.paper,
    fontFamily: "Helvetica",
    color: COLORS.ink,
  },
  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
  },
  brand: { fontSize: 11, color: COLORS.fir, fontWeight: 700 },
  brandSub: { fontSize: 8, color: COLORS.muted, letterSpacing: 1.2, marginTop: 2 },
  eyebrow: {
    fontSize: 9,
    color: COLORS.copper,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  segmentName: {
    fontSize: 32,
    color: COLORS.fir,
    fontWeight: 700,
    marginTop: 8,
    marginBottom: 4,
  },
  scoreLine: {
    fontSize: 11,
    color: COLORS.muted,
    marginBottom: 18,
  },
  body: {
    fontSize: 10.5,
    color: COLORS.inkSoft,
    lineHeight: 1.55,
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 10,
    color: COLORS.copper,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    fontWeight: 700,
    marginTop: 14,
    marginBottom: 8,
  },
  riskGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 18,
  },
  riskCard: {
    width: "48%",
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  riskCategory: { fontSize: 10, fontWeight: 700, color: COLORS.ink, marginBottom: 3 },
  riskLevel: { fontSize: 9, marginBottom: 0 },
  gapItem: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 5,
  },
  gapDot: { fontSize: 10, color: COLORS.copper, width: 10 },
  gapText: { fontSize: 10, color: COLORS.inkSoft, lineHeight: 1.5, flex: 1 },
  bridge: {
    fontSize: 10,
    color: COLORS.inkSoft,
    fontStyle: "italic",
    lineHeight: 1.55,
    backgroundColor: COLORS.highlight,
    padding: 10,
    borderRadius: 6,
    marginBottom: 18,
  },
  taskRow: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.line,
  },
  taskPrio: {
    fontSize: 8,
    fontWeight: 700,
    width: 50,
    paddingTop: 1,
  },
  taskBody: { flex: 1 },
  taskTitle: { fontSize: 10, color: COLORS.ink, fontWeight: 700 },
  taskDesc: { fontSize: 9, color: COLORS.inkSoft, marginTop: 1 },
  taskMeta: {
    fontSize: 8,
    color: COLORS.muted,
    marginTop: 2,
    fontStyle: "italic",
  },
  footer: {
    position: "absolute",
    bottom: 26,
    left: 44,
    right: 44,
    fontSize: 8,
    color: COLORS.muted,
    textAlign: "center",
    borderTopWidth: 0.5,
    borderTopColor: COLORS.line,
    paddingTop: 6,
  },
});

const RISK_HEX: Record<RiskLevel, string> = {
  red: COLORS.riskRed,
  yellow: COLORS.riskYellow,
  green: COLORS.riskGreen,
};

interface Props {
  segment: Segment;
  segmentContent: SegmentContent;
  score: number;
  risk: RiskProfile;
  email: string;
  country: CountryCode;
}

export function ResultPDF({
  segment,
  segmentContent,
  score,
  risk,
  email,
  country,
}: Props) {
  const tasks: Task[] = getPriorityTasks(segment, risk, country);
  const fahrplanLabel =
    country === "unklar"
      ? "Top-Prioritäten für die häufigsten Zielländer"
      : `Fahrplan für ${countryLabel(country)}`;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerBar}>
          <View>
            <Text style={styles.brand}>Auswander-Kompass</Text>
            <Text style={styles.brandSub}>ORIENTIERUNG · REIHENFOLGE · KLARHEIT</Text>
          </View>
          <Text style={[styles.brandSub, { textAlign: "right" }]}>
            Persönlicher Fahrplan
          </Text>
        </View>

        <Text style={styles.eyebrow}>DEIN SEGMENT · {segmentContent.scoreRange}</Text>
        <Text style={styles.segmentName}>{segmentContent.name}</Text>
        <Text style={styles.scoreLine}>
          Du hast {score} von 40 Punkten erreicht.
        </Text>

        <Text style={styles.body}>{segmentContent.opening}</Text>

        {/* Risk Profile */}
        <Text style={styles.sectionTitle}>Dein Risiko-Kompass</Text>
        <View style={styles.riskGrid}>
          {(
            ["steuerRecht", "absicherung", "planungTiming", "familieUmfeld"] as const
          ).map((key) => (
            <View key={key} style={styles.riskCard}>
              <Text style={styles.riskCategory}>{RISK_CATEGORY_LABEL[key]}</Text>
              <Text style={[styles.riskLevel, { color: RISK_HEX[risk[key]] }]}>
                {RISK_LABEL[risk[key]]}
              </Text>
            </View>
          ))}
        </View>

        {/* Bridge */}
        <View style={styles.bridge}>
          <Text>{segmentContent.bridge}</Text>
        </View>

        {/* Gaps */}
        <Text style={styles.sectionTitle}>Deine 3 Kernlücken</Text>
        {segmentContent.gaps.map((gap, i) => (
          <View key={i} style={styles.gapItem}>
            <Text style={styles.gapDot}>→</Text>
            <Text style={styles.gapText}>{gap}</Text>
          </View>
        ))}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            Erstellt für: {email} · auswanderkompass.de · ©{" "}
            {new Date().getFullYear()} — Dieser Bericht ersetzt keine rechtliche
            oder steuerliche Beratung.
          </Text>
        </View>
      </Page>

      {/* Page 2 — Priorisierter Fahrplan */}
      <Page size="A4" style={styles.page}>
        <View style={styles.headerBar}>
          <View>
            <Text style={styles.brand}>Auswander-Kompass</Text>
            <Text style={styles.brandSub}>PRIORISIERTER FAHRPLAN</Text>
          </View>
          <Text style={[styles.brandSub, { textAlign: "right" }]}>
            {fahrplanLabel}
          </Text>
        </View>

        <Text style={styles.eyebrow}>DEINE NÄCHSTEN SCHRITTE</Text>
        <Text style={[styles.segmentName, { fontSize: 22, marginTop: 8 }]}>
          Was zuerst, was zeitkritisch, was kann warten
        </Text>
        <Text style={styles.body}>
          Die folgende Liste ist priorisiert. {`„Kritisch"`} zuerst — diese
          Punkte dürfen nicht aufgeschoben werden. Fristen sind Richtwerte und können
          sich je nach Zielland verschieben.
        </Text>

        {tasks.map((t, i) => (
          <View key={i} style={styles.taskRow}>
            <Text
              style={[
                styles.taskPrio,
                {
                  color:
                    t.prio === "kritisch"
                      ? COLORS.riskRed
                      : t.prio === "wichtig"
                      ? COLORS.copper
                      : COLORS.riskGreen,
                },
              ]}
            >
              {prioLabel(t.prio).toUpperCase()}
            </Text>
            <View style={styles.taskBody}>
              <Text style={styles.taskTitle}>{t.title}</Text>
              <Text style={styles.taskDesc}>{t.desc}</Text>
              <Text style={styles.taskMeta}>
                {phaseLabel(t.phase)} · {deadlineLabel(t.deadlineDays)}
              </Text>
            </View>
          </View>
        ))}

        <View style={styles.footer}>
          <Text>
            auswanderkompass.de · Reihenfolge entscheidet · Bei rechtlichen oder
            steuerlichen Fragen bitte qualifizierte Fachpersonen konsultieren.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
