import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

/**
 * Bewust robotsbeleid (zie specificatie §15.7):
 * - OAI-SearchBot toegestaan → zichtbaarheid in ChatGPT Search gewenst;
 * - GPTBot (trainingscrawler) apart behandeld en vooralsnog geblokkeerd,
 *   deze keuze staat los van zoekzichtbaarheid en kan de eigenaar wijzigen;
 * - persoonlijke uitslagen, API-routes en de scanflow nooit crawlbaar.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
        disallow: ["/api/", "/pandcheck"],
      },
      {
        userAgent: "GPTBot",
        disallow: "/",
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/pandcheck"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
