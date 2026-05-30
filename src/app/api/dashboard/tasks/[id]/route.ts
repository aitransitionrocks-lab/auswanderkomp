import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const ALLOWED_STATUSES = ["open", "in_progress", "done", "not_relevant"] as const;

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Lifetime-Gate
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

  const body = await req.json().catch(() => ({}));
  const status = body?.status;
  if (!ALLOWED_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const update: Record<string, unknown> = { status };
  if (status === "done") update.completed_at = new Date().toISOString();
  else if (status === "open" || status === "in_progress")
    update.completed_at = null;

  const { error } = await supabase
    .from("tasks")
    .update(update)
    .eq("id", params.id)
    .eq("user_id", user.id); // doppelte Absicherung trotz RLS

  if (error) {
    console.error("[tasks/PATCH]", error);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
