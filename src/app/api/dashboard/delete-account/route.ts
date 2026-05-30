import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseAdmin, supabaseAdminReady } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function POST() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!supabaseAdminReady()) {
    return NextResponse.json(
      { error: "Service nicht verfügbar." },
      { status: 503 }
    );
  }

  const admin = getSupabaseAdmin();

  const { data: docs } = await admin
    .from("documents")
    .select("storage_path")
    .eq("user_id", user.id);
  const paths = (docs ?? []).map((d) => d.storage_path).filter(Boolean);
  if (paths.length > 0) {
    try {
      await admin.storage.from("documents").remove(paths);
    } catch (err) {
      console.error("[delete-account] storage remove failed:", err);
    }
  }

  const { error: authError } = await admin.auth.admin.deleteUser(user.id);
  if (authError) {
    console.error("[delete-account] auth delete failed:", authError);
    return NextResponse.json(
      { error: "Konto-Löschung fehlgeschlagen." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
