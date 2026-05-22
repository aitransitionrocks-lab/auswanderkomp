"use client";

import Link from "next/link";
import { CompassGlyph } from "@/components/brand/CompassGlyph";
import { Arrow } from "@/components/brand/Arrow";
import { track } from "@/lib/track";

interface Props {
  variant?: "main" | "mini";
  miniQuizSlug?: string;
  title?: string;
  text?: string;
}

export function QuizCTABox({
  variant = "main",
  miniQuizSlug,
  title,
  text,
}: Props) {
  const href =
    variant === "mini" && miniQuizSlug
      ? `/mini-quiz/${miniQuizSlug}`
      : "/check";

  return (
    <div className="my-8 rounded-card bg-fir text-paper px-6 py-7 flex flex-col sm:flex-row sm:items-center gap-5">
      <div className="shrink-0">
        <CompassGlyph size={44} stroke="#F3EDE2" accent="#C4926B" />
      </div>
      <div className="flex-1">
        <div className="font-serif text-[20px] leading-snug mb-1">
          {title ?? "Wo stehst du wirklich?"}
        </div>
        <p className="text-paper/80 text-[14.5px] leading-[1.5]">
          {text ??
            "10 Fragen, 3 Minuten — und du siehst, welche Schritte für dich jetzt zählen."}
        </p>
      </div>
      <Link
        href={href}
        onClick={() =>
          track("blog_quiz_cta_click", { variant, miniQuizSlug: miniQuizSlug ?? null })
        }
        className="shrink-0 inline-flex items-center gap-2 px-5 py-3 bg-copper text-fir rounded-pill font-medium hover:bg-copper-deep hover:text-paper transition-colors"
      >
        Einschätzung starten <Arrow size={14} />
      </Link>
    </div>
  );
}
