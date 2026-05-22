import Link from "next/link";
import type { Post } from "@/lib/blog/posts";
import { CATEGORY_LABEL, type Category } from "@/lib/blog/meta";

export function BlogCard({ post }: { post: Post }) {
  return (
    <article className="border border-line rounded-card bg-paper p-6 flex flex-col gap-3 hover:border-fir transition-colors">
      <div className="text-[11px] uppercase tracking-[0.12em] text-copper font-medium">
        {CATEGORY_LABEL[post.category as Category]}
      </div>
      <h2 className="font-serif text-[22px] leading-[1.25] tracking-tight text-ink">
        <Link href={post.url} className="hover:text-copper-deep transition-colors">
          {post.title}
        </Link>
      </h2>
      <p className="text-[15px] text-inkSoft leading-[1.55] flex-1">
        {post.description}
      </p>
      <div className="flex items-center gap-3 text-[12.5px] text-muted">
        <span>{formatDate(post.publishedAt)}</span>
        <span>·</span>
        <span>{post.readingTime} Min</span>
      </div>
    </article>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
