import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, getAllTags } from "@/lib/blog/posts";
import { BlogCard } from "@/components/blog/BlogCard";
import { Pagination, PAGE_SIZE } from "@/components/blog/Pagination";
import { CATEGORIES, CATEGORY_LABEL } from "@/lib/blog/meta";

export const metadata: Metadata = {
  title: "Blog — Orientierung für deine Auswanderung",
  description:
    "Strukturierte Ratgeber zu Steuern, Recht, Krankenversicherung und Familie beim Auswandern. Praxisnah und priorisiert.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
  const posts = getAllPosts();
  const page = posts.slice(0, PAGE_SIZE);
  const tags = getAllTags().slice(0, 12);

  return (
    <main className="max-w-page mx-auto px-6 md:px-16 py-12 md:py-16">
      <header className="mb-10 max-w-[680px]">
        <div className="text-[12px] uppercase tracking-[0.14em] text-copper mb-3">
          Blog
        </div>
        <h1 className="font-serif text-4xl md:text-[44px] leading-[1.08] tracking-[-0.02em] text-ink mb-4 text-balance">
          Orientierung für deine Auswanderung.
        </h1>
        <p className="text-[18px] text-inkSoft leading-[1.55]">
          Strukturierte Ratgeber statt Checklisten-Chaos — zu Steuern, Recht,
          Krankenversicherung und Familie.
        </p>
      </header>

      {/* Kategorien */}
      <div className="flex flex-wrap gap-2 mb-10">
        {CATEGORIES.map((c) => (
          <Link
            key={c}
            href={`/blog/kategorie/${c}`}
            className="px-3.5 py-1.5 rounded-pill border border-line text-[13px] text-inkSoft hover:border-fir hover:text-fir transition-colors"
          >
            {CATEGORY_LABEL[c]}
          </Link>
        ))}
      </div>

      {page.length === 0 ? (
        <p className="text-muted">Noch keine Artikel veröffentlicht.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {page.map((p) => (
            <BlogCard key={p.slug} post={p} />
          ))}
        </div>
      )}

      <Pagination current={1} total={posts.length} />

      {tags.length > 0 && (
        <section className="mt-14 pt-8 border-t border-line">
          <div className="text-[11px] uppercase tracking-[0.12em] text-muted font-medium mb-3">
            Themen
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map(({ tag, count }) => (
              <Link
                key={tag}
                href={`/blog/tag/${tag}`}
                className="px-3 py-1 rounded-pill bg-paperAlt text-[13px] text-inkSoft hover:text-fir"
              >
                {tag} <span className="text-muted">({count})</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
