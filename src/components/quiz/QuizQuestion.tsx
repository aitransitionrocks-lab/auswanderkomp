"use client";

import type { QuizQuestionDef, QuizOption } from "@/data/questions";

interface Props {
  question: QuizQuestionDef;
  current: number;
  total: number;
  onSelect: (value: QuizOption["value"]) => void;
}

export function QuizQuestion({ question, current, total, onSelect }: Props) {
  const progress = ((current - 1) / total) * 100;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress */}
      <div className="w-full bg-gray-100">
        <div
          className="h-1.5 bg-teal transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-xl w-full">
          <p className="text-sm text-gray-400 mb-3">
            Frage {current} von {total}
          </p>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-navy mb-3 leading-tight">
            {question.question}
          </h1>
          {question.subtitle && (
            <p className="text-gray-500 mb-8">{question.subtitle}</p>
          )}

          <div className="space-y-3 mt-6">
            {question.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => onSelect(opt.value)}
                className="w-full text-left p-5 rounded-xl border-2 border-gray-200 hover:border-teal-mid hover:bg-teal-faint transition-all duration-150 active:scale-[0.99]"
              >
                <span className="text-gray-700 font-medium">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
