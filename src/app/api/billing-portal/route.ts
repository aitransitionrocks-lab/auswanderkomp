import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getSessionEmail } from "@/lib/session";

export const dynamic = "force-dynamic";

function configured(): boolean {
  const key = process.env.STRIPE_SECRET_KEY;
  return !!key && !key.startsWith("sk_test_placeholder");
}

function supabaseReady(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const k = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return !!url && !url.startsWith("your_") && !!k && !k.startsWith("your_");
}

export async function POST(req: NextRequest) {
  if (!configured()) {
    return NextResponse.json(
      { error: "Stripe ist aktuell nicht konfiguriert." },
      { status: 503 }
    );
  }
  if (!supabaseReady()) {
    return NextResponse.json(
      { error: "Account-Datenbank ist aktuell nicht erreichbar." },
      { status: 503 }
    );
  }

  const sessionEmail = getSessionEmail();
  const body = await req.json().catch(() => ({}));
  const email = sessionEmail ?? (body.email as string | undefined);

  if (!email) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!sub?.stripe_customer_id) {
      return NextResponse.json(
        { error: "Kein aktives Abo gefunden." },
        { status: 404 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const baseUrl = process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000";

    const portal = await stripe.billingPortal.sessions.create({
      customer: sub.stripe_customer_id,
      return_url: `${baseUrl}/willkommen`,
    });

    return NextResponse.json({ url: portal.url });
  } catch (err) {
    console.error("[billing-portal] error:", err);
    return NextResponse.json(
      { error: "Portal konnte nicht geöffnet werden." },
      { status: 500 }
    );
  }
}
