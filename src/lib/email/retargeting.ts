// 5 Retargeting-Mail-Templates. Pro Step: subject + html.
// Personalisiert via {firstName} (lokaler Teil der E-Mail vor @).

interface TemplateInput {
  email: string;
  baseUrl: string;
  unsubscribeToken: string;
  step: 1 | 2 | 3 | 4 | 5;
}

function escape(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function firstName(email: string): string {
  const local = email.split("@")[0] ?? "";
  return local.charAt(0).toUpperCase() + local.slice(1);
}

function footer(baseUrl: string, unsubscribeToken: string): string {
  return `<hr style="border:none;border-top:1px solid #D8CDB8;margin:32px 0 16px"/>
<p style="color:#7A7164;font-size:11px;line-height:1.5">
Du erhältst diese E-Mail als Käufer:in des Auswander-Kompass.
<a href="${baseUrl}/api/unsubscribe?token=${unsubscribeToken}" style="color:#7A7164">Keine weiteren Mails dieser Sequenz erhalten</a>
· Auswander-Kompass · auswanderkompass.de
</p>`;
}

function upgradeLink(baseUrl: string, step: number): string {
  return `${baseUrl}/dashboard/upgrade?utm_source=retarget&utm_step=${step}`;
}

const SUBJECTS: Record<number, string> = {
  1: "Dein Bericht ist gelesen. Was kommt als Nächstes?",
  2: "Familie Schmitz hat vier Monate verloren — vermeidbar gewesen",
  3: "Ehrlich: Vielleicht braucht ihr das Dashboard gar nicht",
  4: "Kleines Extra für die ersten 100 Dashboard-Nutzer",
  5: "Letztes Wort zu deinem Auswanderungs-Plan",
};

function body(step: number, name: string, upgrade: string): string {
  switch (step) {
    case 1:
      return `<p>Hallo ${name},</p>
<p>du hast deinen Auswander-Kompass-Bericht seit ein paar Tagen. Wahrscheinlich hast du ihn überflogen — und dann liegt er irgendwo.</p>
<p>Das ist der typische Verlauf. Nicht weil der Bericht schlecht ist, sondern weil ein PDF kein Begleiter ist.</p>
<p>Wenn du den Plan tatsächlich umsetzen willst: das Dashboard macht aus der Liste eine Arbeitsoberfläche — Status pro Aufgabe, Notizen, Dokumente an einer Stelle.</p>
<p><a href="${upgrade}" style="display:inline-block;padding:14px 28px;background:#1E3A34;color:#F3EDE2;border-radius:999px;text-decoration:none;font-weight:500">Dashboard ansehen — 97 € einmalig</a></p>`;

    case 2:
      return `<p>Hallo ${name},</p>
<p>kurze Geschichte aus dem letzten Quartal:</p>
<p>Familie Schmitz, drei Kinder, plante Portugal für September. Vier Monate vorher hatten sie alles "im Kopf" — Excel-Datei, ein paar Termine im Kalender. Sechs Wochen vor Umzug fiel ihnen auf: Schulanmeldung-Frist verpasst, NIE-Termin nicht gebucht, Krankenversicherung-Kündigung zu spät.</p>
<p>Vier Monate Verzug. Vermeidbar gewesen, wenn die Roadmap an einem Ort lebt, an dem sich der Status nicht "verändern" kann nur weil man die Excel-Datei nicht aufmacht.</p>
<p>Genau dafür ist das Dashboard.</p>
<p><a href="${upgrade}" style="display:inline-block;padding:14px 28px;background:#1E3A34;color:#F3EDE2;border-radius:999px;text-decoration:none;font-weight:500">Dashboard freischalten — 97 €</a></p>`;

    case 3:
      return `<p>Hallo ${name},</p>
<p>fair-Play-Mail: vielleicht ist das Dashboard nichts für dich.</p>
<p>Wenn du:</p>
<ul>
<li>noch in der Recherche-Phase bist (mehr als 12 Monate bis Umzug),</li>
<li>solo-Auswanderer ohne Familie/Kinder/GmbH-Komplexität bist,</li>
<li>oder mit Excel + Kalender sehr diszipliniert arbeitest,</li>
</ul>
<p>… dann ist der Bericht allein wahrscheinlich genug.</p>
<p>Das Dashboard rechnet sich für Familien mit Kindern, Unternehmer mit GmbH-Anteilen, und Leute mit konkretem Umzugsdatum innerhalb 12 Monate. Wenn du dich nicht wiedererkennst — alles gut, hier kein Druck.</p>
<p>Falls doch: <a href="${upgrade}">${upgrade}</a></p>`;

    case 4:
      return `<p>Hallo ${name},</p>
<p>kleiner Bonus für die ersten 100 Dashboard-Käufer:</p>
<ul>
<li>Zugang zur monatlichen Live-Q&amp;A (ich + ein Steuerberater)</li>
<li>30 % Rabatt auf das erste Spezial-Modul (z. B. Wegzugsbesteuerung, Familien-Logistik)</li>
</ul>
<p>Stand heute sind noch Plätze frei. Wenn du dabei sein willst:</p>
<p><a href="${upgrade}" style="display:inline-block;padding:14px 28px;background:#1E3A34;color:#F3EDE2;border-radius:999px;text-decoration:none;font-weight:500">Lifetime + Bonus — 97 €</a></p>`;

    case 5:
      return `<p>Hallo ${name},</p>
<p>letzte Mail dieser Serie.</p>
<p>Wenn das Dashboard nichts für dich ist, hörst du nichts mehr dazu. Wenn du später doch noch upgraden willst, ist der Zugang weiter da — kein Ablaufdatum, kein "Sonderpreis".</p>
<p>Was bleibt: du hast einen Bericht, der dir zeigt, wo deine Lücken liegen. Den Rest entscheidest du selbst.</p>
<p>Viel Erfolg auf dem Weg.</p>
<p>— Peter</p>
<p style="color:#7A7164;font-size:13px">Falls doch: <a href="${upgrade}" style="color:#7A7164">${upgrade}</a></p>`;
  }
  return "";
}

export function renderRetargetingMail(input: TemplateInput): {
  subject: string;
  html: string;
} {
  const name = firstName(input.email);
  const upgrade = upgradeLink(input.baseUrl, input.step);
  const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;max-width:600px;margin:0 auto;color:#1F2A24;line-height:1.6;font-size:15px">
${body(input.step, escape(name), upgrade)}
${footer(input.baseUrl, input.unsubscribeToken)}
</div>`;
  return { subject: SUBJECTS[input.step], html };
}
