import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripeReady, envBaseUrl } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseAdmin, supabaseAdminReady } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!stripeReady()) {
    return NextResponse.json(
      { error: "Stripe nicht konfiguriert." },
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

  const { slug } = (await req.json()) as { slug?: string };
  if (!slug) {
    return NextResponse.json({ error: "Slug fehlt." }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const { data: module } = await admin
    .from("modules")
    .select("slug, title, price_cents, currency, stripe_price_id, active")
    .eq("slug", slug)
    .maybeSingle();

  if (!module || !module.active) {
    return NextResponse.json({ error: "Modul nicht verfügbar." }, { status: 404 });
  }

  const { data: alreadyOwned } = await admin
    .from("user_modules")
    .select("id")
    .eq("user_id", user.id)
    .eq("module_slug", slug)
    .maybeSingle();
  if (alreadyOwned) {
    return NextResponse.json({ error: "Bereits gekauft." }, { status: 409 });
  }

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

  const lineItem = module.stripe_price_id
    ? { price: module.stripe_price_id, quantity: 1 }
    : {
        quantity: 1,
        price_data: {
          currency: module.currency,
          unit_amount: module.price_cents,
          product_data: { name: module.title },
        },
      };

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    ...(customerId ? { customer: customerId } : { customer_email: user.email }),
    line_items: [lineItem],
    success_url: `${baseUrl}/dashboard/module/${slug}?purchased=true`,
    cancel_url: `${baseUrl}/dashboard/module/${slug}`,
    locale: "de",
    metadata: {
      product_type: "module",
      module_slug: module.slug,
      module_title: module.title,
      user_id: user.id,
    },
  });

  return NextResponse.json({ url: session.url });
}
