import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://auswanderkompass.de";
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/blog"],
        disallow: ["/check", "/check/", "/danke", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
