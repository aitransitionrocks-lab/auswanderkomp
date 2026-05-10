import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function stripeConfigured(): boolean {
  const key = process.env.STRIPE_SECRET_KEY;
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  return (
    !!key &&
    !key.startsWith("sk_test_placeholder") &&
    !!secret &&
    !secret.startsWith("whsec_placeholder")
  );
}

function supabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return !!url && !url.startsWith("your_") && !!key && !key.startsWith("your_");
}

async function sendWelcomeEmail(email: string, accessToken: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey.startsWith("re_placeholder")) {
    console.log("[webhook] Resend not configured — skipping welcome mail.");
    return;
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000";
  const accessLink = `${baseUrl}/willkommen?token=${accessToken}`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Auswander-Kompass <hallo@auswanderkompass.de>",
        to: email,
        subject: "Ihr persönlicher Auswander-Fahrplan ist bereit",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; color: #0A1628;">
            <p>Hallo,</p>
            <p>Ihr Zugang zum Auswander-Kompass ist aktiv. Über den Link unten gelangen Sie direkt in Ihren persönlichen Fahrplan — auch bei späterer Rückkehr:</p>
            <p style="margin: 32px 0;">
              <a href="${accessLink}" style="display: inline-block; padding: 14px 28px; background: #0F6E56; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600;">
                Fahrplan öffnen
              </a>
            </p>
            <p style="color: #666; font-size: 13px;">Bewahren Sie diese E-Mail gut auf — sie enthält Ihren persönlichen Zugangslink.</p>
            <p style="color: #666; font-size: 13px;">Ihr Abo können Sie jederzeit über den Link im Dashboard kündigen.</p>
            <p style="color: #999; font-size: 11px; margin-top: 32px;">Auswander-Kompass · novamundi.de</p>
          </div>
        `,
      }),
    });
    if (!res.ok) {
      console.error("[webhook] Resend failed:", await res.text());
    }
  } catch (err) {
    console.error("[webhook] Resend error:", err);
  }
}

export async function POST(req: NextRequest) {
  if (!stripeConfigured()) {
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 503 }
    );
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
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("[webhook] signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email =
      session.customer_email ?? session.customer_details?.email ?? "";

    let accessToken: string | null = null;

    if (supabaseConfigured() && email) {
      try {
        const supabase = getSupabaseAdmin();
        const submissionId = session.metadata?.submission_id || null;
        const { data: upserted } = await supabase
          .from("subscriptions")
          .upsert(
            {
              email,
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: session.subscription as string,
              status: "active",
              country: session.metadata?.country ?? null,
              quiz_submission_id: submissionId,
            },
            { onConflict: "stripe_subscription_id" }
          )
          .select("access_token")
          .maybeSingle();
        accessToken = (upserted?.access_token as string) ?? null;
      } catch (err) {
        console.error("[webhook] supabase upsert error:", err);
      }
    }

    if (email) {
      await sendWelcomeEmail(email, accessToken ?? "");
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    if (supabaseConfigured()) {
      try {
        const supabase = getSupabaseAdmin();
        await supabase
          .from("subscriptions")
          .update({
            status: "cancelled",
            cancelled_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", sub.id);
      } catch (err) {
        console.error("[webhook] supabase cancel error:", err);
      }
    }
  }

  return NextResponse.json({ received: true });
}
