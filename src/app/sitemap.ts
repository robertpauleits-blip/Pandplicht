import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { indexableRoutes } from "@/lib/seo/routes";
import { ARTICLES } from "@/content/knowledge";

/**
 * Sitemap met echte wijzigingsdatums. Kennisbankartikelen krijgen hun eigen
 * controledatum mee (freshness-signaal en eerlijk); overige pagina's de
 * builddatum als beste benadering.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const build = new Date();
  const articleDates = new Map(
    ARTICLES.map((a) => [`/kennisbank/${a.slug}`, new Date(a.lastReviewedAt)]),
  );

  return indexableRoutes().map((r) => ({
    url: absoluteUrl(r.path),
    lastModified: articleDates.get(r.path) ?? build,
    changeFrequency:
      r.path === "/"
        ? "weekly"
        : r.path.startsWith("/kennisbank")
          ? "monthly"
          : "monthly",
    priority: r.priority,
  }));
}
