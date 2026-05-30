import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { randomUUID } from "node:crypto";

export const dynamic = "force-dynamic";

const ALLOWED_MIME = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/heic",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const MAX_BYTES = 25 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("lifetime_purchased_at")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile?.lifetime_purchased_at) {
    return NextResponse.json(
      { error: "Lifetime-Upgrade erforderlich." },
      { status: 403 }
    );
  }

  const { fileName, mimeType, sizeBytes } = (await req.json()) as {
    fileName?: string;
    mimeType?: string;
    sizeBytes?: number;
  };

  if (!fileName || !mimeType || typeof sizeBytes !== "number") {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  if (!ALLOWED_MIME.has(mimeType)) {
    return NextResponse.json({ error: "Dateityp nicht erlaubt." }, { status: 400 });
  }
  if (sizeBytes > MAX_BYTES) {
    return NextResponse.json({ error: "Datei größer als 25 MB." }, { status: 400 });
  }

  const ext = fileName.split(".").pop()?.toLowerCase() ?? "bin";
  const fileId = randomUUID();
  const storagePath = `users/${user.id}/documents/${fileId}.${ext}`;

  const { data, error } = await supabase.storage
    .from("documents")
    .createSignedUploadUrl(storagePath);

  if (error || !data) {
    console.error("[documents/upload] signed url failed:", error);
    return NextResponse.json(
      { error: "Upload-URL konnte nicht erstellt werden." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    storagePath,
    token: data.token,
    signedUrl: data.signedUrl,
  });
}
