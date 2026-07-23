/**
 * Centrale site-configuratie.
 * Juridische gegevens (KvK, vestigingsadres, rechtsvorm) bestaan nog niet en
 * blijven leeg tot ze echt zijn geregeld; lege velden worden nergens getoond.
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.pandplicht.nl";

export const SITE_NAME = "PandPlicht";

export const SITE_DESCRIPTION =
  "Gratis indicatieve check voor bedrijfspanden: energieverplichtingen, energielabel, netcongestie en zakelijke batterijopslag. Helder uitgelegd en met bronnen.";

export const SITE_TAGLINE =
  "Ontdek wat er mogelijk voor uw bedrijfspand geldt.";

/** Juridische configuratie, alleen tonen wat echt bestaat. */
export const LEGAL = {
  kvkNummer: "" as string,
  vestigingsadres: "" as string,
  rechtsvorm: "" as string,
  /** Contact-e-mailadres; leeg = contactformulier-melding tonen zonder adres. */
  contactEmail: "" as string,
};

export const DISCLAIMER_SHORT =
  "PandPlicht biedt een indicatieve eerste check en geen juridisch of technisch advies.";

/** Feature flags (server-side gelezen; nooit secrets). */
export const FLAGS = {
  adsEnabled: process.env.ADS_ENABLED === "true",
  epOnlineIntegration: process.env.ENABLE_EP_ONLINE_INTEGRATION === "true",
  liveGridData: process.env.ENABLE_LIVE_GRID_DATA === "true",
};

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
