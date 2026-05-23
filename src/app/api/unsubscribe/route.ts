import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, supabaseAdminReady } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

// One-Click-Unsubscribe via Token-Link (Token = user_id für MVP).
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return new Response("Token fehlt", { status: 400 });
  }

  if (supabaseAdminReady()) {
    const admin = getSupabaseAdmin();
    await admin
      .from("profiles")
      .update({ retargeting_paused: true })
      .eq("id", token);

    await admin
      .from("mail_queue")
      .update({ status: "cancelled", cancelled_reason: "user_paused" })
      .eq("user_id", token)
      .eq("status", "pending");
  }

  return new NextResponse(
    `<!doctype html><html lang="de"><head><meta charset="utf-8"><title>Abgemeldet</title><meta name="robots" content="noindex"></head><body style="font-family:-apple-system,sans-serif;max-width:520px;margin:80px auto;padding:0 24px;color:#1F2A24;line-height:1.6"><h1 style="font-family:Georgia,serif;font-weight:400">Abgemeldet.</h1><p>Du erhältst keine weiteren E-Mails aus dieser Sequenz. Transaktionale Mails (z. B. Kaufbestätigungen) sind davon nicht betroffen.</p></body></html>`,
    { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}
