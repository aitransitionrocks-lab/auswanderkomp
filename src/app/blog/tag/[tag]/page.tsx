import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllTags, getPostsByTag } from "@/lib/blog/posts";
import { BlogCard } from "@/components/blog/BlogCard";

export function generateStaticParams() {
  return getAllTags().map(({ tag }) => ({ tag }));
}

export function generateMetadata({
  params,
}: {
  params: { tag: string };
}): Metadata {
  const tag = decodeURIComponent(params.tag);
  return {
    title: `${tag} — Auswander-Kompass Blog`,
    description: `Artikel zum Thema „${tag}" beim Auswandern.`,
    alternates: { canonical: `/blog/tag/${params.tag}` },
  };
}

export default function TagPage({ params }: { params: { tag: string } }) {
  const tag = decodeURIComponent(params.tag);
  const posts = getPostsByTag(tag);
  if (posts.length === 0) notFound();

  return (
    <main className="max-w-page mx-auto px-6 md:px-16 py-12 md:py-16">
      <div className="text-[12px] uppercase tracking-[0.14em] text-copper mb-3">
        Thema
      </div>
      <h1 className="font-serif text-3xl md:text-[40px] leading-[1.1] tracking-[-0.02em] text-ink mb-8">
        {tag}
      </h1>
      <div className="grid md:grid-cols-2 gap-5">
        {posts.map((p) => (
          <BlogCard key={p.slug} post={p} />
        ))}
      </div>
    </main>
  );
}
