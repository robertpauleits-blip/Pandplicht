/**
 * Server-side monument-adapter (rijksmonumenten), keyless.
 *
 * Bepaalt of een pand een rijksmonument is via twee officiële open bronnen:
 *  1. PDOK Locatieserver: postcode + huisnummer -> RD-coördinaat van het pand.
 *  2. PDOK RCE "Beschermde gebieden - cultuurhistorie" (INSPIRE ProtectedSites,
 *     bron: Rijksdienst voor het Cultureel Erfgoed).
 *
 * Belangrijk: die dataset bevat zowel individuele rijksmonumenten
 * (namespace nlps-rijksmonumenten) als beschermde stads- en dorpsgezichten
 * (namespace nlps-stadsendorpsgezichten). Een gezicht is een heel GEBIED; een
 * pand daarbinnen is niet automatisch zelf een monument. We onderscheiden die
 * twee daarom streng: alleen een individueel rijksmonument vult de
 * monumentvraag automatisch met "ja". Een gezicht melden we informatief.
 */

import { resolveRdPoint } from "./rd";

const RCE_WFS = "https://service.pdok.nl/rce/ps-ch/wfs/v1_0";
const RD_SRS = "urn:ogc:def:crs:EPSG::28992";
const PUNT_STRAAL_M = 3; // strakke terugval voor monumenten zonder vlakgeometrie
const TIMEOUT_MS = 5_000;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

const NS_RIJKSMONUMENT = "nlps-rijksmonumenten";
const NS_GEZICHT = "nlps-stadsendorpsgezichten";

export type MonumentStatus =
  | { status: "not_found" }
  | { status: "error" }
  | {
      status: "rijksmonument";
      /** Rijksmonumentnummer (zonder ".00"-suffix), bijv. "10001". */
      monumentnummer: string | null;
      /** Link naar het officiële monumentenregister. */
      registerUrl: string | null;
      /** "vlak" = coördinaat binnen monumentvlak; "punt" = monumentpunt vlakbij. */
      match: "vlak" | "punt";
    }
  | {
      status: "beschermd_gezicht";
      /** Link naar de beschrijving van het beschermde gezicht. */
      registerUrl: string | null;
    };

type Props = Record<string, unknown>;

/** Maak van een localid ("10001.00") een net rijksmonumentnummer ("10001"). */
export function formatMonumentnummer(localid: unknown): string | null {
  if (typeof localid !== "string" || !localid) return null;
  return localid.replace(/\.0+$/, "");
}

function str(v: unknown): string | null {
  return typeof v === "string" && v ? v : null;
}

function isRijksmonument(p: Props): boolean {
  return (
    String(p.namespace ?? "").toLowerCase() === NS_RIJKSMONUMENT ||
    String(p.ci_citation ?? "").includes("/monumenten/")
  );
}

function isGezicht(p: Props): boolean {
  return (
    String(p.namespace ?? "").toLowerCase() === NS_GEZICHT ||
    /gezicht/i.test(String(p.ci_citation ?? ""))
  );
}

/**
 * Kies uit intersectende features de meest relevante status. Een individueel
 * rijksmonument wint altijd van een beschermd gezicht.
 */
export function classifyFeatures(
  features: Props[],
): MonumentStatus & { status: "rijksmonument" | "beschermd_gezicht" } | null {
  const rm = features.find(isRijksmonument);
  if (rm) {
    return {
      status: "rijksmonument",
      monumentnummer: formatMonumentnummer(rm.localid),
      registerUrl: str(rm.ci_citation),
      match: "vlak",
    };
  }
  const gz = features.find(isGezicht);
  if (gz) {
    return { status: "beschermd_gezicht", registerUrl: str(gz.ci_citation) };
  }
  return null;
}

type CacheEntry = { value: MonumentStatus; expiresAt: number };
const cache = new Map<string, CacheEntry>();

