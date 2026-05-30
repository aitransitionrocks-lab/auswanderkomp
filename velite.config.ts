import { defineConfig, s } from "velite";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { CATEGORIES, GERMAN_WPM } from "./src/lib/blog/meta";

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/velite-assets",
    base: "/velite-assets/",
    clean: true,
  },
  collections: {
    posts: {
      name: "Post",
      pattern: "blog/**/*.mdx",
      schema: s
        .object({
          title: s.string().max(120),
          slug: s.slug("posts"),
          description: s.string().max(200),
          keywords: s.array(s.string()).default([]),
          publishedAt: s.isodate(),
          updatedAt: s.isodate().optional(),
          category: s.enum(CATEGORIES),
          tags: s.array(s.string()).default([]),
          coverImage: s.string(),
          coverImageAlt: s.string().min(3),
          draft: s.boolean().default(false),
          featured: s.boolean().default(false),
          content: s.mdx(),
          toc: s.toc(),
          metadata: s.metadata(),
        })
        .transform((data) => ({
          ...data,
          url: `/blog/${data.category}/${data.slug}`,
          readingTime: Math.max(
            1,
            Math.round(data.metadata.wordCount / GERMAN_WPM)
          ),
        })),
    },
  },
  mdx: {
    rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]],
  },
});
