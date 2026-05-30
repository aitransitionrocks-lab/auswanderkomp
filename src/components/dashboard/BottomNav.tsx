"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Shield, Package, Settings } from "lucide-react";

const NAV_ITEMS = [
  { label: "Roadmap", href: "/dashboard/roadmap", Icon: Compass },
  { label: "Tresor", href: "/dashboard/vault", Icon: Shield },
  { label: "Module", href: "/dashboard/module", Icon: Package },
  { label: "Konto", href: "/dashboard/einstellungen", Icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-paper border-t border-line"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="max-w-page mx-auto flex items-stretch justify-around">
        {NAV_ITEMS.map(({ label, href, Icon }) => {
          const active =
            pathname === href || pathname?.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 ${
                active ? "text-fir" : "text-muted hover:text-ink"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <Icon size={22} strokeWidth={1.5} />
              <span className="text-[10px] tracking-wide">{label}</span>
              {active && (
                <span className="absolute bottom-[calc(env(safe-area-inset-bottom)+2px)] w-1 h-1 rounded-full bg-fir" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
