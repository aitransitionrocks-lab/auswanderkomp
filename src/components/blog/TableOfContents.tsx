"use client";

import { useEffect, useState } from "react";

interface TocEntry {
  title: string;
  url: string;
  items?: TocEntry[];
}

function flatten(entries: TocEntry[]): TocEntry[] {
  const out: TocEntry[] = [];
  for (const e of entries) {
    out.push(e);
    if (e.items?.length) out.push(...flatten(e.items));
  }
  return out;
}

export function TableOfContents({ toc }: { toc: TocEntry[] }) {
  const flat = flatten(toc);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const ids = flat
      .map((e) => e.url.replace(/^#/, ""))
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "0px 0px -75% 0px" }
    );
    ids.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [flat]);

  if (flat.length === 0) return null;

  return (
    <nav aria-label="Inhaltsverzeichnis" className="text-[14px]">
      <div className="text-[11px] uppercase tracking-[0.12em] text-muted font-medium mb-3">
        Inhalt
      </div>
      <ul className="space-y-2">
        {flat.map((e) => {
          const id = e.url.replace(/^#/, "");
          const isActive = active === id;
          return (
            <li key={e.url}>
              <a
                href={e.url}
                aria-current={isActive ? "true" : undefined}
                className={`block leading-snug transition-colors ${
                  isActive ? "text-fir font-medium" : "text-muted hover:text-ink"
                }`}
              >
                {e.title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
