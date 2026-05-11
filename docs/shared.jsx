// Shared design tokens and primitives for Auswanderkompass landingpage.
// Two palette schemes ("forest" = tannengrün + kupfer, "clay" = terrakotta + creme)
// and shared small UI (Button, Stat, FAQ, Modal).

const AK_PALETTES = {
  forest: {
    name: 'Tannengrün · Kupfer',
    bg: '#f3ede2',          // warm cream paper
    bgAlt: '#ebe3d3',        // slightly deeper cream
    ink: '#1f2a24',          // near-black with green undertone
    inkSoft: '#44504a',
    muted: '#7a7164',
    line: '#d8cdb8',
    primary: '#1e3a34',      // deep fir green
    primaryInk: '#f3ede2',
    accent: '#c4926b',       // warm copper
    accentDeep: '#a67353',
    highlight: '#e8dcc2',
  },
  clay: {
    name: 'Terrakotta · Ton',
    bg: '#f5ece0',
    bgAlt: '#ece0cf',
    ink: '#2a201a',
    inkSoft: '#4c3d32',
    muted: '#8a7a68',
    line: '#ddcfb9',
    primary: '#9a4a2b',      // terracotta
    primaryInk: '#f9f2e6',
    accent: '#486b52',       // sage for contrast
    accentDeep: '#314a39',
    highlight: '#ecd9b8',
  },
};

// Density presets control vertical rhythm + section padding.
const AK_DENSITY = {
  compact:  { sec: 72,  gap: 20, lead: 1.45 },
  regular:  { sec: 112, gap: 28, lead: 1.55 },
  comfy:    { sec: 160, gap: 36, lead: 1.65 },
};

// ───────────────────────────────────────────────
// Compass glyph — custom SVG, used across variants
// ───────────────────────────────────────────────
function CompassGlyph({ size = 44, stroke = 'currentColor', accent, style }) {
  const s = size;
  const acc = accent || stroke;
  return (
    <svg width={s} height={s} viewBox="0 0 60 60" fill="none" style={style}
         xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="30" cy="30" r="27" stroke={stroke} strokeWidth="1" opacity="0.45" />
      <circle cx="30" cy="30" r="22" stroke={stroke} strokeWidth="1" opacity="0.25" />
      {/* tick marks at N/E/S/W */}
      <line x1="30" y1="3" x2="30" y2="7" stroke={stroke} strokeWidth="1.2" />
      <line x1="30" y1="53" x2="30" y2="57" stroke={stroke} strokeWidth="1" opacity="0.5" />
      <line x1="3" y1="30" x2="7" y2="30" stroke={stroke} strokeWidth="1" opacity="0.5" />
      <line x1="53" y1="30" x2="57" y2="30" stroke={stroke} strokeWidth="1" opacity="0.5" />
      {/* needle */}
      <path d="M30 10 L34 30 L30 28 L26 30 Z" fill={acc} />
      <path d="M30 50 L26 30 L30 32 L34 30 Z" fill={stroke} opacity="0.55" />
      <circle cx="30" cy="30" r="1.8" fill={stroke} />
    </svg>
  );
}

