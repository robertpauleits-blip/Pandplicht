export type ArticleSection =
  | { type: "kop"; text: string }
  | { type: "paragraaf"; text: string }
  | { type: "lijst"; items: string[]; geordend?: boolean }
  | { type: "tabel"; caption: string; headers: string[]; rows: string[][] };

export type ArticleFaq = { question: string; answer: string };

export type Article = {
  slug: string;
  title: string;
  description: string;
  category: string;
  searchIntent: string;
  publishedAt: string;
  lastReviewedAt: string;
  publisher: "PandPlicht";
  /** Bron-IDs uit de centrale registry; verplicht voor gereguleerde content. */
  sourceIds: string[];
  relatedTool: { href: string; label: string } | null;
  /** Zelfstandig leesbaar antwoord van ± 40–80 woorden, direct onder de H1. */
  kortAntwoord: string;
  sections: ArticleSection[];
  faq: ArticleFaq[];
  /** Slugs van gerelateerde artikelen. */
  related: string[];
  status: "published" | "draft" | "review_required";
};
