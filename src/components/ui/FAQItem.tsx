"use client";

import { useState } from "react";

interface Props {
  q: string;
  a: string;
  initiallyOpen?: boolean;
}

export function FAQItem({ q, a, initiallyOpen = false }: Props) {
  const [open, setOpen] = useState(initiallyOpen);
  return (
    <div className="border-t border-line">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left py-[22px] flex justify-between items-center gap-6 text-ink font-medium text-[18px] tracking-tight"
        aria-expanded={open}
      >
        <span>{q}</span>
        <span
          className={`w-7 h-7 shrink-0 rounded-pill border border-line flex items-center justify-center text-inkSoft text-sm transition-transform duration-200 ${
            open ? "rotate-45" : "rotate-0"
          }`}
        >
          +
        </span>
      </button>
      {open && (
        <div className="pb-6 text-inkSoft text-[15.5px] leading-[1.65] max-w-[70ch]">
          {a}
        </div>
      )}
    </div>
  );
}
