import { posts as allPosts } from "#velite";
import type { Post } from "#velite";

export type { Post };

const published = (): Post[] =>
  allPosts
    .filter((p) => !p.draft)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

export function getAllPosts(): Post[] {
  return published();
}

export function getPostBySlug(slug: string): Post | undefined {
  return published().find((p) => p.slug === slug);
}

export function getPostsByCategory(category: string): Post[] {
  return published().filter((p) => p.category === category);
}

export function getPostsByTag(tag: string): Post[] {
  return published().filter((p) => p.tags.includes(tag));
}

export function getAllTags(): { tag: string; count: number }[] {
  const map = new Map<string, number>();
  for (const p of published()) {
    for (const t of p.tags) map.set(t, (map.get(t) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function getRelatedPosts(post: Post, limit = 3): Post[] {
  return published()
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({
      post: p,
      overlap: p.tags.filter((t) => post.tags.includes(t)).length,
    }))
    .filter((x) => x.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, limit)
    .map((x) => x.post);
}
