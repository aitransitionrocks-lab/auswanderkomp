import { getSupabaseAdmin } from "./supabase";
import type { QuizData, RiskProfile, Segment } from "./quiz-logic";

export interface DashboardData {
  email: string;
  country: string;
  dDayMonths: number | null;
  segment: Segment;
  risk: RiskProfile;
  planScore: number;
  subscriptionActive: boolean;
  quizData: QuizData | null;
}

function supabaseReady(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return !!url && !url.startsWith("your_") && !!key && !key.startsWith("your_");
}

export async function loadDashboardData(
  email: string
): Promise<DashboardData | null> {
  if (!supabaseReady()) return null;

  const supabase = getSupabaseAdmin();

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("status, country, quiz_submission_id")
    .eq("email", email)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!sub || sub.status !== "active") return null;

  let submissionRow: Record<string, unknown> | null = null;

  if (sub.quiz_submission_id) {
    const { data } = await supabase
      .from("quiz_submissions")
      .select("*")
      .eq("id", sub.quiz_submission_id)
      .maybeSingle();
    submissionRow = data;
  }

  if (!submissionRow) {
    // fallback: jüngste Quiz-Submission mit dieser Länder-Wahl (falls Webhook verknüpfung fehlte)
    const { data } = await supabase
      .from("quiz_submissions")
      .select("*")
      .eq("country", sub.country)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    submissionRow = data;
  }

  const country = (submissionRow?.country as string) ?? sub.country ?? "portugal";
  const segment = (submissionRow?.segment as Segment) ?? "plant";

  const risk: RiskProfile = {
    steuer: (submissionRow?.risk_steuer as RiskProfile["steuer"]) ?? "gelb",
    kv: (submissionRow?.risk_kv as RiskProfile["kv"]) ?? "gelb",
    buerokratie:
      (submissionRow?.risk_buerokratie as RiskProfile["buerokratie"]) ?? "gelb",
    familie: (submissionRow?.risk_familie as RiskProfile["familie"]) ?? "gruen",
    rotCount: 0,
    gelbCount: 0,
    level: "mittel",
  };
  const all = [risk.steuer, risk.kv, risk.buerokratie, risk.familie];
  risk.rotCount = all.filter((x) => x === "rot").length;
  risk.gelbCount = all.filter((x) => x === "gelb").length;
  risk.level =
    risk.rotCount >= 2 ? "hoch" : risk.rotCount === 1 ? "mittel" : "niedrig";

  const quizData: QuizData | null = submissionRow
    ? {
        country: country as QuizData["country"],
        dDayMonths: (submissionRow.d_day_months as number | null) ?? null,
        childrenCount: (submissionRow.children_count as number) ?? 0,
        childrenAgeGroup:
          (submissionRow.children_age_group as string) ?? "none",
        employment: (submissionRow.employment as string) ?? "",
        hasGmbh: (submissionRow.has_gmbh as boolean | null) ?? null,
        kvType: (submissionRow.kv_type as string) ?? "",
        hasProperty: (submissionRow.has_property as boolean) ?? false,
        taxAdviceStatus:
          (submissionRow.tax_advice_status as string) ?? "none",
        coParentStatus: (submissionRow.co_parent_status as string) ?? "na",
        biggestConcern: (submissionRow.biggest_concern as string) ?? "",
      }
    : null;

  return {
    email,
    country,
    dDayMonths: quizData?.dDayMonths ?? null,
    segment,
    risk,
    planScore: (submissionRow?.plan_score as number) ?? 35,
    subscriptionActive: true,
    quizData,
  };
}

export async function loadDashboardByAccessToken(
  token: string
): Promise<string | null> {
  if (!supabaseReady()) return null;

  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("subscriptions")
    .select("email, status")
    .eq("access_token", token)
    .maybeSingle();

  if (!data || data.status !== "active") return null;
  return data.email as string;
}
