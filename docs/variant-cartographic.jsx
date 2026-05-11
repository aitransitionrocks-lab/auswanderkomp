// V2 — Kartographisch
// Kompass- und Karten-Metaphern visuell stark eingesetzt.
// Route/Pfad-Ästhetik, Himmelsrichtungen, nummerierte Wegpunkte.

function VariantCartographic({ palette, density, onStart }) {
  const p = palette;
  const d = density;
  const W = 1040;
  const PAD = 64;

  return (
    <div style={{
      width: W,
      background: p.bg,
      color: p.ink,
      fontFamily: 'var(--ak-sans, ui-sans-serif, system-ui, sans-serif)',
      fontSize: 16,
      lineHeight: d.lead,
      position: 'relative',
    }}>
      {/* Subtle paper / map texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.35,
        backgroundImage: `radial-gradient(${p.line} 0.6px, transparent 0.6px)`,
        backgroundSize: '24px 24px',
        maskImage: 'linear-gradient(180deg, black 0%, black 92%, transparent 100%)',
      }} />

      {/* ─── NAV ─── */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: `24px ${PAD}px`, position: 'relative', zIndex: 2,
        borderBottom: `1px solid ${p.line}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <CompassGlyph size={32} stroke={p.primary} accent={p.accent} />
          <div>
            <div style={{ fontFamily: 'var(--ak-serif)', fontSize: 19,
                          letterSpacing: '-0.005em', lineHeight: 1 }}>
              Auswander-Kompass
            </div>
            <div style={{ fontSize: 11, letterSpacing: '0.12em',
                          textTransform: 'uppercase', color: p.muted, marginTop: 4 }}>
              Orientierung · Reihenfolge · Klarheit
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20,
                      fontSize: 12, color: p.muted,
                      letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          <span>N · Norden</span>
          <span style={{ width: 24, height: 1, background: p.line }} />
          <span>Kurs setzen</span>
        </div>
      </header>

      {/* ─── HERO ─── */}
      <section style={{
        padding: `${d.sec}px ${PAD}px ${d.sec - 20}px`,
        position: 'relative', zIndex: 2,
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 60, alignItems: 'center' }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '7px 14px 7px 12px',
              background: p.highlight,
              border: `1px solid ${p.line}`,
              borderRadius: 999,
              fontSize: 12.5,
              color: p.inkSoft,
              marginBottom: 28,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: p.accent }} />
              Kurs setzen · in 3 Minuten
            </div>

            <h1 style={{
              fontFamily: 'var(--ak-serif)',
              fontWeight: 400,
              fontSize: 62,
              lineHeight: 1.03,
              letterSpacing: '-0.025em',
              margin: '0 0 28px',
              textWrap: 'balance',
            }}>
              Beim Auswandern entscheidet die
              {' '}<span style={{
                position: 'relative', color: p.primary, fontStyle: 'italic',
              }}>Reihenfolge
                <svg style={{ position: 'absolute', left: 0, right: 0, bottom: -4,
                              width: '100%', height: 8, display: 'block' }}
                     viewBox="0 0 120 8" preserveAspectRatio="none">
                  <path d="M1 5 Q30 1 60 4 T119 3" stroke={p.accent}
                        strokeWidth="1.5" fill="none" strokeLinecap="round" />
                </svg>
              </span>{' '}
              — und Fehler können teuer werden.
            </h1>

            <p style={{
              fontSize: 18, lineHeight: 1.55, color: p.inkSoft,
              margin: '0 0 16px', maxWidth: '52ch',
            }}>
              Der Auswander-Kompass zeigt dir auf Basis deiner Situation, welche
              Schritte du zuerst erledigen musst — und wo kritische Risiken entstehen.
            </p>
            <p style={{ fontSize: 15, color: p.muted, margin: '0 0 36px', maxWidth: '50ch' }}>
              In 3–4 Minuten erhältst du eine persönliche Einschätzung
              mit klar priorisierten nächsten Schritten.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
              <PrimaryCTA palette={p} onClick={onStart}>Einschätzung starten</PrimaryCTA>
              <div style={{ fontSize: 13, color: p.muted, lineHeight: 1.4 }}>
                Dauer: ca. 3 Minuten<br/>
                keine E-Mail erforderlich
              </div>
            </div>
          </div>

          {/* Large compass art */}
          <HeroCompass palette={p} />
        </div>

        {/* Stats row as a measurement strip */}
        <div style={{
          marginTop: d.sec,
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          border: `1px solid ${p.line}`,
          borderRadius: 12,
          overflow: 'hidden',
          background: p.bgAlt,
        }}>
          {[
            ['10', 'Fragen'],
            ['~3 min', 'Zeit'],
            ['0 €', 'Kosten'],
            ['anonym', 'keine E-Mail'],
          ].map(([n, l], i, arr) => (
            <div key={i} style={{
              padding: '22px 24px',
              borderRight: i < arr.length - 1 ? `1px solid ${p.line}` : 'none',
              display: 'flex', flexDirection: 'column', gap: 6,
            }}>
              <div style={{
                fontFamily: 'var(--ak-serif)', fontSize: 30, lineHeight: 1,
                color: p.primary, letterSpacing: '-0.02em',
              }}>{n}</div>
              <div style={{ fontSize: 12, color: p.muted,
                            letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {l}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 2. PROBLEM ─── */}
      <section style={{ padding: `${d.sec}px ${PAD}px`, position: 'relative', zIndex: 2 }}>
        <SectionMarker palette={p} number="02" label="Problem" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start',
                      marginTop: 28 }}>
          <div>
            <h2 style={{
              fontFamily: 'var(--ak-serif)', fontWeight: 400, fontSize: 42,
              lineHeight: 1.1, letterSpacing: '-0.02em',
              margin: '0 0 24px', textWrap: 'balance',
            }}>
              Die meisten Auswanderungen scheitern nicht am Wissen — sondern an der falschen Reihenfolge.
            </h2>
            <p style={{ fontSize: 16.5, lineHeight: 1.65, color: p.inkSoft, margin: '0 0 16px' }}>
              Die meisten Familien haben bereits recherchiert. Checklisten gelesen.
              Videos gesehen. Und stehen trotzdem an genau derselben Stelle:
              sie wissen nicht, womit sie anfangen sollen.
            </p>
            <p style={{ fontSize: 16.5, lineHeight: 1.65, color: p.inkSoft, margin: 0 }}>
              Was oft fehlt, ist nicht Information — sondern Struktur.
              Genau hier entstehen die meisten Fehler: nicht aus Unwissen,
              sondern durch falsche Priorisierung.
            </p>
          </div>

          {/* Three questions as visual stack */}
          <div style={{ display: 'grid', gap: 12 }}>
            {[
              ['Was muss zuerst geklärt werden?', 'prio 1'],
              ['Was ist zeitkritisch?', 'frist'],
              ['Was kann warten, ohne Risiko zu erzeugen?', 'später'],
            ].map(([q, tag], i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 18,
                padding: '20px 22px',
                background: i === 0 ? p.primary : p.bgAlt,
                color: i === 0 ? p.primaryInk : p.ink,
                border: `1px solid ${i === 0 ? p.primary : p.line}`,
                borderRadius: 10,
              }}>
                <div style={{
                  fontSize: 10.5, letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: i === 0 ? p.accent : p.muted,
                  width: 56, flexShrink: 0, fontWeight: 500,
                }}>
                  {tag}
                </div>
                <div style={{
                  fontFamily: 'var(--ak-serif)', fontSize: 20, lineHeight: 1.3,
                  letterSpacing: '-0.01em',
                }}>
                  {q}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ padding: `0 ${PAD}px`, position: 'relative', zIndex: 2 }}>
        <RouteLine color={p.line} />
      </div>

      {/* ─── 3. WAS SIE ERHALTEN ─── */}
      <section style={{ padding: `${d.sec}px ${PAD}px`, background: p.bgAlt, position: 'relative', zIndex: 2 }}>
        <SectionMarker palette={p} number="03" label="Was du erhältst" />
        <h2 style={{
          fontFamily: 'var(--ak-serif)', fontWeight: 400, fontSize: 42,
          lineHeight: 1.1, letterSpacing: '-0.02em',
          margin: '28px 0 12px', maxWidth: '26ch', textWrap: 'balance',
        }}>
          Eine Einschätzung, die zu deiner Situation passt.
        </h2>
        <p style={{ fontSize: 16.5, color: p.inkSoft, margin: '0 0 40px', maxWidth: '54ch' }}>
          Nach wenigen Minuten weißt du ganz konkret:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            ['N', 'kritisch', 'welche Themen bei dir aktuell kritisch sind'],
            ['O', 'zuerst',   'womit du konkret beginnen solltest'],
            ['S', 'später',   'welche Schritte noch Zeit haben'],
            ['W', 'risiko',   'wo typische Fehler entstehen können'],
          ].map(([dir, tag, text], i) => (
            <div key={i} style={{
              padding: '26px 28px 28px',
              background: p.bg,
              border: `1px solid ${p.line}`,
              borderRadius: 12,
              display: 'flex', flexDirection: 'column', gap: 16,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 999,
                  border: `1px solid ${p.primary}`,
                  color: p.primary,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--ak-serif)', fontSize: 14,
                }}>
                  {dir}
                </div>
                <div style={{ fontSize: 11, letterSpacing: '0.14em',
                              textTransform: 'uppercase', color: p.accent,
                              fontWeight: 500 }}>
                  {tag}
                </div>
              </div>
              <div style={{
                fontFamily: 'var(--ak-serif)', fontSize: 20, lineHeight: 1.3,
                color: p.ink, letterSpacing: '-0.01em',
              }}>
                {text}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 36, padding: '22px 28px',
          background: 'transparent',
          border: `1px dashed ${p.line}`,
          borderRadius: 12,
        }}>
          <div style={{ fontSize: 11.5, letterSpacing: '0.12em', textTransform: 'uppercase',
                        color: p.muted, marginBottom: 12 }}>
            Grundlage der Einschätzung
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {['Zielland', 'Zeitplan', 'Familiensituation', 'Berufliche Situation'].map((x) => (
              <span key={x} style={{
                padding: '6px 14px',
                background: p.bg,
                border: `1px solid ${p.line}`,
                borderRadius: 999,
                fontSize: 13, color: p.ink,
              }}>
                {x}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. WAS ES LEISTET ─── */}
      <section style={{ padding: `${d.sec}px ${PAD}px`, position: 'relative', zIndex: 2 }}>
        <SectionMarker palette={p} number="04" label="Was es leistet" />
        <h2 style={{
          fontFamily: 'var(--ak-serif)', fontWeight: 400, fontSize: 42,
          lineHeight: 1.1, letterSpacing: '-0.02em',
          margin: '28px 0 20px', maxWidth: '22ch', textWrap: 'balance',
        }}>
          Orientierung, bevor du falsche Entscheidungen triffst.
        </h2>
        <p style={{ fontSize: 16.5, lineHeight: 1.65, color: p.inkSoft,
                    margin: '0 0 44px', maxWidth: '60ch' }}>
          Die Einschätzung ersetzt keine individuelle Beratung.
          Sie zeigt dir jedoch, wo du aktuell stehst — und was jetzt wichtig wird.
          So vermeidest du typische Fehler:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          {[
            ['wichtige Schritte zu spät zu beginnen', '⚠'],
            ['die falsche Reihenfolge zu wählen', '↻'],
            ['kritische Themen zu übersehen', '○'],
          ].map(([text, icon], i) => (
            <div key={i} style={{
              padding: '28px 24px',
              background: p.bg,
              border: `1px solid ${p.line}`,
              borderRadius: 12,
              position: 'relative',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: p.highlight,
                color: p.primary,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, marginBottom: 20,
              }}>
                {icon}
              </div>
              <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase',
                            color: p.muted, marginBottom: 8 }}>
                Fehler {String(i + 1).padStart(2, '0')}
              </div>
              <div style={{ fontSize: 17.5, lineHeight: 1.35, color: p.ink,
                            letterSpacing: '-0.005em' }}>
                {text}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 36,
          padding: '28px 32px',
          background: p.primary,
          color: p.primaryInk,
          borderRadius: 12,
          display: 'flex', alignItems: 'center', gap: 20,
        }}>
          <CompassGlyph size={36} stroke={p.primaryInk} accent={p.accent} />
          <div style={{
            fontFamily: 'var(--ak-serif)', fontSize: 20, fontStyle: 'italic',
            lineHeight: 1.4, color: p.primaryInk, letterSpacing: '-0.005em',
          }}>
            Und du gewinnst vor allem eines: Klarheit, womit du anfangen solltest.
          </div>
        </div>
      </section>

      {/* ─── 5. TYPISCHE SITUATIONEN ─── */}
      <section style={{ padding: `${d.sec}px ${PAD}px`, background: p.bgAlt, position: 'relative', zIndex: 2 }}>
        <SectionMarker palette={p} number="05" label="Für wen" />
        <h2 style={{
          fontFamily: 'var(--ak-serif)', fontWeight: 400, fontSize: 42,
          lineHeight: 1.1, letterSpacing: '-0.02em',
          margin: '28px 0 48px', maxWidth: '24ch', textWrap: 'balance',
        }}>
          Für wen der Auswander-Kompass besonders hilfreich ist.
        </h2>

        <div style={{ display: 'grid', gap: 14 }}>
          {[
            ['Richtung klar · Start unklar', 'Du weißt, in welches Land du willst — aber nicht, womit du anfangen sollst.'],
            ['Reihenfolge unsicher', 'Du hast erste Schritte geplant — bist aber unsicher, ob die Reihenfolge stimmt.'],
            ['Termin steht', 'Dein Umzug steht zeitlich fest — und du möchtest keine Fristen verpassen.'],
            ['Familie mitnehmen', 'Du hast Familie und willst sicherstellen, dass Schule, Versicherung und Formalitäten rechtzeitig geklärt sind.'],
          ].map(([label, text], i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '220px 1fr',
              gap: 28, alignItems: 'baseline',
              padding: '22px 24px',
              background: p.bg,
              border: `1px solid ${p.line}`,
              borderRadius: 10,
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                fontSize: 12.5, color: p.primary, fontWeight: 500,
                letterSpacing: '0.04em',
              }}>
                <span style={{
                  fontFamily: 'var(--ak-serif)', fontSize: 18,
                  color: p.accent, width: 22, textAlign: 'right',
                }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                {label}
              </div>
              <div style={{ fontSize: 16, lineHeight: 1.5, color: p.ink }}>
                „{text}"
              </div>
            </div>
          ))}
        </div>

        <p style={{
          marginTop: 36, fontSize: 16, color: p.inkSoft,
          fontStyle: 'italic', fontFamily: 'var(--ak-serif)', textAlign: 'center',
        }}>
          Wenn dir einer dieser Punkte bekannt vorkommt, bist du hier richtig.
        </p>
      </section>

      {/* ─── 6. WIE ES FUNKTIONIERT ─── */}
      <section style={{ padding: `${d.sec}px ${PAD}px`, position: 'relative', zIndex: 2 }}>
        <SectionMarker palette={p} number="06" label="So funktioniert es" />
        <h2 style={{
          fontFamily: 'var(--ak-serif)', fontWeight: 400, fontSize: 42,
          lineHeight: 1.1, letterSpacing: '-0.02em',
          margin: '28px 0 56px', maxWidth: '22ch', textWrap: 'balance',
        }}>
          Drei Etappen — und dein Weg wird klarer.
        </h2>

        {/* Route visualization */}
        <div style={{ position: 'relative', padding: '0 20px' }}>
          {/* The dashed route */}
          <svg viewBox="0 0 1000 40" preserveAspectRatio="none"
               style={{ position: 'absolute', left: 20, right: 20, top: 26,
                        width: 'calc(100% - 40px)', height: 40, zIndex: 0 }}
               aria-hidden="true">
            <path d="M40 20 Q200 0 340 20 T660 20 T960 20"
                  stroke={p.accent} strokeWidth="1.5" strokeDasharray="3 6"
                  fill="none" strokeLinecap="round" />
          </svg>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24,
                        position: 'relative', zIndex: 1 }}>
            {[
              ['10 Fragen', 'Du beantwortest 10 kurze Fragen zu deiner Situation.'],
              ['Risiken sichtbar', 'Du siehst sofort, wo Risiken entstehen können.'],
              ['Deine Reihenfolge', 'Du erhältst deine nächsten Schritte in sinnvoller Reihenfolge.'],
            ].map(([title, text], i) => (
              <div key={i} style={{
                background: p.bg,
                border: `1px solid ${p.line}`,
                borderRadius: 12,
                padding: '26px 24px 28px',
                position: 'relative',
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 999,
                  background: p.bg,
                  border: `1.5px solid ${p.primary}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--ak-serif)', fontSize: 22,
                  color: p.primary, marginBottom: 18,
                  letterSpacing: '-0.02em',
                }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div style={{ fontSize: 11.5, letterSpacing: '0.14em',
                              textTransform: 'uppercase', color: p.accent,
                              marginBottom: 10, fontWeight: 500 }}>
                  Schritt {i + 1}
                </div>
                <div style={{
                  fontFamily: 'var(--ak-serif)', fontSize: 22, lineHeight: 1.25,
                  color: p.ink, letterSpacing: '-0.01em', marginBottom: 12,
                }}>
                  {title}
                </div>
                <div style={{ fontSize: 14.5, color: p.inkSoft, lineHeight: 1.5 }}>
                  {text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 7. VERTRAUEN + FAQ ─── */}
      <section style={{ padding: `${d.sec}px ${PAD}px`, background: p.bgAlt, position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 64, alignItems: 'start' }}>
          <div>
            <SectionMarker palette={p} number="07" label="Vertrauen" />
            <h2 style={{
              fontFamily: 'var(--ak-serif)', fontWeight: 400, fontSize: 32,
              lineHeight: 1.15, letterSpacing: '-0.02em',
              margin: '24px 0 24px', textWrap: 'balance',
            }}>
              Basiert auf realen Abläufen — nicht auf allgemeinen Checklisten.
            </h2>
            <p style={{ fontSize: 15.5, lineHeight: 1.65, color: p.inkSoft, margin: '0 0 14px' }}>
              Der Auswander-Kompass basiert auf realen Abläufen aus
              Auswanderungsprozessen. Er hilft dir, Struktur in ein komplexes
              Thema zu bringen und typische Fehler zu vermeiden.
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: p.muted, margin: 0 }}>
              Er ersetzt jedoch keine rechtliche oder steuerliche Beratung.
            </p>
          </div>

          <div>
            <div style={{ fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase',
                          color: p.muted, marginBottom: 12, fontWeight: 500 }}>
              Häufige Fragen
            </div>
            <div style={{ borderBottom: `1px solid ${p.line}` }}>
              <FAQItem palette={p}
                q="Wie lange dauert die Einschätzung wirklich?"
                a="Die meisten Nutzer beantworten die 10 Fragen in 3 bis 4 Minuten. Du kannst jede Frage auslassen und später ergänzen."
                initiallyOpen />
              <FAQItem palette={p}
                q="Muss ich eine E-Mail-Adresse angeben?"
                a="Nein. Die Einschätzung läuft vollständig anonym. Wenn du das Ergebnis speichern möchtest, kannst du es am Ende als PDF herunterladen — ohne Registrierung." />
              <FAQItem palette={p}
                q="Ersetzt das eine Beratung?"
                a="Nein. Die Einschätzung ordnet deine Situation strukturell ein und zeigt, wo Priorität liegt. Rechtliche, steuerliche oder behördliche Beratung bleibt individuell." />
              <FAQItem palette={p}
                q="Für welche Zielländer funktioniert der Kompass?"
                a="Der Kompass ist länderunabhängig aufgebaut. Die Fragen berücksichtigen die spezifischen Fristen und Abläufe typischer Zielländer im europäischen Raum, Nordamerika und weiteren Regionen." />
            </div>
          </div>
        </div>
      </section>

      {/* ─── 8. FINAL CTA ─── */}
      <section style={{
        padding: `${d.sec}px ${PAD}px`,
        background: p.primary, color: p.primaryInk,
        position: 'relative', zIndex: 2,
        overflow: 'hidden',
      }}>
        {/* Large faint compass watermark */}
        <div style={{
          position: 'absolute', right: -80, top: -40, opacity: 0.12,
          color: p.accent, pointerEvents: 'none',
        }}>
          <CompassGlyph size={420} stroke={p.accent} accent={p.accent} />
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 720 }}>
          <div style={{ fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase',
                        color: p.accent, marginBottom: 24, fontWeight: 500 }}>
            08 — Jetzt Kurs setzen
          </div>
          <h2 style={{
            fontFamily: 'var(--ak-serif)', fontWeight: 400, fontSize: 46,
            lineHeight: 1.08, letterSpacing: '-0.025em',
            margin: '0 0 24px', textWrap: 'balance', color: p.primaryInk,
          }}>
            Die Entscheidung ist bereits gefallen.
            Die Frage ist jetzt die Reihenfolge.
          </h2>
          <p style={{ fontSize: 18, lineHeight: 1.55, color: p.accent,
                      margin: '0 0 16px', maxWidth: '50ch',
                      fontFamily: 'var(--ak-serif)', fontStyle: 'italic' }}>
            Womit beginnst du — und was darf nicht warten?
          </p>
          <p style={{ fontSize: 16, color: p.primaryInk, opacity: 0.8,
                      margin: '0 0 36px', maxWidth: '52ch' }}>
            Genau das klärt der Auswander-Kompass für dich.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <button
              onClick={onStart}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '18px 28px',
                fontSize: 17, fontFamily: 'inherit', fontWeight: 500,
                background: p.accent,
                color: p.primary,
                border: 'none',
                borderRadius: 999,
                cursor: 'pointer',
                letterSpacing: '-0.005em',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Einschätzung starten <Arrow size={16} />
            </button>
            <span style={{ fontSize: 13.5, color: p.accent, opacity: 0.85 }}>
              Dauer: ca. 3 Minuten · keine E-Mail erforderlich
            </span>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{
        padding: `32px ${PAD}px 44px`,
        fontSize: 13, color: p.muted,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 16, position: 'relative', zIndex: 2,
        borderTop: `1px solid ${p.line}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <CompassGlyph size={20} stroke={p.muted} accent={p.muted} />
          <span>Auswander-Kompass</span>
        </div>
        <div style={{ textAlign: 'right', maxWidth: '55ch' }}>
          Keine Werbung · keine Verpflichtung · nur eine erste, strukturierte
          Einordnung deiner Situation.
        </div>
      </footer>
    </div>
  );
}

// ───────────────────────────────────────────────
// Hero compass (large ornamental)
// ───────────────────────────────────────────────
function HeroCompass({ palette }) {
  const p = palette;
  return (
    <div style={{
      aspectRatio: '1 / 1',
      position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg viewBox="0 0 400 400" style={{ width: '100%', height: 'auto' }}
           xmlns="http://www.w3.org/2000/svg">
        {/* outer ticks */}
        <g stroke={p.ink} strokeWidth="0.8" opacity="0.35">
          {Array.from({ length: 60 }).map((_, i) => {
            const a = (i / 60) * Math.PI * 2;
            const r1 = 190, r2 = i % 5 === 0 ? 178 : 184;
            const x1 = 200 + Math.cos(a) * r1;
            const y1 = 200 + Math.sin(a) * r1;
            const x2 = 200 + Math.cos(a) * r2;
            const y2 = 200 + Math.sin(a) * r2;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
          })}
        </g>

        {/* Concentric rings */}
        <circle cx="200" cy="200" r="170" fill="none" stroke={p.line} strokeWidth="1" />
        <circle cx="200" cy="200" r="140" fill="none" stroke={p.line} strokeWidth="1" strokeDasharray="2 4" />
        <circle cx="200" cy="200" r="100" fill="none" stroke={p.line} strokeWidth="1" />
        <circle cx="200" cy="200" r="60" fill="none" stroke={p.accent} strokeWidth="1" opacity="0.6" />

        {/* Cardinals */}
        {[['N', 200, 34], ['E', 366, 206], ['S', 200, 374], ['W', 34, 206]].map(([l, x, y], i) => (
          <text key={i} x={x} y={y} textAnchor="middle"
                fontFamily="Georgia, serif" fontSize="16"
                fill={i === 0 ? p.primary : p.inkSoft}
                fontWeight={i === 0 ? 600 : 400}>
            {l}
          </text>
        ))}

        {/* Needle */}
        <g transform="translate(200 200) rotate(-14)">
          <path d="M0 -130 L12 0 L0 -8 L-12 0 Z" fill={p.accent} />
          <path d="M0 130 L-12 0 L0 8 L12 0 Z" fill={p.ink} opacity="0.65" />
          <circle cx="0" cy="0" r="6" fill={p.bg} stroke={p.ink} strokeWidth="1.2" />
          <circle cx="0" cy="0" r="2" fill={p.ink} />
        </g>

        {/* Small waypoint markers along route */}
        {[
          [100, 140], [280, 110], [310, 260], [150, 290],
        ].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="3.5" fill={p.bg} stroke={p.primary} strokeWidth="1.2" />
          </g>
        ))}
      </svg>
    </div>
  );
}

// ───────────────────────────────────────────────
// Small section marker w/ number + label
// ───────────────────────────────────────────────
function SectionMarker({ palette, number, label }) {
  const p = palette;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{
        width: 36, height: 36, borderRadius: 999,
        border: `1px solid ${p.line}`,
        background: p.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--ak-serif)', fontSize: 14,
        color: p.primary, letterSpacing: '-0.02em',
      }}>
        {number}
      </div>
      <div style={{
        fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase',
        color: p.muted, fontWeight: 500,
      }}>
        {label}
      </div>
      <div style={{ flex: 1, height: 1, background: p.line, marginLeft: 8 }} />
    </div>
  );
}

window.VariantCartographic = VariantCartographic;
