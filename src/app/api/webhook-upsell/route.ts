import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {
  stripeReady,
  stripeWebhookReady,
} from "@/lib/env";
import { wasEventProcessed, markEventProcessed } from "@/lib/webhook/idempotency";
import { createOrUpdateUserFromPurchase } from "@/lib/supabase/user-creation";
import { supabaseAdminReady } from "@/lib/supabase/admin";
import { sendOperatorAlert } from "@/lib/webhook/alert";

export const dynamic = "force-dynamic";

// Dedizierter Webhook-Endpoint für 97€-Upsell.
// Eigener WEBHOOK-SECRET = ENV STRIPE_WEBHOOK_SECRET_UPSELL.
export async function POST(req: NextRequest) {
  if (!stripeReady()) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }
  const secret = process.env.STRIPE_WEBHOOK_SECRET_UPSELL;
  if (!secret || secret.startsWith("whsec_placeholder")) {
    // Fallback auf Main-Webhook-Secret (für MVP, ein Endpoint pro Stripe-Konto reicht)
    if (!stripeWebhookReady()) {
      return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
    }
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      secret ?? process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("[webhook-upsell] sig verify failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  if (session.metadata?.product_type !== "dashboard_97") {
    // Nicht für diesen Endpoint zuständig
    return NextResponse.json({ received: true, status: "wrong_product" });
  }

  const eventId = event.id;
  const sessionId = session.id;
  const email =
    session.customer_email ?? session.customer_details?.email ?? null;

  if (await wasEventProcessed(eventId)) {
    return NextResponse.json({ received: true, status: "duplicate" });
  }

  if (!email) {
    await sendOperatorAlert({
      subject: "[Auswander-Kompass] Upsell ohne E-Mail",
      body: `Event ${eventId} / Session ${sessionId} hat keine E-Mail. Manuell prüfen.`,
    });
    await markEventProcessed(eventId, { status: "failed", error: "no email" });
    return NextResponse.json({ received: true });
  }

  try {
    if (supabaseAdminReady()) {
      await createOrUpdateUserFromPurchase({
        email,
        stripeCustomerId: (session.customer as string) ?? null,
        stripeSessionId: sessionId,
        stripeEventId: eventId,
        productType: "dashboard_97",
        amountCents: 9700,
      });
    } else {
      await sendOperatorAlert({
        subject: "[Auswander-Kompass] Upsell ohne Supabase",
        body: `Event ${eventId}: 97€-Kauf für ${email} angekommen, aber Supabase nicht konfiguriert. Manuell entitlement setzen.`,
      });
    }
    await markEventProcessed(eventId, { status: "success" });
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[webhook-upsell] handler error:", err);
    await sendOperatorAlert({
      subject: "[Auswander-Kompass] Upsell-Verarbeitung fehlgeschlagen",
      body: `Event ${eventId} / ${email}\nFehler: ${
        err instanceof Error ? err.message : String(err)
      }`,
    });
    await markEventProcessed(eventId, {
      status: "failed",
      error: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json({ received: true });
  }
}
