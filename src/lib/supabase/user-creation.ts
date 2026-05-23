import { getSupabaseAdmin, supabaseAdminReady } from "./admin";
import { getRiskProfile, type RiskLevel } from "@/lib/scoring";

interface CreatePurchaseInput {
  email: string;
  stripeCustomerId: string | null;
  stripeSessionId: string;
  stripeEventId: string;
  productType: "quiz_27" | "dashboard_97";
  amountCents: number;
  quizAnswers?: number[];
  quizScore?: number;
  quizSegment?: string;
  quizCountry?: string;
}

interface CreatePurchaseResult {
  userId: string;
  isNew: boolean;
}

/**
 * Idempotente User-Creation aus Stripe-Kauf.
 * - quiz_27: legt Account an, klont Tasks, scheduled Retargeting
 * - dashboard_97: setzt lifetime_purchased_at, canceled Retargeting
 */
export async function createOrUpdateUserFromPurchase(
  input: CreatePurchaseInput
): Promise<CreatePurchaseResult> {
  if (!supabaseAdminReady()) {
    throw new Error("Supabase nicht konfiguriert — user-creation übersprungen");
  }
  const admin = getSupabaseAdmin();

  // 1. Idempotenz: gleicher Stripe-Event schon verarbeitet?
  const { data: existingPurchase } = await admin
    .from("purchases")
    .select("id, user_id")
    .eq("stripe_event_id", input.stripeEventId)
    .maybeSingle();

  if (existingPurchase?.user_id) {
    return { userId: existingPurchase.user_id, isNew: false };
  }

  // 2. User suchen oder anlegen
  let userId: string;
  let isNew = false;

  const { data: existingProfile } = await admin
    .from("profiles")
    .select("id")
    .eq("email", input.email)
    .maybeSingle();

  if (existingProfile) {
    userId = existingProfile.id;
  } else {
    const { data: newUser, error } = await admin.auth.admin.createUser({
      email: input.email,
      email_confirm: true,
      user_metadata: { source: "quiz_purchase" },
    });
    if (error || !newUser.user) {
      throw new Error(`auth.admin.createUser failed: ${error?.message}`);
    }
    userId = newUser.user.id;
    isNew = true;

    await admin.from("profiles").insert({
      id: userId,
      email: input.email,
      quiz_segment: input.quizSegment ?? null,
      quiz_score: input.quizScore ?? null,
      quiz_country: input.quizCountry ?? null,
      quiz_answers: input.quizAnswers ?? null,
      initial_purchased_at:
        input.productType === "quiz_27" ? new Date().toISOString() : null,
    });
  }

  // 3. Purchase loggen (idempotent durch UNIQUE auf stripe_event_id)
  await admin.from("purchases").insert({
    user_id: userId,
    email: input.email,
    stripe_session_id: input.stripeSessionId,
    stripe_customer_id: input.stripeCustomerId,
    stripe_event_id: input.stripeEventId,
    product_type: input.productType,
    amount_cents: input.amountCents,
    status: "completed",
  });

  // 4. Lifetime-Upsell: Entitlement setzen + Retargeting beenden
  if (input.productType === "dashboard_97") {
    await admin
      .from("profiles")
      .update({ lifetime_purchased_at: new Date().toISOString() })
      .eq("id", userId);

    await admin
      .from("mail_queue")
      .update({ status: "cancelled", cancelled_reason: "user_purchased" })
      .eq("user_id", userId)
      .eq("status", "pending");
  }

  // 5. Erstkauf: Tasks aus Templates klonen + Retargeting schedulen
  if (input.productType === "quiz_27" && isNew) {
    if (input.quizCountry && input.quizAnswers) {
      await cloneTaskTemplatesForUser(
        userId,
        input.quizCountry,
        input.quizSegment,
        input.quizAnswers
      );
    }
    await scheduleRetargetingSequence(userId);
  }

  return { userId, isNew };
}

/**
 * Generiert Magic Link für Login. Caller versendet ihn per Resend.
 */
export async function generateMagicLink(
  email: string,
  redirectTo: string
): Promise<string | null> {
  if (!supabaseAdminReady()) return null;
  const admin = getSupabaseAdmin();
  const { data, error } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: { redirectTo },
  });
  if (error || !data.properties?.action_link) {
    console.error("[magic-link] generate failed:", error);
    return null;
  }
  return data.properties.action_link;
}

// ── Task-Cloning aus Templates ──────────────────────────────────

