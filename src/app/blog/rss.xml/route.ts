import { getAllPosts } from "@/lib/blog/posts";

export const dynamic = "force-static";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://auswanderkompass.de";
  const posts = getAllPosts();

  const items = posts
    .map(
      (p) => `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${baseUrl}${p.url}</link>
      <guid isPermaLink="true">${baseUrl}${p.url}</guid>
      <description>${escapeXml(p.description)}</description>
      <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>
    </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Auswander-Kompass Blog</title>
    <link>${baseUrl}/blog</link>
    <description>Strukturierte Ratgeber für deine Auswanderung.</description>
    <language>de-DE</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
