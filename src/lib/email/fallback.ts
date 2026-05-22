function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function renderFallbackEmailHtml({
  sessionId,
}: {
  sessionId: string;
}): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; color: #1F2A24;">
      <p>Hallo,</p>
      <p>
        vielen Dank für deinen Kauf. Bei der automatischen Erstellung deines
        persönlichen Auswanderungs-Berichts ist ein technisches Problem
        aufgetreten.
      </p>
      <p>
        <strong>Du musst nichts tun.</strong> Wir wurden automatisch
        benachrichtigt und stellen dir deinen Bericht innerhalb der nächsten
        24 Stunden manuell zu.
      </p>
      <p>
        Bei Rückfragen:
        <a href="mailto:kontakt@auswanderkompass.de">kontakt@auswanderkompass.de</a>
      </p>
      <p style="color:#7A7164;font-size:12px">Referenz: ${escapeHtml(sessionId)}</p>
    </div>
  `;
}