async function fetchJson(url: string): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
      next: { revalidate: 60 * 60 * 24 },
    });
    if (!res.ok) throw new Error(`status ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

function puntGml(x: number, y: number): string {
  return `<gml:Point srsName="${RD_SRS}"><gml:pos>${x} ${y}</gml:pos></gml:Point>`;
}

/** Vraag de RCE-WFS met een ruimtelijk filter; geef alle features (props) terug. */
async function queryRce(
  layer: "rce_inspire_polygons" | "rce_inspire_points",
  filterXml: string,
): Promise<Props[]> {
  const params = new URLSearchParams({
    service: "WFS",
    version: "2.0.0",
    request: "GetFeature",
    typeNames: `ps-ch:${layer}`,
    outputFormat: "application/json",
    srsName: RD_SRS,
    count: "20",
    filter: filterXml,
  });
  const data = (await fetchJson(`${RCE_WFS}?${params}`)) as {
    features?: { properties?: Props }[];
  };
  return (data.features ?? [])
    .map((f) => f.properties)
    .filter((p): p is Props => !!p);
}

export async function fetchMonumentStatus(params: {
  postcode: string;
  huisnummer: string;
  toevoeging?: string;
}): Promise<MonumentStatus> {
  const postcode = params.postcode.toUpperCase().replace(/\s+/g, "");
  const huisnummer = params.huisnummer.replace(/\D/g, "");
  const toevoeging = (params.toevoeging ?? "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 6);

  if (!/^[1-9][0-9]{3}[A-Z]{2}$/.test(postcode) || !/^[1-9][0-9]{0,4}$/.test(huisnummer)) {
    return { status: "error" };
  }

  const cacheKey = `${postcode}-${huisnummer}-${toevoeging}`;
  const hit = cache.get(cacheKey);
  if (hit && hit.expiresAt > Date.now()) return hit.value;

  const put = (value: MonumentStatus) => {
    cache.set(cacheKey, { value, expiresAt: Date.now() + CACHE_TTL_MS });
    return value;
  };

  try {
    const point = await resolveRdPoint(postcode, huisnummer, toevoeging);
    if (!point) return put({ status: "not_found" });

    // 1. Welke beschermde vlakken liggen op deze coördinaat?
    const vlakFilter =
      `<fes:Filter xmlns:fes="http://www.opengis.net/fes/2.0" xmlns:gml="http://www.opengis.net/gml/3.2">` +
      `<fes:Intersects><fes:ValueReference>geometry</fes:ValueReference>` +
      `${puntGml(point.x, point.y)}</fes:Intersects></fes:Filter>`;
    const vlakken = await queryRce("rce_inspire_polygons", vlakFilter);
    const vlakStatus = classifyFeatures(vlakken);

    // Een individueel rijksmonument-vlak is de sterkste uitkomst.
    if (vlakStatus?.status === "rijksmonument") return put(vlakStatus);

    // 2. Ook zonder vlak kan het pand een rijksmonument zijn dat alleen als
    //    punt is geregistreerd. Zoek een rijksmonument-punt vlak naast de coörd.
    const puntFilter =
      `<fes:Filter xmlns:fes="http://www.opengis.net/fes/2.0" xmlns:gml="http://www.opengis.net/gml/3.2">` +
      `<fes:DWithin><fes:ValueReference>geometry</fes:ValueReference>` +
      `${puntGml(point.x, point.y)}` +
      `<fes:Distance uom="m">${PUNT_STRAAL_M}</fes:Distance></fes:DWithin></fes:Filter>`;
    const punten = await queryRce("rce_inspire_points", puntFilter);
    const puntMonument = punten.find(isRijksmonument);
    if (puntMonument) {
      return put({
        status: "rijksmonument",
        monumentnummer: formatMonumentnummer(puntMonument.localid),
        registerUrl: str(puntMonument.ci_citation),
        match: "punt",
      });
    }

    // 3. Geen individueel monument, maar mogelijk wel een beschermd gezicht.
    if (vlakStatus?.status === "beschermd_gezicht") return put(vlakStatus);

    return put({ status: "not_found" });
  } catch {
    return { status: "error" };
  }
}
