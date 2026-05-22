import { ImageResponse } from "next/og";
import { getPostBySlug, getAllPosts } from "@/lib/blog/posts";
import { CATEGORY_LABEL, type Category } from "@/lib/blog/meta";

export const alt = "Auswander-Kompass Artikel";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

async function loadFont(weight: number): Promise<ArrayBuffer | null> {
  try {
    const css = await (
      await fetch(
        `https://fonts.googleapis.com/css2?family=Fraunces:wght@${weight}`,
        { headers: { "User-Agent": "Mozilla/5.0" } }
      )
    ).text();
    const url = css.match(/src: url\((.+?)\) format/)?.[1];
    if (!url) return null;
    return await (await fetch(url)).arrayBuffer();
  } catch {
    return null;
  }
}

export default async function OgImage({
  params,
}: {
  params: { slug: string };
}) {
  const post = getPostBySlug(params.slug);
  const title = post?.title ?? "Auswander-Kompass";
  const category = post ? CATEGORY_LABEL[post.category as Category] : "Blog";

  const font = await loadFont(500);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#1E3A34",
          padding: "72px",
          fontFamily: font ? "Fraunces" : "serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            color: "#C4926B",
            fontSize: 26,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          Auswander-Kompass · {category}
        </div>
        <div
          style={{
            color: "#F3EDE2",
            fontSize: 64,
            lineHeight: 1.1,
            maxWidth: "1000px",
          }}
        >
          {title}
        </div>
        <div style={{ color: "#9FB5AD", fontSize: 24 }}>
          auswanderkompass.de
        </div>
      </div>
    ),
    {
      ...size,
      fonts: font
        ? [{ name: "Fraunces", data: font, weight: 500, style: "normal" }]
        : [],
    }
  );
}