// Small inline arrow used in CTAs
function Arrow({ size = 14, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" style={style} aria-hidden="true">
      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4"
            strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Wave/path divider — subtle, warm, used between sections
function RouteLine({ color = 'currentColor', style }) {
  return (
    <svg viewBox="0 0 800 40" preserveAspectRatio="none"
         style={{ width: '100%', height: 28, display: 'block', ...style }}
         aria-hidden="true">
      <path d="M0 20 Q 100 4 200 20 T 400 20 T 600 20 T 800 20"
            stroke={color} strokeWidth="1" fill="none" strokeDasharray="2 4" opacity="0.5" />
    </svg>
  );
}

// ───────────────────────────────────────────────
// Primary CTA button (shared across variants)
// ───────────────────────────────────────────────
function PrimaryCTA({ palette, onClick, children, variant = 'filled', size = 'lg' }) {
  const p = palette;
  const big = size === 'lg';
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 10,
    padding: big ? '18px 28px' : '12px 20px',
    fontSize: big ? 17 : 14.5,
    fontFamily: 'inherit',
    fontWeight: 500,
    letterSpacing: '-0.005em',
    borderRadius: 999,
    cursor: 'pointer',
    border: 'none',
    transition: 'transform .15s ease, box-shadow .15s ease, background .15s ease',
  };
  const filled = {
    background: p.primary,
    color: p.primaryInk,
    boxShadow: `0 1px 0 rgba(255,255,255,.25) inset, 0 10px 24px -12px ${p.primary}`,
  };
  const ghost = {
    background: 'transparent',
    color: p.primary,
    border: `1px solid ${p.primary}`,
  };
  return (
    <button
      onClick={onClick}
      style={{ ...base, ...(variant === 'filled' ? filled : ghost) }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      {children}
      <Arrow size={big ? 16 : 13} />
    </button>
  );
}

// ───────────────────────────────────────────────
// Modal – placeholder for the 10-question assessment
// ───────────────────────────────────────────────
function AssessmentModal({ open, onClose, palette }) {
  if (!open) return null;
  const p = palette;
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 90,
        background: 'rgba(20,16,10,0.42)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 32,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(560px, 100%)',
          background: p.bg,
          color: p.ink,
          borderRadius: 20,
          padding: '40px 44px 36px',
          boxShadow: '0 40px 80px -20px rgba(20,16,10,.45)',
          border: `1px solid ${p.line}`,
          fontFamily: 'inherit',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          aria-label="Schließen"
          style={{
            position: 'absolute', top: 18, right: 18,
            width: 32, height: 32, borderRadius: 999,
            border: 'none', background: 'transparent', cursor: 'pointer',
            color: p.inkSoft, fontSize: 20, lineHeight: 1,
          }}
        >×</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <CompassGlyph size={30} stroke={p.primary} accent={p.accent} />
          <div style={{ fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase',
                        color: p.muted, fontWeight: 500 }}>
            Einschätzung · Frage 1 von 10
          </div>
        </div>
        <h2 style={{
          fontFamily: 'var(--ak-serif, Georgia, serif)',
          fontWeight: 400,
          fontSize: 32,
          lineHeight: 1.15,
          margin: '0 0 8px',
          letterSpacing: '-0.02em',
          color: p.ink,
        }}>
          In welches Land möchtest du auswandern?
        </h2>
        <p style={{ color: p.inkSoft, margin: '0 0 28px', fontSize: 15.5, lineHeight: 1.55 }}>
          Das Zielland bestimmt Visumsprozess, Fristen und viele der folgenden Fragen.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28 }}>
          {['Schweiz', 'Österreich', 'Portugal', 'Spanien', 'Kanada', 'Anderes Land'].map((c) => (
            <button key={c} style={{
              padding: '14px 16px',
              textAlign: 'left',
              background: 'transparent',
              color: p.ink,
              border: `1px solid ${p.line}`,
              borderRadius: 10,
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 14.5,
              transition: 'background .15s, border-color .15s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = p.bgAlt; e.currentTarget.style.borderColor = p.primary; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = p.line; }}
            >{c}</button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      borderTop: `1px solid ${p.line}`, paddingTop: 18 }}>
          <div style={{ fontSize: 12.5, color: p.muted }}>
            Dauer: ca. 3 Minuten · keine E-Mail erforderlich
          </div>
          <div style={{
            display: 'flex', gap: 3, alignItems: 'center',
          }}>
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} style={{
                width: 14, height: 3, borderRadius: 2,
                background: i === 0 ? p.primary : p.line,
              }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────
// FAQ item (accordion)
// ───────────────────────────────────────────────
function FAQItem({ q, a, palette, initiallyOpen = false }) {
  const [open, setOpen] = React.useState(initiallyOpen);
  const p = palette;
  return (
    <div style={{ borderTop: `1px solid ${p.line}` }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', textAlign: 'left',
          padding: '22px 0',
          background: 'transparent', border: 'none', cursor: 'pointer',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24,
          color: p.ink,
          fontFamily: 'inherit',
          fontSize: 18,
          fontWeight: 500,
          letterSpacing: '-0.01em',
        }}
      >
        <span>{q}</span>
        <span style={{
          width: 28, height: 28, flexShrink: 0,
          borderRadius: 999,
          border: `1px solid ${p.line}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: p.inkSoft, fontSize: 14, transition: 'transform .25s',
          transform: open ? 'rotate(45deg)' : 'rotate(0)',
        }}>+</span>
      </button>
      {open && (
        <div style={{
          paddingBottom: 24,
          color: p.inkSoft,
          fontSize: 15.5,
          lineHeight: 1.65,
          maxWidth: '70ch',
        }}>
          {a}
        </div>
      )}
    </div>
  );
}

// ───────────────────────────────────────────────
// Number / stat pill
// ───────────────────────────────────────────────
function Stat({ num, label, palette, style }) {
  const p = palette;
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, ...style }}>
      <div style={{
        fontFamily: 'var(--ak-serif, Georgia, serif)',
        fontWeight: 400,
        fontSize: 40,
        lineHeight: 1,
        color: p.primary,
        letterSpacing: '-0.02em',
      }}>
        {num}
      </div>
      <div style={{
        fontSize: 13, color: p.inkSoft,
        letterSpacing: '0.01em',
        maxWidth: 140,
        lineHeight: 1.3,
      }}>
        {label}
      </div>
    </div>
  );
}

Object.assign(window, {
  AK_PALETTES, AK_DENSITY,
  CompassGlyph, Arrow, RouteLine,
  PrimaryCTA, AssessmentModal, FAQItem, Stat,
});
