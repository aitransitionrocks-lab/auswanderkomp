import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripeReady, stripeWebhookReady } from "@/lib/env";
import { wasEventProcessed, markEventProcessed } from "@/lib/webhook/idempotency";
import { getSupabaseAdmin, supabaseAdminReady } from "@/lib/supabase/admin";
import { sendOperatorAlert } from "@/lib/webhook/alert";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!stripeReady()) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }
  const secret =
    process.env.STRIPE_WEBHOOK_SECRET_MODULE ?? process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
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
    event = stripe.webhooks.constructEvent(body, sig, secret!);
  } catch (err) {
    console.error("[webhook-module] sig verify failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  if (session.metadata?.product_type !== "module") {
    return NextResponse.json({ received: true, status: "wrong_product" });
  }

  const eventId = event.id;
  const sessionId = session.id;
  const userId = session.metadata?.user_id ?? null;
  const slug = session.metadata?.module_slug ?? null;
  const title = session.metadata?.module_title ?? null;
  const amountCents = session.amount_total ?? 0;

  if (await wasEventProcessed(eventId)) {
    return NextResponse.json({ received: true, status: "duplicate" });
  }

  if (!userId || !slug || !title) {
    await sendOperatorAlert({
      subject: "[Auswander-Kompass] Modul-Kauf ohne Metadata",
      body: `Event ${eventId} / Session ${sessionId} fehlt user_id / module_slug / module_title. Manuell prüfen.`,
    });
    await markEventProcessed(eventId, { status: "failed", error: "missing metadata" });
    return NextResponse.json({ received: true });
  }

  if (!supabaseAdminReady()) {
    await sendOperatorAlert({
      subject: "[Auswander-Kompass] Modul-Kauf ohne Supabase",
      body: `Event ${eventId}: Modul-Kauf ${slug} für user ${userId} angekommen, aber Supabase nicht konfiguriert. Manuell entitlement setzen.`,
    });
    await markEventProcessed(eventId, { status: "failed", error: "no supabase" });
    return NextResponse.json({ received: true });
  }

  try {
    const admin = getSupabaseAdmin();
    const { error } = await admin.from("user_modules").insert({
      user_id: userId,
      module_slug: slug,
      module_title: title,
      price_paid_cents: amountCents,
      stripe_session_id: sessionId,
      stripe_event_id: eventId,
    });
    if (error && error.code !== "23505") {
      throw new Error(error.message);
    }
    await markEventProcessed(eventId, { status: "success" });
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[webhook-module] handler error:", err);
    await sendOperatorAlert({
      subject: "[Auswander-Kompass] Modul-Verarbeitung fehlgeschlagen",
      body: `Event ${eventId} / user ${userId} / modul ${slug}\nFehler: ${
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
