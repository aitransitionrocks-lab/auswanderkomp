import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostsByCategory } from "@/lib/blog/posts";
import { BlogCard } from "@/components/blog/BlogCard";
import { CATEGORIES, CATEGORY_LABEL, type Category } from "@/lib/blog/meta";

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ category }));
}

export function generateMetadata({
  params,
}: {
  params: { category: string };
}): Metadata {
  const label = CATEGORY_LABEL[params.category as Category];
  if (!label) return {};
  return {
    title: `${label} — Auswander-Kompass Blog`,
    description: `Artikel zum Thema ${label} beim Auswandern.`,
    alternates: { canonical: `/blog/kategorie/${params.category}` },
  };
}

export default function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const category = params.category as Category;
  if (!CATEGORIES.includes(category)) notFound();
  const posts = getPostsByCategory(category);

  return (
    <main className="max-w-page mx-auto px-6 md:px-16 py-12 md:py-16">
      <div className="text-[12px] uppercase tracking-[0.14em] text-copper mb-3">
        Kategorie
      </div>
      <h1 className="font-serif text-3xl md:text-[40px] leading-[1.1] tracking-[-0.02em] text-ink mb-8">
        {CATEGORY_LABEL[category]}
      </h1>
      {posts.length === 0 ? (
        <p className="text-muted">Noch keine Artikel in dieser Kategorie.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {posts.map((p) => (
            <BlogCard key={p.slug} post={p} />
          ))}
        </div>
      )}
    </main>
  );
}
