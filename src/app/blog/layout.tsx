import Link from "next/link";
import { CompassGlyph } from "@/components/brand/CompassGlyph";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-paper text-ink min-h-screen">
      <header className="border-b border-line">
        <div className="max-w-page mx-auto px-6 md:px-16 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <CompassGlyph size={28} stroke="#1E3A34" accent="#C4926B" />
            <span className="font-serif text-[17px] tracking-tight">
              Auswander-Kompass
            </span>
          </Link>
          <Link
            href="/blog"
            className="text-[13px] text-muted uppercase tracking-[0.08em] hover:text-ink"
          >
            Blog
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}
