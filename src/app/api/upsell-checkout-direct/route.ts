import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripeReady, envBaseUrl } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseAdmin, supabaseAdminReady } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

// Lifetime-Upgrade aus dem authentifizierten Dashboard heraus
// (für User die initial nicht direkt auf /danke aktiviert haben).
export async function POST() {
  if (!stripeReady()) {
    return NextResponse.json(
      { error: "Stripe nicht konfiguriert." },
      { status: 503 }
    );
  }
  const priceId = process.env.STRIPE_PRICE_DASHBOARD_97;
  if (!priceId) {
    return NextResponse.json(
      { error: "STRIPE_PRICE_DASHBOARD_97 fehlt." },
      { status: 503 }
    );
  }
  if (!supabaseAdminReady()) {
    return NextResponse.json(
      { error: "Supabase nicht konfiguriert." },
      { status: 503 }
    );
  }

  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Nicht eingeloggt." }, { status: 401 });
  }

  // Letzten Stripe-Customer-ID aus purchases lookuppen
  const admin = getSupabaseAdmin();
  const { data: lastPurchase } = await admin
    .from("purchases")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const customerId = lastPurchase?.stripe_customer_id ?? null;

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const baseUrl = envBaseUrl();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    ...(customerId ? { customer: customerId } : { customer_email: user.email }),
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${baseUrl}/app/dashboard?welcome=true`,
    cancel_url: `${baseUrl}/app/upgrade`,
    locale: "de",
    metadata: {
      product_type: "dashboard_97",
      user_id: user.id,
    },
  });

  return NextResponse.json({ url: session.url });
}
