import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";
import type { FaqEntry } from "@/components/marketing/Faq";

/**
 * JSON-LD helpers. Markup komt altijd overeen met zichtbare content;
 * geen fictieve organisatiegegevens, reviews of ratings.
 */

export function JsonLd({ data }: { data: object | object[] }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/icon.svg"),
    image: absoluteUrl("/opengraph-image"),
    description:
      "PandPlicht biedt een gratis, indicatieve online check voor energie- en verduurzamingsverplichtingen van Nederlandse bedrijfspanden.",
    areaServed: { "@type": "Country", name: "Nederland" },
    knowsAbout: [
      "Energiebesparingsplicht",
      "Informatieplicht energiebesparing",
      "Onderzoeksplicht energiebesparing",
      "Energielabel C voor kantoren",
      "Energielabel utiliteitsbouw",
      "Netcongestie",
      "Zakelijke batterijopslag",
    ],
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "nl-NL",
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };
}

/** Service-schema voor de gratis PandCheck (alleen feitelijke, zichtbare claims). */
export function serviceLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "PandCheck",
    serviceType: "Indicatieve check energie- en verduurzamingsplichten bedrijfspand",
    provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    areaServed: { "@type": "Country", name: "Nederland" },
    url: absoluteUrl("/pandcheck"),
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    description:
      "Gratis indicatieve check die per bedrijfspand laat zien welke energie- en verduurzamingsverplichtingen, netcongestierisico's en batterijkansen mogelijk spelen, met bronnen en peildatum.",
  };
}

export function webPageLd(opts: { title: string; description: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: opts.title,
    description: opts.description,
    url: absoluteUrl(opts.path),
    inLanguage: "nl-NL",
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** Alleen gebruiken wanneer de vragen én volledige antwoorden zichtbaar op de pagina staan. */
export function faqLd(items: FaqEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function articleLd(opts: {
  title: string;
  description: string;
  path: string;
  publishedAt: string;
  lastReviewedAt: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    url: absoluteUrl(opts.path),
    inLanguage: "nl-NL",
    datePublished: opts.publishedAt,
    dateModified: opts.lastReviewedAt,
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    author: { "@type": "Organization", name: `Redactie ${SITE_NAME}` },
  };
}
