import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { getSupabaseAdmin, supabaseAdminReady } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/send";
import { renderRetargetingMail } from "@/lib/email/retargeting";

export const dynamic = "force-dynamic";

interface QueueRow {
  id: string;
  user_id: string;
  sequence_step: number;
  profiles: {
    email: string;
    lifetime_purchased_at: string | null;
    retargeting_paused: boolean | null;
  } | null;
}

export async function GET(req: NextRequest) {
  // Vercel Cron authentication
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!supabaseAdminReady()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const admin = getSupabaseAdmin();
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://auswanderkompass.de";

  const { data, error } = await admin
    .from("mail_queue")
    .select(
      "id, user_id, sequence_step, profiles!inner(email, lifetime_purchased_at, retargeting_paused)"
    )
    .eq("status", "pending")
    .lte("scheduled_at", new Date().toISOString())
    .limit(100);

  if (error) {
    console.error("[cron/retargeting] fetch failed:", error);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  const queue = (data as unknown as QueueRow[]) ?? [];
  let sent = 0;
  let cancelled = 0;
  let failed = 0;

  for (const row of queue) {
    if (!row.profiles) {
      cancelled++;
      await admin
        .from("mail_queue")
        .update({ status: "cancelled", cancelled_reason: "no_profile" })
        .eq("id", row.id);
      continue;
    }

    if (row.profiles.lifetime_purchased_at) {
      cancelled++;
      await admin
        .from("mail_queue")
        .update({ status: "cancelled", cancelled_reason: "user_purchased" })
        .eq("id", row.id);
      continue;
    }

    if (row.profiles.retargeting_paused) {
      cancelled++;
      await admin
        .from("mail_queue")
        .update({ status: "cancelled", cancelled_reason: "user_paused" })
        .eq("id", row.id);
      continue;
    }

    try {
      const unsubscribeToken = randomBytes(24).toString("base64url");
      // Unsubscribe-Token im profile speichern (überschreibt vorherige Sequenz-Tokens — letzte gewinnt)
      await admin
        .from("profiles")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", row.user_id);

      const step = row.sequence_step as 1 | 2 | 3 | 4 | 5;
      const { subject, html } = renderRetargetingMail({
        email: row.profiles.email,
        baseUrl,
        unsubscribeToken: row.user_id, // user_id als Token = einfache Variante
        step,
      });

      await sendEmail({ to: row.profiles.email, subject, html });

      await admin
        .from("mail_queue")
        .update({ status: "sent", sent_at: new Date().toISOString() })
        .eq("id", row.id);

      await admin.from("mail_log").insert({
        user_id: row.user_id,
        email: row.profiles.email,
        subject,
        template_name: `retargeting_${step}`,
        status: "sent",
      });

      sent++;
    } catch (err) {
      failed++;
      await admin
        .from("mail_queue")
        .update({
          status: "failed",
          error_message: err instanceof Error ? err.message : String(err),
        })
        .eq("id", row.id);
    }
  }

  return NextResponse.json({
    processed: queue.length,
    sent,
    cancelled,
    failed,
  });
}
