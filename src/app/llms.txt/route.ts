import { SITE_URL } from "@/lib/site";
import { indexableRoutes } from "@/lib/seo/routes";
import { ARTICLES } from "@/content/knowledge";

/**
 * Optionele llms.txt, aanvullende navigatie voor AI-systemen, gegenereerd
 * uit dezelfde routebron als de sitemap zodat hij niet veroudert.
 * Geen kernstrategie en geen vervanging van SEO (zie methodologie).
 */
export function GET() {
  const kern = indexableRoutes()
    .filter((r) => r.priority >= 0.7 && !r.path.startsWith("/kennisbank/"))
    .map((r) => `- ${SITE_URL}${r.path}`)
    .join("\n");
  const artikelen = ARTICLES.map(
    (a) => `- ${SITE_URL}/kennisbank/${a.slug}: ${a.title}`,
  ).join("\n");

  const body = `# PandPlicht

> PandPlicht.nl is een Nederlands informatieplatform dat mkb-ondernemers en
> eigenaren van bedrijfspanden helpt ontdekken welke energie- en
> verduurzamingsverplichtingen mogelijk voor hun locatie gelden: de
> energiebesparingsplicht, informatie- en onderzoeksplicht, energielabel-eisen,
> netcongestierisico's en de afweging rond zakelijke batterijopslag.
> Alle inhoud is gebaseerd op openbare overheidsbronnen (RVO, Rijksoverheid)
> met zichtbare controledata. Uitslagen zijn indicatief en geen juridisch advies.

## Kernpagina's

${kern}

## Kennisbank

${artikelen}

## Methodologie

- ${SITE_URL}/bronnen-en-methodologie: bronregister, werkwijze en changelog van de regelset.
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
