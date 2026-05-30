import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/send";
import { resendReady } from "@/lib/env";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let body: { email?: string; source?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Ungültige E-Mail" }, { status: 400 });
  }

  if (!resendReady()) {
    // Dev-Mode: kein Mailversand, aber "ok" zurück (User-UX testbar)
    console.log("[lead-magnet/dev] would send to:", email);
    return NextResponse.json({ ok: true, dev: true });
  }

  // Optional PDF-Anhang aus public/downloads/reihenfolge-leitfaden.pdf
  const pdfPath = path.join(
    process.cwd(),
    "public",
    "downloads",
    "reihenfolge-leitfaden.pdf"
  );
  let attachments: Array<{ filename: string; content: string }> | undefined;
  if (existsSync(pdfPath)) {
    const buf = await readFile(pdfPath);
    attachments = [
      {
        filename: "Auswanderungs-Reihenfolge.pdf",
        content: buf.toString("base64"),
      },
    ];
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://auswanderkompass.de";

  try {
    await sendEmail({
      to: email,
      subject: "Deine Auswanderungs-Reihenfolge (PDF)",
      html: `
        <div style="font-family:-apple-system,sans-serif;max-width:600px;margin:0 auto;color:#1F2A24;line-height:1.6;font-size:15px">
          <p>Hallo,</p>
          <p>danke für dein Interesse. ${
            attachments
              ? "Die PDF mit der Auswanderungs-Reihenfolge findest du im Anhang."
              : "Wir bereiten gerade die PDF-Version vor und schicken sie dir in den nächsten Tagen zu."
          }</p>
          <p>Du willst gleich tiefer einsteigen? Mach die kostenlose Einschätzung:</p>
          <p><a href="${baseUrl}/check" style="display:inline-block;padding:14px 28px;background:#1E3A34;color:#F3EDE2;border-radius:999px;text-decoration:none;font-weight:500">Einschätzung starten</a></p>
          <p style="color:#7A7164;font-size:12px;margin-top:32px">Auswander-Kompass · auswanderkompass.de</p>
        </div>
      `,
      attachments,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[lead-magnet] send failed:", err);
    return NextResponse.json(
      { error: "Versand fehlgeschlagen." },
      { status: 500 }
    );
  }
}
