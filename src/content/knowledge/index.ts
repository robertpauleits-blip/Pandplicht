import type { Article } from "../types";
import { SOURCES } from "@/rules/sources";
import { ARTIKELEN_VERPLICHTINGEN } from "./articles-verplichtingen";
import { ARTIKELEN_NETCONGESTIE } from "./articles-netcongestie";
import { ARTIKELEN_BATTERIJ } from "./articles-batterij";

const ALL: Article[] = [
  ...ARTIKELEN_VERPLICHTINGEN,
  ...ARTIKELEN_NETCONGESTIE,
  ...ARTIKELEN_BATTERIJ,
];

/**
 * Buildvalidatie van de contentset. Faalt hard bij:
 * dubbele slugs, ontbrekende beschrijving, onbekende bron-IDs of
 * gepubliceerde artikelen zonder bronnen.
 */
function validate(articles: Article[]): Article[] {
  const seen = new Set<string>();
  for (const a of articles) {
    if (seen.has(a.slug)) throw new Error(`Dubbele artikel-slug: ${a.slug}`);
    seen.add(a.slug);
    if (a.status !== "published") continue;
    if (!a.description) throw new Error(`Artikel zonder beschrijving: ${a.slug}`);
    if (!a.kortAntwoord) throw new Error(`Artikel zonder kort antwoord: ${a.slug}`);
    if (a.sourceIds.length === 0) {
      throw new Error(`Gepubliceerd artikel zonder bronnen: ${a.slug}`);
    }
    for (const id of a.sourceIds) {
      if (!SOURCES[id]) throw new Error(`Onbekende bron-ID '${id}' in ${a.slug}`);
    }
    for (const rel of a.related) {
      if (!articles.some((x) => x.slug === rel)) {
        throw new Error(`Onbekend gerelateerd artikel '${rel}' in ${a.slug}`);
      }
    }
  }
  return articles;
}

export const ARTICLES: Article[] = validate(ALL).filter(
  (a) => a.status === "published",
);

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function getRecentArticles(n: number): Article[] {
  return [...ARTICLES]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, n);
}

export function getArticlesByCategory(): Map<string, Article[]> {
  const map = new Map<string, Article[]>();
  for (const a of ARTICLES) {
    const list = map.get(a.category) ?? [];
    list.push(a);
    map.set(a.category, list);
  }
  return map;
}

export function getRelatedArticles(article: Article): Article[] {
  return article.related
    .map((slug) => getArticle(slug))
    .filter((a): a is Article => Boolean(a));
}
