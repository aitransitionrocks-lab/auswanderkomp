import { NextResponse } from "next/server";
import {
  calculateScore,
  getSegment,
  getRiskProfile,
} from "@/lib/scoring";

export const dynamic = "force-dynamic";

interface Case {
  name: string;
  expect: Record<string, unknown>;
  actual: Record<string, unknown>;
}

function run(): { cases: Case[]; passed: number; failed: number } {
  const cases: Case[] = [];

  cases.push({
    name: "alle A → score 10, dreamer",
    expect: { score: 10, segment: "dreamer" },
    actual: {
      score: calculateScore([1, 1, 1, 1, 1, 1, 1, 1, 1, 1]),
      segment: getSegment(10),
    },
  });

  cases.push({
    name: "alle D → score 40, starter",
    expect: { score: 40, segment: "starter" },
    actual: {
      score: calculateScore([4, 4, 4, 4, 4, 4, 4, 4, 4, 4]),
      segment: getSegment(40),
    },
  });

  cases.push({
    name: "Grenzwerte 18/19/27/28/35/36",
    expect: {
      s18: "dreamer",
      s19: "planer",
      s27: "planer",
      s28: "fortgeschrittener",
      s35: "fortgeschrittener",
      s36: "starter",
    },
    actual: {
      s18: getSegment(18),
      s19: getSegment(19),
      s27: getSegment(27),
      s28: getSegment(28),
      s35: getSegment(35),
      s36: getSegment(36),
    },
  });

  {
    const risk = getRiskProfile([1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
    cases.push({
      name: "alle A → 4×red",
      expect: {
        steuerRecht: "red",
        absicherung: "red",
        planungTiming: "red",
        familieUmfeld: "red",
      },
      actual: risk as unknown as Record<string, unknown>,
    });
  }

  {
    const risk = getRiskProfile([4, 4, 4, 4, 4, 4, 4, 4, 4, 4]);
    cases.push({
      name: "alle D → 4×green",
      expect: {
        steuerRecht: "green",
        absicherung: "green",
        planungTiming: "green",
        familieUmfeld: "green",
      },
      actual: risk as unknown as Record<string, unknown>,
    });
  }

  {
    // Mix: gemischte Antworten
    const ans = [1, 2, 3, 4, 2, 3, 4, 2, 1, 3]; // sum = 25, planer
    cases.push({
      name: "Mix → score 25, planer",
      expect: { score: 25, segment: "planer" },
      actual: {
        score: calculateScore(ans),
        segment: getSegment(calculateScore(ans)),
      },
    });
  }

  // Falsche Array-Länge wirft
  let threwLen = false;
  try {
    calculateScore([1, 2, 3] as number[]);
  } catch {
    threwLen = true;
  }
  cases.push({
    name: "calculateScore wirft bei falscher Länge",
    expect: { threw: true },
    actual: { threw: threwLen },
  });

  // Score außerhalb 10-40 wirft
  let threwRange = false;
  try {
    getSegment(9);
  } catch {
    threwRange = true;
  }
  cases.push({
    name: "getSegment wirft bei score < 10",
    expect: { threw: true },
    actual: { threw: threwRange },
  });

  let passed = 0;
  let failed = 0;
  for (const c of cases) {
    if (JSON.stringify(c.expect) === JSON.stringify(c.actual)) passed++;
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