interface TaskTemplate {
  id: string;
  country: string;
  category: string;
  title: string;
  description: string | null;
  priority: string;
  phase: string;
  risk_tags: string[];
  sort_order: number;
}

const RISK_KEYS = [
  "steuerRecht",
  "absicherung",
  "planungTiming",
  "familieUmfeld",
] as const;

const CATEGORY_RISK_MAP: Record<string, (typeof RISK_KEYS)[number]> = {
  finanzen: "steuerRecht",
  recht: "steuerRecht",
  versicherung: "absicherung",
  gesundheit: "absicherung",
  familie: "familieUmfeld",
  wohnen: "planungTiming",
  arbeit: "planungTiming",
  sprache: "familieUmfeld",
  sonstiges: "planungTiming",
};

function computeRiskTags(answers: number[]): Record<string, RiskLevel> {
  const r = getRiskProfile(answers);
  return {
    steuerRecht: r.steuerRecht,
    absicherung: r.absicherung,
    planungTiming: r.planungTiming,
    familieUmfeld: r.familieUmfeld,
  };
}

function boostScore(
  template: TaskTemplate,
  riskMap: Record<string, RiskLevel>
): number {
  const cat = CATEGORY_RISK_MAP[template.category];
  if (!cat) return 0;
  const level = riskMap[cat];
  if (level === "red") return -2;
  if (level === "yellow") return -1;
  return 0;
}

const PRIO_ORDER: Record<string, number> = {
  kritisch: 0,
  wichtig: 1,
  optional: 2,
};

export async function cloneTaskTemplatesForUser(
  userId: string,
  country: string,
  segment: string | undefined,
  answers: number[] | undefined
): Promise<void> {
  if (!supabaseAdminReady()) return;
  const admin = getSupabaseAdmin();

  const targetCountry = country === "unklar" ? "unklar" : country;
  const { data: templates } = await admin
    .from("task_templates")
    .select("*")
    .eq("country", targetCountry)
    .eq("active", true)
    .order("sort_order");

  let pool: TaskTemplate[] = (templates as TaskTemplate[] | null) ?? [];

  if (pool.length === 0) {
    // Fallback: generische Templates
    const { data: generic } = await admin
      .from("task_templates")
      .select("*")
      .eq("country", "unklar")
      .eq("active", true)
      .order("sort_order");
    pool = (generic as TaskTemplate[] | null) ?? [];
  }

  if (pool.length === 0) return;

  // Risk-Boost-Sortierung
  const riskMap =
    answers && answers.length === 10
      ? computeRiskTags(answers)
      : null;

  const sorted = [...pool].sort((a, b) => {
    const pa = PRIO_ORDER[a.priority] + (riskMap ? boostScore(a, riskMap) : 0);
    const pb = PRIO_ORDER[b.priority] + (riskMap ? boostScore(b, riskMap) : 0);
    if (pa !== pb) return pa - pb;
    return a.sort_order - b.sort_order;
  });

  // Segment-Budget begrenzt Cloning (analog zur PDF-Logik)
  const SEGMENT_BUDGET: Record<string, number> = {
    dreamer: 30,
    planer: 45,
    fortgeschrittener: 60,
    starter: 80,
  };
  const budget = SEGMENT_BUDGET[segment ?? ""] ?? 50;
  const selected = sorted.slice(0, budget);

  const rows = selected.map((t, idx) => ({
    user_id: userId,
    template_id: t.id,
    country: t.country,
    category: t.category,
    title: t.title,
    description: t.description,
    priority: t.priority,
    phase: t.phase,
    sort_order: idx,
  }));

  if (rows.length > 0) {
    await admin.from("tasks").insert(rows);
  }
}

// ── Retargeting Mail Queue ──────────────────────────────────────

const DAY_MS = 24 * 60 * 60 * 1000;
const RETARGETING_DELAYS_DAYS = [1, 3, 7, 14, 21];

export async function scheduleRetargetingSequence(
  userId: string
): Promise<void> {
  if (!supabaseAdminReady()) return;
  const admin = getSupabaseAdmin();

  const now = Date.now();
  const rows = RETARGETING_DELAYS_DAYS.map((days, i) => ({
    user_id: userId,
    sequence_name: "dashboard_upsell",
    sequence_step: i + 1,
    scheduled_at: new Date(now + days * DAY_MS).toISOString(),
  }));

  // UNIQUE (user_id, sequence_name, sequence_step) → upsert ignoriert Duplikate
  await admin
    .from("mail_queue")
    .upsert(rows, { onConflict: "user_id,sequence_name,sequence_step" });
}
