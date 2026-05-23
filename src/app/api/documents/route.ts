import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const CATEGORIES = [
  "identitaet",
  "familie",
  "finanzen",
  "arbeit",
  "bildung",
  "gesundheit",
  "wohnen",
  "versicherung",
  "sonstiges",
];

export async function POST(req: NextRequest) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const {
    storagePath,
    fileName,
    fileSizeBytes,
    mimeType,
    category,
    tags,
    notes,
    expiresAt,
  } = body as {
    storagePath?: string;
    fileName?: string;
    fileSizeBytes?: number;
    mimeType?: string;
    category?: string;
    tags?: string[];
    notes?: string;
    expiresAt?: string;
  };

  if (!storagePath || !fileName || !mimeType || typeof fileSizeBytes !== "number") {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  if (category && !CATEGORIES.includes(category)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("documents")
    .insert({
      user_id: user.id,
      storage_path: storagePath,
      file_name: fileName,
      file_size_bytes: fileSizeBytes,
      mime_type: mimeType,
      category: category ?? "sonstiges",
      tags: tags ?? [],
      notes: notes ?? null,
      expires_at: expiresAt ?? null,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[documents/POST]", error);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
  return NextResponse.json({ id: data.id });
}
