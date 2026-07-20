import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { indexableRoutes } from "@/lib/seo/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return indexableRoutes().map((r) => ({
    url: absoluteUrl(r.path),
    lastModified,
    changeFrequency: r.path === "/" ? "weekly" : "monthly",
    priority: r.priority,
  }));
}
