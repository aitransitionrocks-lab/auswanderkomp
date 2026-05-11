import {
  RISK_CATEGORY_LABEL,
  RISK_CATEGORY_HINT,
  RISK_LABEL,
  type RiskProfile,
  type RiskLevel,
} from "@/lib/scoring";

const STYLES: Record<RiskLevel, { bg: string; text: string; dot: string; label: string }> = {
  red: {
    bg: "bg-[#F4DCD7]",
    text: "text-riskRed",
    dot: "bg-riskRed",
    label: "Kritisch",
  },
  yellow: {
    bg: "bg-highlight",
    text: "text-copper-deep",
    dot: "bg-copper",
    label: "Prüfen",
  },
  green: {
    bg: "bg-[#DDE8DD]",
    text: "text-riskGreen",
    dot: "bg-riskGreen",
    label: "Solide",
  },
};

type CategoryKey = keyof RiskProfile;

export function RiskCompass({ risk }: { risk: RiskProfile }) {
  const items: CategoryKey[] = [
    "steuerRecht",
    "absicherung",
    "planungTiming",
    "familieUmfeld",
  ];
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {items.map((key) => {
        const lvl = risk[key];
        const s = STYLES[lvl];
        return (
          <div
            key={key}
            className={`p-5 rounded-card border border-line ${s.bg}`}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <span className={`w-2.5 h-2.5 rounded-pill ${s.dot}`} />
              <span className={`text-[11px] uppercase tracking-[0.12em] font-medium ${s.text}`}>
                {s.label}
              </span>
            </div>
            <h3 className="font-serif text-[18px] text-ink tracking-tight mb-1">
              {RISK_CATEGORY_LABEL[key]}
            </h3>
            <p className="text-[13.5px] text-inkSoft leading-[1.5] mb-2">
              {RISK_CATEGORY_HINT[key]}
            </p>
            <p className={`text-[12px] ${s.text}`}>{RISK_LABEL[lvl]}</p>
          </div>
        );
      })}
    </div>
  );
}
