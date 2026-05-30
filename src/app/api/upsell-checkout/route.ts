import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripeReady, envBaseUrl } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!stripeReady()) {
    return NextResponse.json(
      { error: "Stripe noch nicht konfiguriert." },
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

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  try {
    const { previousSessionId } = (await req.json()) as {
      previousSessionId?: string;
    };
    if (!previousSessionId) {
      return NextResponse.json(
        { error: "previousSessionId fehlt." },
        { status: 400 }
      );
    }

    const prevSession =
      await stripe.checkout.sessions.retrieve(previousSessionId);
    const customerId =
      typeof prevSession.customer === "string"
        ? prevSession.customer
        : prevSession.customer?.id;

    const baseUrl = envBaseUrl();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      ...(customerId
        ? { customer: customerId }
        : { customer_email: prevSession.customer_details?.email ?? undefined }),
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/dashboard?welcome=true`,
      cancel_url: `${baseUrl}/danke?session_id=${previousSessionId}`,
      locale: "de",
      metadata: {
        product_type: "dashboard_97",
        previous_session: previousSessionId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[upsell-checkout] error:", err);
    return NextResponse.json(
      { error: "Upsell-Checkout fehlgeschlagen." },
      { status: 500 }
    );
  }
}
