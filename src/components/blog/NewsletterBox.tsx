// MVP: enabled=false → rendert nichts. Später auf Resend Audiences wiren.
interface Props {
  enabled?: boolean;
  title?: string;
  description?: string;
}

export function NewsletterBox({
  enabled = false,
  title = "Hol dir die kostenlose Auswanderer-Checkliste",
  description = "Die wichtigsten Schritte in der richtigen Reihenfolge — direkt in dein Postfach.",
}: Props) {
  if (!enabled) return null;

  return (
    <div className="rounded-card border border-line bg-paperAlt p-6">
      <h3 className="font-serif text-[18px] text-fir mb-2">{title}</h3>
      <p className="text-[14px] text-inkSoft leading-[1.5] mb-4">
        {description}
      </p>
      {/* later: action="/api/newsletter-signup" */}
      <form className="flex flex-col gap-2">
        <input
          type="email"
          required
          placeholder="name@beispiel.de"
          className="px-4 py-2.5 rounded-card border-2 border-line focus:border-fir focus:outline-none text-[14px]"
        />
        <button
          type="submit"
          className="px-5 py-2.5 bg-fir text-paper rounded-pill font-medium text-[14px] hover:bg-fir-deep transition-colors"
        >
          Eintragen
        </button>
      </form>
    </div>
  );
}
