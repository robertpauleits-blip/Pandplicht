import { ARTICLES } from "@/content/knowledge";
import { TOPIC_PAGES } from "@/features/topics/topics-data";
import { TOOL_PAGES } from "@/features/tools/tools-data";

/**
 * Eén routebron voor sitemap én llms.txt, zodat die nooit uit de pas lopen.
 * Alleen inhoudelijke, unieke en indexeerbare pagina's; scanstappen en
 * persoonlijke uitslagen horen hier nooit in.
 */
export function indexableRoutes(): { path: string; priority: number }[] {
  return [
    { path: "/", priority: 1 },
    { path: "/tools", priority: 0.8 },
    ...TOOL_PAGES.map((t) => ({ path: t.path, priority: 0.9 })),
    { path: "/verplichtingen", priority: 0.9 },
    ...TOPIC_PAGES.map((t) => ({ path: t.path, priority: 0.8 })),
    { path: "/netcongestie", priority: 0.8 },
    { path: "/zakelijke-batterij", priority: 0.8 },
    { path: "/kennisbank", priority: 0.7 },
    ...ARTICLES.map((a) => ({ path: `/kennisbank/${a.slug}`, priority: 0.7 })),
    { path: "/bronnen-en-methodologie", priority: 0.5 },
    { path: "/voor-adviseurs", priority: 0.4 },
    { path: "/over-pandplicht", priority: 0.4 },
    { path: "/contact", priority: 0.3 },
    { path: "/privacy", priority: 0.2 },
    { path: "/cookies", priority: 0.2 },
    { path: "/disclaimer", priority: 0.2 },
  ];
}
