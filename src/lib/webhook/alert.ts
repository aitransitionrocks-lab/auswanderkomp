import { resendReady } from "@/lib/env";

const ALERT_RECIPIENT =
  process.env.OPERATOR_ALERT_EMAIL || "alerts@auswanderkompass.de";

// Operator-Alert via Resend. Kein Retry — wenn der Alert-Channel selbst
// kaputt ist, bleibt nur Vercel-Logs.
export async function sendOperatorAlert({
  subject,
  body,
}: {
  subject: string;
  body: string;
}): Promise<void> {
  if (!resendReady()) {
    console.error("[ALERT — Resend not configured]", subject, body);
    return;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Auswander-Kompass Alerts <alerts@auswanderkompass.de>",
        to: ALERT_RECIPIENT,
        subject,
        text: body,
      }),
    });
    if (!res.ok) {
      console.error("[ALERT FAILED]", await res.text());
    }
  } catch (err) {
    console.error("[ALERT FAILED]", err);
  }
}
