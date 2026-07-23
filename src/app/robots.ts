import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

/**
 * Bewust robotsbeleid.
 *
 * Onderscheid tussen twee soorten AI-bots:
 * - Retrieval-/zoekbots (OAI-SearchBot, PerplexityBot) halen live pagina's op
 *   om ernaar te verwijzen in antwoorden → uitdrukkelijk toegestaan, dit is de
 *   kern van GEO (geciteerd worden in AI-antwoorden).
 * - Trainingscrawlers (GPTBot, ClaudeBot, CCBot) verzamelen tekst voor het
 *   trainen van modellen. Dit is een rechten-/eigendomskeuze los van
 *   zoekzichtbaarheid; vooralsnog geblokkeerd, de eigenaar kan dit wijzigen.
 *
 * Persoonlijke uitslagen, API-routes en de scanflow zijn nooit crawlbaar.
 */
const CONTENT_DISALLOW = ["/api/", "/pandcheck"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Live retrieval-/zoekbots van AI-assistenten: expliciet welkom.
      { userAgent: "OAI-SearchBot", allow: "/", disallow: CONTENT_DISALLOW },
      { userAgent: "PerplexityBot", allow: "/", disallow: CONTENT_DISALLOW },
      // Trainingscrawlers: geblokkeerd (eigenaarskeuze, kan aangezet worden).
      { userAgent: "GPTBot", disallow: "/" },
      { userAgent: "CCBot", disallow: "/" },
      { userAgent: "ClaudeBot", disallow: "/" },
      // Alle overige (waaronder Googlebot, Bingbot, Google-Extended): toegestaan.
      { userAgent: "*", allow: "/", disallow: CONTENT_DISALLOW },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
