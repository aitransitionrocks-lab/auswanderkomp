import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripeReady, envBaseUrl } from "@/lib/env";
import { SEGMENTS } from "@/lib/segments";
import type { Segment } from "@/lib/scoring";

export const dynamic = "force-dynamic";

interface Body {
  segment: Segment;
  answers: number[];
  score: number;
  email: string;
}

export async function POST(req: NextRequest) {
  if (!stripeReady()) {
    return NextResponse.json(
      {
        error:
          "Stripe ist in dieser Umgebung noch nicht konfiguriert. Bitte STRIPE_SECRET_KEY in .env.local setzen.",
      },
      { status: 503 }
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  try {
    const body = (await req.json()) as Body;
    const { segment, answers, score, email } = body;

    if (!email || !segment || !Array.isArray(answers) || answers.length !== 10) {
      return NextResponse.json(
        { error: "Ungültige Anfrage." },
        { status: 400 }
      );
    }

    const segmentName = SEGMENTS[segment]?.name ?? segment;
    const baseUrl = envBaseUrl();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: 2700,
            product_data: {
              name: "Auswander-Kompass — Persönlicher Fahrplan",
              description: `Segment: ${segmentName} · Score ${score}/40`,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/danke?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/check/ergebnis`,
      locale: "de",
      metadata: {
        segment,
        score: String(score),
        answers: JSON.stringify(answers),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[create-checkout] error:", err);
    return NextResponse.json(
      { error: "Checkout-Erstellung fehlgeschlagen." },
      { status: 500 }
    );
  }
}
