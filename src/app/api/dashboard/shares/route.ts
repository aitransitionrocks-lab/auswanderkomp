import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { randomBytes, scryptSync } from "node:crypto";

export const dynamic = "force-dynamic";

function token(): string {
  return randomBytes(24).toString("base64url");
}

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 32).toString("hex");
  return `${salt}:${hash}`;
}

export async function POST(req: NextRequest) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const {
    documentId,
    expiresInDays,
    password,
    maxDownloads,
    recipient,
  } = body as {
    documentId?: string;
    expiresInDays?: number;
    password?: string;
    maxDownloads?: number;
    recipient?: string;
  };

  if (!documentId) {
    return NextResponse.json({ error: "documentId fehlt" }, { status: 400 });
  }

  const days = [1, 7, 30].includes(expiresInDays ?? 0) ? expiresInDays! : 7;
  const expiresAt = new Date(Date.now() + days * 86400000).toISOString();

  const shareToken = token();

  const { error } = await supabase.from("document_shares").insert({
    document_id: documentId,
    user_id: user.id,
    share_token: shareToken,
    password_hash: password ? hashPassword(password) : null,
    expires_at: expiresAt,
    max_downloads: maxDownloads ?? 0,
    created_for_recipient: recipient ?? null,
  });

  if (error) {
    console.error("[shares/POST]", error);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://auswanderkompass.de";
  return NextResponse.json({
    token: shareToken,
    url: `${baseUrl}/shared/${shareToken}`,
    expiresAt,
  });
}
