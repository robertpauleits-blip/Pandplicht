import Script from "next/script";

/**
 * Laadt het cookieloze analytics-script, alleen wanneer een provider én de
 * bijbehorende id/domein via omgevingsvariabelen zijn geconfigureerd. Zonder
 * configuratie rendert dit niets (geen netwerkverkeer, geen tracking).
 *
 * Zowel Plausible als Umami zijn cookieloos en verzamelen geen persoons-
 * gegevens; onder de AVG is hiervoor geen cookiebanner of toestemming nodig.
 * De custom events worden verstuurd via `@/lib/analytics` (track()).
 *
 * Aanzetten via Netlify environment variables, bijvoorbeeld Umami Cloud:
 *   NEXT_PUBLIC_ANALYTICS_PROVIDER = umami
 *   NEXT_PUBLIC_UMAMI_WEBSITE_ID   = <website-id uit Umami>
 * of Plausible:
 *   NEXT_PUBLIC_ANALYTICS_PROVIDER = plausible
 *   NEXT_PUBLIC_PLAUSIBLE_DOMAIN   = pandplicht.nl
 */
export function Analytics() {
  const provider = process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER;

  if (provider === "umami") {
    const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
    const src =
      process.env.NEXT_PUBLIC_UMAMI_SRC || "https://cloud.umami.is/script.js";
    if (!websiteId) return null;
    return (
      <Script
        src={src}
        data-website-id={websiteId}
        strategy="afterInteractive"
        defer
      />
    );
  }

  if (provider === "plausible") {
    const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
    const src =
      process.env.NEXT_PUBLIC_PLAUSIBLE_SRC ||
      "https://plausible.io/js/script.js";
    if (!domain) return null;
    return (
      <Script
        src={src}
        data-domain={domain}
        strategy="afterInteractive"
        defer
      />
    );
  }

  return null;
}
