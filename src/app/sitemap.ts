import type { MetadataRoute } from "next";
import { getAllPosts, getAllTags } from "@/lib/blog/posts";
import { CATEGORIES } from "@/lib/blog/meta";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://auswanderkompass.de";
  const now = new Date();

  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/impressum`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/datenschutz`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const posts = getAllPosts();
  const postUrls: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${baseUrl}${p.url}`,
    lastModified: new Date(p.updatedAt ?? p.publishedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const categoryUrls: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${baseUrl}/blog/kategorie/${c}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  const tagUrls: MetadataRoute.Sitemap = getAllTags().map(({ tag }) => ({
    url: `${baseUrl}/blog/tag/${encodeURIComponent(tag)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.4,
  }));

  return [...staticUrls, ...postUrls, ...categoryUrls, ...tagUrls];
}
