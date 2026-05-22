import type Stripe from "stripe";
import { sendOperatorAlert } from "./alert";
import { markEventProcessed } from "./idempotency";
import { sendEmail } from "@/lib/email/send";
import { renderFallbackEmailHtml } from "@/lib/email/fallback";

interface FailureContext {
  eventId: string;
  sessionId: string;
  email: string | null | undefined;
  error: unknown;
  metadata: Stripe.Metadata | null;
}

export async function handleProcessingFailure(
  ctx: FailureContext
): Promise<void> {
  const errorMessage =
    ctx.error instanceof Error
      ? `${ctx.error.name}: ${ctx.error.message}`
      : String(ctx.error);

  // 1. Operator-Alert (DSGVO: nur Event-ID/Session/E-Mail-Kontext)
  await sendOperatorAlert({
    subject: "[Auswander-Kompass] Webhook-Fehler — manuelle Aktion nötig",
    body: [
      `Event-ID: ${ctx.eventId}`,
      `Stripe-Session: ${ctx.sessionId}`,
      `Kunde: ${ctx.email ?? "(unbekannt)"}`,
      `Fehler: ${errorMessage}`,
      "",
      `Stripe-Dashboard: https://dashboard.stripe.com/payments/${ctx.sessionId}`,
      "",
      "Aktion: Manuell prüfen, ob Zahlung erfolgreich war.",
      "Falls ja: PDF manuell generieren oder Kunden kontaktieren.",
    ].join("\n"),
  });

  // 2. Fallback-Mail an Kunden (best effort, kein throw)
  if (ctx.email) {
    try {
      await sendEmail({
        to: ctx.email,
        subject: "Auswander-Kompass — kurze Verzögerung bei deinem Bericht",
        html: renderFallbackEmailHtml({ sessionId: ctx.sessionId }),
      });
    } catch (err) {
      console.error("[failure] fallback mail failed:", err);
    }
  }

  // 3. Event als verarbeitet (failed) markieren — verhindert Retry-Loop
  await markEventProcessed(ctx.eventId, {
    status: "failed",
    error: errorMessage,
  });
}
