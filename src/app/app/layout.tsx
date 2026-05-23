import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CompassGlyph } from "@/components/brand/CompassGlyph";

export const metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/app/dashboard");

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="border-b border-line">
        <div className="max-w-page mx-auto px-6 md:px-16 py-5 flex items-center justify-between">
          <Link href="/app/dashboard" className="flex items-center gap-3">
            <CompassGlyph size={28} stroke="#1E3A34" accent="#C4926B" />
            <span className="font-serif text-[17px] tracking-tight">
              Auswander-Kompass
            </span>
          </Link>
          <nav className="flex items-center gap-5 text-[13px]">
            <Link href="/app/dashboard" className="text-inkSoft hover:text-ink">
              Dashboard
            </Link>
            <Link href="/app/roadmap" className="text-inkSoft hover:text-ink">
              Roadmap
            </Link>
            <Link href="/app/vault" className="text-inkSoft hover:text-ink">
              Vault
            </Link>
            <Link href="/app/settings" className="text-inkSoft hover:text-ink">
              ⚙
            </Link>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
