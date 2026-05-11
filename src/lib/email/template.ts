import type { SegmentContent } from "@/lib/segments";

interface Args {
  segmentContent: SegmentContent;
  score: number;
  baseUrl: string;
}

export function renderResultEmailHtml({ segmentContent, score, baseUrl }: Args): string {
  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8" />
<title>${escape(segmentContent.emailSubject)}</title>
</head>
<body style="margin:0;padding:0;background:#F3EDE2;font-family:-apple-system,BlinkMacSystemFont,'Inter Tight',sans-serif;color:#1F2A24;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F3EDE2;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FFFFFF;border:1px solid #D8CDB8;border-radius:12px;overflow:hidden;">
        <tr><td style="background:#1E3A34;padding:24px 32px;">
          <div style="color:#C4926B;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;font-weight:600;">AUSWANDER-KOMPASS</div>
          <div style="color:#F3EDE2;font-size:22px;font-weight:600;margin-top:6px;letter-spacing:-0.02em;">${escape(segmentContent.name)} · ${score}/40</div>
        </td></tr>

        <tr><td style="padding:28px 32px 8px;">
          <p style="font-size:15px;line-height:1.6;color:#1F2A24;margin:0 0 14px;">${escape(segmentContent.emailOpening)}</p>
          <p style="font-size:14px;line-height:1.65;color:#44504A;margin:0 0 14px;">${escape(segmentContent.opening)}</p>
        </td></tr>

        <tr><td style="padding:8px 32px 4px;">
          <div style="font-size:11px;letter-spacing:0.14em;color:#7A7164;text-transform:uppercase;font-weight:600;margin-bottom:10px;">Im PDF-Anhang:</div>
          <ul style="margin:0 0 14px;padding:0 0 0 18px;color:#44504A;font-size:14px;line-height:1.6;">
            <li>Dein vollständiges Risiko-Profil mit Begründung</li>
            <li>Deine 3 Kernlücken im Detail</li>
            <li>Priorisierter Fahrplan: was zuerst, was zeitkritisch, was kann warten</li>
          </ul>
        </td></tr>

        <tr><td style="padding:16px 32px 28px;">
          <a href="${baseUrl}/check/ergebnis" style="display:inline-block;padding:14px 24px;background:#1E3A34;color:#F3EDE2;border-radius:999px;text-decoration:none;font-weight:500;font-size:15px;">Ergebnis online ansehen</a>
        </td></tr>

        <tr><td style="background:#EBE3D3;padding:18px 32px;border-top:1px solid #D8CDB8;">
          <p style="margin:0;font-size:11px;color:#7A7164;line-height:1.5;">Auswander-Kompass · auswanderkompass.de · Dieser Bericht ersetzt keine rechtliche oder steuerliche Beratung.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
