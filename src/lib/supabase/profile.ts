import { createSupabaseServerClient } from "./server";

export interface Profile {
  id: string;
  email: string;
  quiz_segment: string | null;
  quiz_score: number | null;
  quiz_country: string | null;
  quiz_answers: number[] | null;
  initial_purchased_at: string | null;
  lifetime_purchased_at: string | null;
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select(
      "id, email, quiz_segment, quiz_score, quiz_country, quiz_answers, initial_purchased_at, lifetime_purchased_at"
    )
    .eq("id", user.id)
    .maybeSingle();

  return (data as Profile | null) ?? null;
}

export function isLifetime(profile: Profile | null): boolean {
  return !!profile?.lifetime_purchased_at;
}
