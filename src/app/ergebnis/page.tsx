"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { track } from "@/lib/track";
import { ResultHeader } from "@/components/result/ResultHeader";
import { PersonalizedAnalysis } from "@/components/result/PersonalizedAnalysis";
import { RiskAmpel } from "@/components/result/RiskAmpel";
import { OhShitMoment } from "@/components/result/OhShitMoment";
import { TimelinePreview } from "@/components/result/TimelinePreview";
import { RiskOrError } from "@/components/result/RiskOrError";
import { TopThreeTasks } from "@/components/result/TopThreeTasks";
import { Bridge } from "@/components/result/Bridge";
import { PaywallCTA } from "@/components/paywall/PaywallCTA";
import { isValidResult, type ResultData } from "@/lib/result";

export default function ErgebnisPage() {
  const router = useRouter();
  const [result, setResult] = useState<ResultData | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("ak_quiz_result");
    if (!raw) {
      router.replace("/diagnose");
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      if (isValidResult(parsed)) {
        setResult(parsed);
        track("result_view", {
          segment: parsed.segment,
          risk_level: parsed.risk.level,
          rot_count: parsed.risk.rotCount,
        });
        track("paywall_view", { segment: parsed.segment });
      } else {
        router.replace("/diagnose");
      }
    } catch {
      router.replace("/diagnose");
    }
    setLoaded(true);
  }, [router]);

  if (!loaded || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Wird geladen...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <ResultHeader result={result} />
      <PersonalizedAnalysis result={result} />
      <RiskAmpel risk={result.risk} />
      <OhShitMoment result={result} />
      <TimelinePreview result={result} />
      <RiskOrError result={result} />
      <TopThreeTasks result={result} />
      <Bridge />
      <PaywallCTA result={result} />
    </main>
  );
}
