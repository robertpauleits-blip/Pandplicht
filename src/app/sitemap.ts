import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { indexableRoutes } from "@/lib/seo/routes";
import { ARTICLES } from "@/content/knowledge";

/**
 * Sitemap met echte wijzigingsdatums. Kennisbankartikelen krijgen hun eigen
 * werkelijke controledatum mee. Voor overige pagina's zonder betrouwbare
 * wijzigingsdatum laten we lastModified weg; een build is geen inhoudsupdate.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const articleDates = new Map(
    ARTICLES.map((a) => [`/kennisbank/${a.slug}`, new Date(a.lastReviewedAt)]),
  );

  return indexableRoutes().map((r) => ({
    url: absoluteUrl(r.path),
    ...(articleDates.has(r.path)
      ? { lastModified: articleDates.get(r.path) }
      : {}),
    changeFrequency:
      r.path === "/"
        ? "weekly"
        : r.path.startsWith("/kennisbank")
          ? "monthly"
          : "monthly",
    priority: r.priority,
  }));
}
