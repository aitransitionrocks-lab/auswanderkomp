import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CompassGlyph } from "@/components/brand/CompassGlyph";
import { BottomNav } from "@/components/dashboard/BottomNav";

export const metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Public-Sub-Pfade (Login, Auth-Callback) rendern ohne Chrome.
  // middleware.ts erlaubt /dashboard/login + /dashboard/auth/* ungeschützt.
  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-paper text-ink pb-24">
      <header className="bg-fir text-paper sticky top-0 z-40">
        <div className="max-w-page mx-auto px-5 py-4 flex items-center justify-between">
          <Link href="/dashboard/roadmap" className="flex items-center gap-2.5">
            <CompassGlyph size={24} stroke="#F3EDE2" accent="#C4926B" />
            <span className="font-serif text-[16px] tracking-tight">
              Auswander-Kompass
            </span>
          </Link>
          <span className="text-[12px] text-paper/70 truncate max-w-[45%]">
            {user.email}
          </span>
        </div>
      </header>
      {children}
      <BottomNav />
    </div>
  );
}
