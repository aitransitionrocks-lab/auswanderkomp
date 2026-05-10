import { NextResponse } from "next/server";
import {
  getRiskProfile,
  getSegment,
  getPlanScore,
  type QuizData,
} from "@/lib/quiz-logic";

export const dynamic = "force-dynamic";

function make(overrides: Partial<QuizData>): QuizData {
  return {
    country: "portugal",
    dDayMonths: 8,
    childrenCount: 0,
    childrenAgeGroup: "none",
    employment: "employed",
    hasGmbh: false,
    kvType: "pkv",
    hasProperty: false,
    taxAdviceStatus: "none",
    coParentStatus: "na",
    biggestConcern: "",
    ...overrides,
  };
}

interface Case {
  name: string;
  expect: Record<string, unknown>;
  actual: Record<string, unknown>;
}

function run(): { cases: Case[]; passed: number; failed: number } {
  const cases: Case[] = [];

  // 1a — Portugal · Freelancer · 8M · GKV → konkret, kv=gruen (Frist entspannt)
  {
    const d = make({
      country: "portugal",
      dDayMonths: 8,
      childrenCount: 2,
      childrenAgeGroup: "primary",
      employment: "freelancer",
      hasGmbh: false,
      kvType: "gkv",
      coParentStatus: "together",
    });
    const risk = getRiskProfile(d);
    cases.push({
      name: "1a: Portugal · Freelancer · 8M · GKV → konkret + kv=gruen",
      expect: { segment: "konkret", steuer: "gruen", kv: "gruen" },
      actual: { segment: getSegment(d), steuer: risk.steuer, kv: risk.kv },
    });
  }

  // 1b — Portugal · Freelancer · 5M · GKV → konkret, kv=gelb (Frist knapp)
  {
    const d = make({
      country: "portugal",
      dDayMonths: 5,
      childrenCount: 2,
      childrenAgeGroup: "primary",
      employment: "freelancer",
      hasGmbh: false,
      kvType: "gkv",
      coParentStatus: "together",
    });
    const risk = getRiskProfile(d);
    cases.push({
      name: "1b: Portugal · Freelancer · 5M · GKV → konkret + kv=gelb",
      expect: { segment: "konkret", kv: "gelb" },
      actual: { segment: getSegment(d), kv: risk.kv },
    });
  }

  // 2 — Dubai GmbH → ready + viele rot
  {
    const d = make({
      country: "dubai",
      dDayMonths: 2,
      childrenCount: 1,
      childrenAgeGroup: "primary",
      employment: "gmbh",
      hasGmbh: true,
      kvType: "gkv",
      coParentStatus: "together",
    });
    const risk = getRiskProfile(d);
    cases.push({
      name: "2: Dubai · GmbH · 1 Kind · 2M → ready + steuer=rot + kv=rot + buerokratie=rot",
      expect: {
        segment: "ready",
        steuer: "rot",
        kv: "rot",
        buerokratie: "rot",
      },
      actual: {
        segment: getSegment(d),
        steuer: risk.steuer,
        kv: risk.kv,
        buerokratie: risk.buerokratie,
      },
    });
  }

  // 3 — dDayMonths = null → unklar
  {
    const d = make({ country: "portugal", dDayMonths: null });
    cases.push({
      name: "3: dDayMonths=null → unklar",
      expect: { segment: "unklar" },
      actual: { segment: getSegment(d) },
    });
  }

  // 3b — country = 'andere' → unklar
  {
    const d = make({ country: "andere", dDayMonths: 8 });
    cases.push({
      name: "3b: country=andere → unklar",
      expect: { segment: "unklar" },
      actual: { segment: getSegment(d) },
    });
  }

  // 4 — Spanien Angestellt 18M → plant
  {
    const d = make({
      country: "spanien",
      dDayMonths: 18,
      childrenCount: 0,
      employment: "employed",
      hasGmbh: false,
      kvType: "pkv",
    });
    cases.push({
      name: "4: Spanien · Angestellt · 18M → plant",
      expect: { segment: "plant" },
      actual: { segment: getSegment(d) },
    });
  }

  // 5 — USA GmbH getrennt 2M → ready, 2+ rot, familie=rot
  {
    const d = make({
      country: "usa",
      dDayMonths: 2,
      childrenCount: 2,
      childrenAgeGroup: "primary",
      employment: "gmbh",
      hasGmbh: true,
      kvType: "gkv",
      coParentStatus: "separated",
    });
    const risk = getRiskProfile(d);
    cases.push({
      name: "5: USA · GmbH · getrennt · 2 Kinder · 2M → ready + familie=rot + level=hoch + rotCount>=3",
      expect: {
        segment: "ready",
        familie: "rot",
        level: "hoch",
        rotCountGte3: true,
      },
      actual: {
        segment: getSegment(d),
        familie: risk.familie,
        level: risk.level,
        rotCountGte3: risk.rotCount >= 3,
      },
    });
  }

  // 6 — Alle grün
  {
    const d = make({
      country: "portugal",
      dDayMonths: 18,
      childrenCount: 0,
      employment: "employed",
      hasGmbh: false,
      kvType: "pkv",
    });
    const risk = getRiskProfile(d);
    cases.push({
      name: "6: Ideal-Profil → level=niedrig + rotCount=0",
      expect: { level: "niedrig", rotCount: 0 },
      actual: { level: risk.level, rotCount: risk.rotCount },
    });
  }

  // 7 — andere + null → kein Crash
  {
    const d = make({ country: "andere", dDayMonths: null });
    const risk = getRiskProfile(d);
    const segment = getSegment(d);
    const score = getPlanScore(d);
    cases.push({
      name: "7: andere + null → keine Crashes, Typen stimmen",
      expect: {
        segmentIsString: true,
        levelIsString: true,
        scoreInRange: true,
      },
      actual: {
        segmentIsString: typeof segment === "string",
        levelIsString: typeof risk.level === "string",
        scoreInRange: score >= 0 && score <= 65,
      },
    });
  }

  // 8 — planScore Obergrenze
  {
    const d = make({
      country: "portugal",
      dDayMonths: 18,
      employment: "employed",
      hasGmbh: false,
      kvType: "pkv",
      taxAdviceStatus: "advised",
      childrenCount: 0,
    });
    const score = getPlanScore(d);
    cases.push({
      name: "8: PlanScore bleibt ≤65",
      expect: { scoreCapped: true },
      actual: { scoreCapped: score <= 65 },
    });
  }

  let passed = 0;
  let failed = 0;
  for (const c of cases) {
    const ok = JSON.stringify(c.expect) === JSON.stringify(c.actual);
    if (ok) passed++;
    else failed++;
  }

  return { cases, passed, failed };
}

export async function GET() {
  const { cases, passed, failed } = run();
  return NextResponse.json(
    {
      status: failed === 0 ? "pass" : "fail",
      passed,
      failed,
      total: cases.length,
      cases: cases.map((c) => ({
        name: c.name,
        ok: JSON.stringify(c.expect) === JSON.stringify(c.actual),
        expect: c.expect,
        actual: c.actual,
      })),
    },
    { status: failed === 0 ? 200 : 500 }
  );
}
