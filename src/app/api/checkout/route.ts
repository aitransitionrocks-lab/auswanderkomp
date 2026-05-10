import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

function isConfigured(): boolean {
  const key = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRICE_ID;
  return (
    !!key &&
    !key.startsWith("sk_test_placeholder") &&
    !!priceId &&
    !priceId.startsWith("price_placeholder")
  );
}

export async function POST(req: NextRequest) {
  if (!isConfigured()) {
    return NextResponse.json(
      {
        error:
          "Stripe ist in dieser Umgebung noch nicht konfiguriert. Bitte STRIPE_SECRET_KEY und STRIPE_PRICE_ID in .env.local setzen.",
      },
      { status: 503 }
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  try {
    const body = await req.json();
    const { email, country, submission_id } = body as {
      email: string;
      country?: string;
      submission_id?: string;
    };

    if (!email) {
      return NextResponse.json(
        { error: "E-Mail-Adresse fehlt." },
        { status: 400 }
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        { price: process.env.STRIPE_PRICE_ID!, quantity: 1 },
      ],
      success_url: `${baseUrl}/willkommen?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/ergebnis`,
      metadata: {
        country: country ?? "",
        submission_id: submission_id ?? "",
      },
      locale: "de",
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[api/checkout] error:", err);
    return NextResponse.json(
      { error: "Checkout-Erstellung fehlgeschlagen." },
      { status: 500 }
    );
  }
}
