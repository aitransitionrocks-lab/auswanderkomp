type CalloutType = "info" | "tipp" | "warnung";

const STYLES: Record<CalloutType, { box: string; label: string; title: string }> = {
  info: { box: "bg-paperAlt border-line", label: "text-fir", title: "Info" },
  tipp: { box: "bg-[#DDE8DD] border-riskGreen/40", label: "text-riskGreen", title: "Tipp" },
  warnung: { box: "bg-highlight border-copper/50", label: "text-copper-deep", title: "Achtung" },
};

export function Callout({
  type = "info",
  title,
  children,
}: {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
}) {
  const s = STYLES[type];
  return (
    <div className={`my-6 rounded-card border px-5 py-4 ${s.box}`}>
      <div className={`text-[11px] uppercase tracking-[0.12em] font-medium mb-1.5 ${s.label}`}>
        {title ?? s.title}
      </div>
      <div className="text-[15px] leading-[1.6] text-ink [&>p]:m-0">
        {children}
      </div>
    </div>
  );
}
