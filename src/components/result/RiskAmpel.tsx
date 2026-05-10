import type { RiskLevel, RiskProfile } from "@/lib/quiz-logic";

interface TileProps {
  label: string;
  level: RiskLevel;
  note: string;
}

const LEVEL_LABEL: Record<RiskLevel, string> = {
  rot: "Dringender Handlungsbedarf",
  gelb: "Mittelfristige Klärung nötig",
  gruen: "Unkritisch für Ihr Profil",
};

const LEVEL_STYLES: Record<RiskLevel, string> = {
  rot: "bg-risk-redBg border-risk-red text-risk-red",
  gelb: "bg-risk-yellowBg border-risk-yellow text-risk-yellow",
  gruen: "bg-risk-greenBg border-risk-green text-risk-green",
};

function Tile({ label, level, note }: TileProps) {
  return (
    <div
      className={`rounded-xl border p-5 ${LEVEL_STYLES[level]}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span
          className={`inline-block w-3 h-3 rounded-full ${
            level === "rot"
              ? "bg-risk-red"
              : level === "gelb"
              ? "bg-risk-yellow"
              : "bg-risk-green"
          }`}
        />
        <h3 className="font-display font-bold text-sm tracking-wide uppercase">
          {label}
        </h3>
      </div>
      <p className="font-semibold mb-2 text-base">{LEVEL_LABEL[level]}</p>
      <p className="text-gray-700 text-sm leading-relaxed">{note}</p>
    </div>
  );
}

function noteFor(
  category: "steuer" | "kv" | "buerokratie" | "familie",
  level: RiskLevel
): string {
  const NOTES: Record<string, Record<RiskLevel, string>> = {
    steuer: {
      rot: "GmbH-Beteiligung + Wegzug = §6 AStG ist aktiv. Das ist kein Spezialfall, sondern der Standardfall.",
      gelb: "Ihre Struktur ist nicht kritisch, aber nicht automatisch steuerneutral — Einzelprüfung empfohlen.",
      gruen: "Angestellten- oder Freelancer-Profil ohne Beteiligungen — steuerlich überschaubar.",
    },
    kv: {
      rot: "GKV + Umzug in weniger als 3 Monaten = die zweimonatige Kündigungsfrist ist bereits eng.",
      gelb: "GKV + mittelfristiger Umzug — Kündigungsfrist muss jetzt geplant werden, nicht später.",
      gruen: "PKV oder längerer Vorlauf — keine akute Bruchstelle.",
    },
    buerokratie: {
      rot: "Umzug in unter 2 Monaten — Anmeldungen, Visa und Schule laufen parallel statt seriell.",
      gelb: "Umzug in 3–5 Monaten — einige Behördenschritte brauchen Vorlauf, der jetzt beginnt.",
      gruen: "Ausreichend Vorlaufzeit für alle Behördenschritte in der richtigen Reihenfolge.",
    },
    familie: {
      rot: "Getrennte Elternschaft + Kinder — die Zustimmung des anderen Elternteils ist rechtlich erforderlich.",
      gelb: "Kinder + knapper Zeitplan — Schulanmeldung und Beglaubigungen brauchen Vorlauf.",
      gruen: "Keine Kinder oder ausreichend Zeit für Schul- und Betreuungsplanung.",
    },
  };
  return NOTES[category][level];
}

export function RiskAmpel({ risk }: { risk: RiskProfile }) {
  return (
    <section className="max-w-3xl mx-auto px-6 py-6">
      <h2 className="font-display font-bold text-xl text-navy mb-2">
        Ihr persönliches Risikoprofil
      </h2>
      <p className="text-gray-500 mb-6">
        Vier Bereiche, in denen Auswanderungen am häufigsten scheitern. So
        sehen sie für Ihre Situation aus:
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Tile label="Steuer" level={risk.steuer} note={noteFor("steuer", risk.steuer)} />
        <Tile
          label="Krankenversicherung"
          level={risk.kv}
          note={noteFor("kv", risk.kv)}
        />
        <Tile
          label="Bürokratie"
          level={risk.buerokratie}
          note={noteFor("buerokratie", risk.buerokratie)}
        />
        <Tile
          label="Familie"
          level={risk.familie}
          note={noteFor("familie", risk.familie)}
        />
      </div>
    </section>
  );
}
