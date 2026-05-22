import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { renderToBuffer } from "@react-pdf/renderer";
import { stripeReady, stripeWebhookReady, resendReady } from "@/lib/env";
import { calculateScore, getSegment, getRiskProfile } from "@/lib/scoring";
import { SEGMENTS } from "@/lib/segments";
import { ResultPDF } from "@/lib/pdf/ResultPDF";
import { renderResultEmailHtml } from "@/lib/email/template";
import { parseMetadataAnswers } from "@/lib/webhook/parse";
import {
  wasEventProcessed,
  markEventProcessed,
} from "@/lib/webhook/idempotency";
import { handleProcessingFailure } from "@/lib/webhook/failure";
import { sendEmail } from "@/lib/email/send";
import { normalizeCountry, type CountryCode } from "@/lib/questions";

export const dynamic = "force-dynamic";

async function deliverReport(opts: {
  email: string;
  answers: number[];
  country: CountryCode;
}) {
  const score = calculateScore(opts.answers);
  const segment = getSegment(score);
  const segmentContent = SEGMENTS[segment];
  const risk = getRiskProfile(opts.answers);

  // PDF generieren (wirft bei Render-Fehler → fängt der Caller)
  const pdfBuffer = await renderToBuffer(
    ResultPDF({
      segment,
      segmentContent,
      score,
      risk,
      email: opts.email,
      country: opts.country,
    })
  );

  if (!resendReady()) {
    console.log(
      `[webhook] Resend not configured — skip email for ${opts.email} (segment=${segment})`
    );
    return;
  }

  const html = renderResultEmailHtml({
    segmentContent,
    score,
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL ?? "https://auswanderkompass.de",
  });

  // sendEmail wirft bei finalem Fehlschlag → fängt der Caller (Fallback-Pfad)
  await sendEmail({
    to: opts.email,
    subject: segmentContent.emailSubject,
    html,
    attachments: [
      {
        filename: "Auswander-Kompass-Bericht.pdf",
        content: pdfBuffer.toString("base64"),
      },
    ],
  });
}

export async function POST(req: NextRequest) {
  if (!stripeReady() || !stripeWebhookReady()) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
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
    console.error("[webhook] sig verify failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Frühe Filter: nur das relevante Event
  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const eventId = event.id;
  const sessionId = session.id;
  const email =
    session.customer_email ?? session.customer_details?.email ?? null;

  // Idempotenz: Duplicate-Events überspringen
  if (await wasEventProcessed(eventId)) {
    return NextResponse.json({ received: true, status: "duplicate" });
  }

  try {
    const answers = parseMetadataAnswers(session.metadata?.answers);
    const country = normalizeCountry(session.metadata?.country);

    if (!email) {
      throw new Error("Keine E-Mail-Adresse in der Stripe-Session");
    }

    await deliverReport({ email, answers, country });
    await markEventProcessed(eventId, { status: "success" });
    return NextResponse.json({ received: true });
  } catch (err) {
    // Fallback-Pfad: jeder Fehler → Operator-Alert + Kunden-Fallback-Mail
    await handleProcessingFailure({
      eventId,
      sessionId,
      email,
      error: err,
      metadata: session.metadata,
    });
    return NextResponse.json({ received: true });
  }
}
