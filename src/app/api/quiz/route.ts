import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import {
  getRiskProfile,
  getSegment,
  getPlanScore,
  type QuizData,
} from "@/lib/quiz-logic";

export const dynamic = "force-dynamic";

function normalize(input: Record<string, unknown>): QuizData {
  return {
    country: (input.country as QuizData["country"]) ?? "",
    dDayMonths:
      typeof input.dDayMonths === "number" ? input.dDayMonths : null,
    childrenCount:
      typeof input.childrenCount === "number" ? input.childrenCount : 0,
    childrenAgeGroup: (input.childrenAgeGroup as string) ?? "none",
    employment: (input.employment as string) ?? "",
    hasGmbh:
      typeof input.hasGmbh === "boolean" ? input.hasGmbh : input.hasGmbh === null ? null : null,
    kvType: (input.kvType as string) ?? "",
    hasProperty: input.hasProperty === true,
    taxAdviceStatus: (input.taxAdviceStatus as string) ?? "none",
    coParentStatus: (input.coParentStatus as string) ?? "na",
    biggestConcern: (input.biggestConcern as string) ?? "",
  };
}

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const data = normalize(raw);

    const risk = getRiskProfile(data);
    const segment = getSegment(data);
    const planScore = getPlanScore(data);

    // Nur in DB schreiben wenn Supabase konfiguriert ist
    const hasSupabase =
      !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith("your_") &&
      !!process.env.SUPABASE_SERVICE_ROLE_KEY &&
      !process.env.SUPABASE_SERVICE_ROLE_KEY.startsWith("your_");

    let id: string | null = null;

    if (hasSupabase) {
      const supabase = getSupabaseAdmin();
      const { data: inserted, error } = await supabase
        .from("quiz_submissions")
        .insert({
          country: data.country || null,
          d_day_months: data.dDayMonths,
          children_count: data.childrenCount,
          children_age_group: data.childrenAgeGroup,
          employment: data.employment || null,
          has_gmbh: data.hasGmbh,
          kv_type: data.kvType || null,
          has_property: data.hasProperty,
          tax_advice_status: data.taxAdviceStatus,
          co_parent_status: data.coParentStatus,
          biggest_concern: data.biggestConcern,
          risk_steuer: risk.steuer,
          risk_kv: risk.kv,
          risk_buerokratie: risk.buerokratie,
          risk_familie: risk.familie,
          segment,
          plan_score: planScore,
        })
        .select("id")
        .single();

      if (error) {
        console.error("[api/quiz] Supabase error:", error);
      } else {
        id = inserted?.id ?? null;
      }
    }

    return NextResponse.json({
      id,
      segment,
      risk,
      planScore,
    });
  } catch (err) {
    console.error("[api/quiz] error:", err);
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
