import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog/posts";
import { BlogCard } from "@/components/blog/BlogCard";
import { Pagination, PAGE_SIZE } from "@/components/blog/Pagination";

export function generateStaticParams() {
  const pages = Math.ceil(getAllPosts().length / PAGE_SIZE);
  // Seite 1 ist /blog — hier nur 2..n
  return Array.from({ length: Math.max(0, pages - 1) }, (_, i) => ({
    page: String(i + 2),
  }));
}

export function generateMetadata({
  params,
}: {
  params: { page: string };
}): Metadata {
  return {
    title: `Blog — Seite ${params.page}`,
    alternates: { canonical: `/blog/seite/${params.page}` },
    robots: { index: false, follow: true },
  };
}

export default function BlogPaginated({ params }: { params: { page: string } }) {
  const n = Number(params.page);
  const posts = getAllPosts();
  const pages = Math.ceil(posts.length / PAGE_SIZE);
  if (!Number.isInteger(n) || n < 2 || n > pages) notFound();

  const slice = posts.slice((n - 1) * PAGE_SIZE, n * PAGE_SIZE);

  return (
    <main className="max-w-page mx-auto px-6 md:px-16 py-12 md:py-16">
      <h1 className="font-serif text-3xl text-ink mb-8">Blog — Seite {n}</h1>
      <div className="grid md:grid-cols-2 gap-5">
        {slice.map((p) => (
          <BlogCard key={p.slug} post={p} />
        ))}
      </div>
      <Pagination current={n} total={posts.length} />
    </main>
  );
}
