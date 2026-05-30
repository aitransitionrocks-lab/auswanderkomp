import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getAllPosts,
  getPostBySlug,
  getRelatedPosts,
} from "@/lib/blog/posts";
import { MDXContent } from "@/components/blog/MDXContent";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { QuizCTABox } from "@/components/blog/QuizCTABox";
import { NewsletterBox } from "@/components/blog/NewsletterBox";
import { AuthorBox } from "@/components/blog/AuthorBox";
import { CategoryBadge } from "@/components/blog/CategoryBadge";
import { CATEGORY_LABEL, type Category } from "@/lib/blog/meta";

interface Params {
  category: string;
  slug: string;
}

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ category: p.category, slug: p.slug }));
}

function findPost(params: Params) {
  const post = getPostBySlug(params.slug);
  if (!post) return null;
  if (post.category !== params.category) return null;
  return post;
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const post = findPost(params);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: post.url },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: post.url,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      images: [{ url: post.coverImage, alt: post.coverImageAlt }],
    },
  };
}

export default function ArticlePage({ params }: { params: Params }) {
  const post = findPost(params);
  if (!post) notFound();

  const related = getRelatedPosts(post);
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://auswanderkompass.de";
  const category = post.category as Category;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: { "@type": "Person", name: "Peter" },
    publisher: { "@type": "Organization", name: "Auswander-Kompass" },
    mainEntityOfPage: `${baseUrl}${post.url}`,
    image: `${baseUrl}${post.coverImage}`,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Blog", item: `${baseUrl}/blog` },
      {
        "@type": "ListItem",
        position: 2,
        name: CATEGORY_LABEL[category],
        item: `${baseUrl}/blog/kategorie/${category}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${baseUrl}${post.url}`,
      },
    ],
  };

  return (
    <main className="max-w-page mx-auto px-6 md:px-16 py-10 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <nav className="text-[13px] text-muted mb-8" aria-label="Breadcrumb">
        <Link href="/blog" className="hover:text-ink">
          Blog
        </Link>
        <span className="mx-2">·</span>
        <Link
          href={`/blog/kategorie/${category}`}
          className="hover:text-ink"
        >
          {CATEGORY_LABEL[category]}
        </Link>
      </nav>

      <header className="max-w-[760px]">
        <CategoryBadge category={category} />
        <h1 className="mt-3 font-serif text-3xl md:text-[44px] leading-[1.1] tracking-[-0.02em] text-ink mb-4 text-balance">
          {post.title}
        </h1>
        <p className="text-[18px] text-inkSoft leading-[1.55] mb-5">
          {post.description}
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-muted">
          <span>{formatDate(post.publishedAt)}</span>
          <span>·</span>
          <span>{post.readingTime} Min Lesezeit</span>
        </div>
      </header>

      <div className="mt-10 grid lg:grid-cols-[1fr_280px] gap-10 lg:gap-16 items-start">
        <article className="max-w-[760px] min-w-0">
          <MDXContent code={post.content} />
          <AuthorBox />

          {related.length > 0 && (
            <section className="mt-12 pt-8 border-t border-line">
              <h2 className="font-serif text-[22px] text-fir mb-5">
                Das könnte dich auch interessieren
              </h2>
              <ul className="space-y-3">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={r.url}
                      className="font-serif text-[18px] text-ink hover:text-copper-deep transition-colors"
                    >
                      {r.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>

        <aside className="hidden lg:block sticky top-10 space-y-8">
          <TableOfContents toc={post.toc} />
          <QuizCTABox variant="main" />
          <NewsletterBox enabled={false} />
        </aside>
      </div>
    </main>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
