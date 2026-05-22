import { NextResponse } from "next/server";
import {
  calculateScore,
  getSegment,
  getRiskProfile,
  type RiskProfile,
} from "@/lib/scoring";
import { parseMetadataAnswers } from "@/lib/webhook/parse";
import { getPriorityTasks } from "@/lib/pdf/tasks-priority";

export const dynamic = "force-dynamic";

const ALL_GREEN: RiskProfile = {
  steuerRecht: "green",
  absicherung: "green",
  planungTiming: "green",
  familieUmfeld: "green",
};
const ALL_RED: RiskProfile = {
  steuerRecht: "red",
  absicherung: "red",
  planungTiming: "red",
  familieUmfeld: "red",
};

function threwOn(fn: () => unknown): boolean {
  try {
    fn();
    return false;
  } catch {
    return true;
  }
}

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

  // ─── F6: parseMetadataAnswers ───
  cases.push({
    name: "parseMetadataAnswers wirft bei undefined",
    expect: { threw: true },
    actual: { threw: threwOn(() => parseMetadataAnswers(undefined)) },
  });
  cases.push({
    name: "parseMetadataAnswers wirft bei '{}' (kein Array)",
    expect: { threw: true },
    actual: { threw: threwOn(() => parseMetadataAnswers("{}")) },
  });
  cases.push({
    name: "parseMetadataAnswers wirft bei Länge != 10",
    expect: { threw: true },
    actual: { threw: threwOn(() => parseMetadataAnswers("[1,2,3]")) },
  });
  cases.push({
    name: "parseMetadataAnswers wirft bei Wert > 4",
    expect: { threw: true },
    actual: {
      threw: threwOn(() => parseMetadataAnswers("[1,2,3,4,5,6,7,8,9,5]")),
    },
  });
  cases.push({
    name: "parseMetadataAnswers liefert valides Array",
    expect: { result: "[1,2,3,4,1,2,3,4,1,2]" },
    actual: {
      result: JSON.stringify(
        parseMetadataAnswers("[1,2,3,4,1,2,3,4,1,2]")
      ),
    },
  });

  // ─── F5: getPriorityTasks mit Country ───
  const ptPortugal = getPriorityTasks("dreamer", ALL_GREEN, "portugal");
  cases.push({
    name: "getPriorityTasks(dreamer, portugal) → max 6, nicht leer",
    expect: { withinBudget: true, nonEmpty: true },
    actual: {
      withinBudget: ptPortugal.length <= 6,
      nonEmpty: ptPortugal.length > 0,
    },
  });
  const ptUsa = getPriorityTasks("starter", ALL_RED, "usa");
  cases.push({
    name: "getPriorityTasks(starter, usa) → max 14, nicht leer",
    expect: { withinBudget: true, nonEmpty: true },
    actual: {
      withinBudget: ptUsa.length <= 14,
      nonEmpty: ptUsa.length > 0,
    },
  });
  const ptUnklar = getPriorityTasks("planer", ALL_RED, "unklar");
  cases.push({
    name: "getPriorityTasks(planer, unklar) → max 9, generisch nicht leer",
    expect: { withinBudget: true, nonEmpty: true },
    actual: {
      withinBudget: ptUnklar.length <= 9,
      nonEmpty: ptUnklar.length > 0,
    },
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
