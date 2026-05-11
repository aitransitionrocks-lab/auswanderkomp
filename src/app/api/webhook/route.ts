import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { renderToBuffer } from "@react-pdf/renderer";
import {
  stripeReady,
  stripeWebhookReady,
  resendReady,
  envBaseUrl,
} from "@/lib/env";
import {
  calculateScore,
  getSegment,
  getRiskProfile,
  type Segment,
} from "@/lib/scoring";
import { SEGMENTS } from "@/lib/segments";
import { ResultPDF } from "@/lib/pdf/ResultPDF";
import { renderResultEmailHtml } from "@/lib/email/template";

export const dynamic = "force-dynamic";

async function sendReport(
  email: string,
  segment: Segment,
  score: number,
  answers: number[]
) {
  const segmentContent = SEGMENTS[segment];
  const risk = getRiskProfile(answers);
  const baseUrl = envBaseUrl();

  // PDF generieren
  const pdfBuffer = await renderToBuffer(
    ResultPDF({
      segment,
      segmentContent,
      score,
      risk,
      email,
    })
  );

  if (!resendReady()) {
    console.log(
      `[webhook] Resend not configured — skip email for ${email} (segment=${segment})`
    );
    return;
  }

  const html = renderResultEmailHtml({ segmentContent, score, baseUrl });

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Auswander-Kompass <bericht@auswanderkompass.de>",
      reply_to: "kontakt@auswanderkompass.de",
      to: email,
      subject: segmentContent.emailSubject,
      html,
      attachments: [
        {
          filename: "Auswander-Kompass-Bericht.pdf",
          content: pdfBuffer.toString("base64"),
        },
      ],
    }),
  });

  if (!res.ok) {
    console.error("[webhook] Resend send failed:", await res.text());
  }
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

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email =
      session.customer_email ?? session.customer_details?.email ?? "";
    const segment = (session.metadata?.segment as Segment) ?? "planer";
    const score = Number(session.metadata?.score ?? "0");

    let answers: number[] = [];
    try {
      answers = JSON.parse(session.metadata?.answers ?? "[]");
    } catch {
      answers = [];
    }

    if (
      email &&
      answers.length === 10 &&
      ["dreamer", "planer", "fortgeschrittener", "starter"].includes(segment)
    ) {
      try {
        const verifiedScore = calculateScore(answers);
        const verifiedSegment = getSegment(verifiedScore);
        await sendReport(email, verifiedSegment, verifiedScore, answers);
      } catch (err) {
        console.error("[webhook] report send error:", err);
      }
    } else {
      console.warn("[webhook] incomplete metadata", {
        email: !!email,
        answersLen: answers.length,
        segment,
        score,
      });
    }
  }

  return NextResponse.json({ received: true });
}
