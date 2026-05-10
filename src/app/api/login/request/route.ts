import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function supabaseReady(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const k = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return !!url && !url.startsWith("your_") && !!k && !k.startsWith("your_");
}

function resendReady(): boolean {
  const k = process.env.RESEND_API_KEY;
  return !!k && !k.startsWith("re_placeholder");
}

export async function POST(req: NextRequest) {
  if (!supabaseReady()) {
    return NextResponse.json(
      { error: "Account-Datenbank ist aktuell nicht erreichbar." },
      { status: 503 }
    );
  }

  const { email } = await req.json().catch(() => ({ email: "" }));
  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "E-Mail fehlt." }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("email, status, access_token")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    // Immer generisch antworten — wir bestätigen NICHT, ob ein Account existiert.
    const generic = {
      ok: true,
      message:
        "Falls ein aktives Abo zu dieser E-Mail existiert, haben wir den Zugangslink gerade verschickt.",
    };

    if (!sub || sub.status !== "active" || !sub.access_token) {
      return NextResponse.json(generic);
    }

    const baseUrl = process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000";
    const link = `${baseUrl}/willkommen?token=${sub.access_token}`;

    if (resendReady()) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Auswander-Kompass <hallo@auswanderkompass.de>",
            to: email,
            subject: "Ihr Zugangslink zum Auswander-Kompass",
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; color: #0A1628;">
                <p>Hallo,</p>
                <p>Sie haben einen neuen Zugangslink zu Ihrem Fahrplan angefordert:</p>
                <p style="margin: 32px 0;">
                  <a href="${link}" style="display: inline-block; padding: 14px 28px; background: #0F6E56; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600;">
                    Fahrplan öffnen
                  </a>
                </p>
                <p style="color: #666; font-size: 13px;">Falls Sie diesen Link nicht angefordert haben, können Sie diese E-Mail ignorieren.</p>
              </div>
            `,
          }),
        });
      } catch (err) {
        console.error("[login/request] Resend error:", err);
      }
    } else {
      console.log("[login/request] Resend not configured — dev link:", link);
    }

    return NextResponse.json(generic);
  } catch (err) {
    console.error("[login/request] error:", err);
    return NextResponse.json({ ok: true, message: "Anfrage empfangen." });
  }
}
