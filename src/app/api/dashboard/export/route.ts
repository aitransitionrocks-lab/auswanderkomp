import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [{ data: profile }, { data: tasks }, { data: documents }, { data: userModules }, { data: purchases }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
      supabase.from("tasks").select("*").eq("user_id", user.id),
      supabase
        .from("documents")
        .select(
          "id, file_name, file_size_bytes, mime_type, category, tags, notes, expires_at, created_at, updated_at"
        )
        .eq("user_id", user.id),
      supabase
        .from("user_modules")
        .select("module_slug, module_title, price_paid_cents, purchased_at")
        .eq("user_id", user.id),
      supabase
        .from("purchases")
        .select("product_type, amount_cents, currency, created_at")
        .eq("user_id", user.id),
    ]);

  const payload = {
    exported_at: new Date().toISOString(),
    profile,
    tasks: tasks ?? [],
    documents: documents ?? [],
    modules: userModules ?? [],
    purchases: purchases ?? [],
  };

  return new NextResponse(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="auswander-kompass-export-${user.id.slice(0, 8)}.json"`,
    },
  });
}
