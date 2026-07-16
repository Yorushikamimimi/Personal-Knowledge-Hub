import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/draft-notes", "/import-notes"],
    },
    sitemap: "https://yoruming.cn/sitemap.xml",
    host: "https://yoruming.cn",
  };
}
