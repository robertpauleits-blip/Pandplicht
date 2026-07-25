import { resolveRdPoint } from "./rd";

/**
 * Server-side adapter voor de Capaciteitskaart elektriciteitsnet van
 * Netbeheer Nederland (open ArcGIS FeatureServices, keyless).
 *
 * Let op de reikwijdte: de capaciteitskaart beschrijft een VOEDINGSGEBIED, niet
 * één aansluiting. Een kleur op de kaart zegt dus iets over de drukte op het
 * net in de omgeving, en is nadrukkelijk geen uitspraak over de aansluiting van
 * dit specifieke pand. Wij gebruiken deze data daarom alleen als context bij de
 * vraag of de netbeheerder beperkingen heeft gemeld; wij vullen die vraag nooit
 * automatisch in. Alleen de netbeheerder kan dat bevestigen.
 */

const BASE =
  "https://services.arcgis.com/nSZVuSZjHpEZZbRo/arcgis/rest/services";
const AFNAME_SERVICE = "Capaciteitskaart_elektriciteitsnet_v2_afname";
const TERUGLEVERING_SERVICE =
  "Capaciteitskaart_elektriciteitsnet_v2_teruglevering";
const TIMEOUT_MS = 6_000;
const CACHE_TTL_MS = 12 * 60 * 60 * 1000;

/** Statuscategorieën zoals de officiële kaart ze hanteert. */
export type CapaciteitStatus =
  | "beschikbaar"
  | "beperkt"
  | "in_onderzoek"
  | "tekort"
  | "onbekend";

export type NetcapaciteitGebied = {
  afname: CapaciteitStatus;
  teruglevering: CapaciteitStatus;
  voedingsgebied: string | null;
  netbeheerder: string | null;
  /** Aantal openstaande verzoeken in de wachtrij, indien gepubliceerd. */
  wachtrijAfname: number | null;
  wachtrijTeruglevering: number | null;
};

export type Netcapaciteit =
  | { status: "uitgeschakeld" }
  | { status: "not_found" }
  | { status: "error" }
  | ({ status: "found" } & NetcapaciteitGebied);

/** Nederlandse omschrijving per status, in de bewoording van de kaart zelf. */
export const CAPACITEIT_LABEL: Record<CapaciteitStatus, string> = {
  beschikbaar: "Transportcapaciteit beschikbaar zonder wachtrij",
  beperkt: "Transportcapaciteit beperkt beschikbaar zonder wachtrij",
  in_onderzoek: "Gebied is in onderzoek met wachtrij",
  tekort: "Tekort aan transportcapaciteit met wachtrij",
  onbekend: "Nog niet vastgesteld",
};

/**
 * Vertaalt de numerieke code van de kaart naar onze status.
 *
 * Dit volgt exact de logica van de officiële kaartweergave: code 0 betekent
 * alleen "beschikbaar" wanneer er een echt voedingsgebied bekend is; staat de
 * gebiedsnaam op "0", dan is het gebied simpelweg nog niet ingekleurd.
 */
export function mapCapaciteitCode(
  code: unknown,
  voedingsgebiedNaam: unknown,
): CapaciteitStatus {
  // Let op: Number(null) en Number("") zijn 0. Zonder deze controle zou een
  // ontbrekende waarde als "capaciteit beschikbaar" worden gelezen, en dat is
  // precies de verkeerde kant om op te vergissen.
  if (typeof code !== "number" && typeof code !== "string") return "onbekend";
  if (typeof code === "string" && code.trim() === "") return "onbekend";
  const n = Number(code);
  const naam = String(voedingsgebiedNaam ?? "").trim();
  if (!Number.isFinite(n)) return "onbekend";
  if (n === 1) return "beperkt";
  if (n === 2) return "in_onderzoek";
  if (n === 3) return "tekort";
  if (n === 0) return naam && naam !== "0" ? "beschikbaar" : "onbekend";
  return "onbekend";
}

/** Is dit een signaal dat de bezoeker echt moet weten? */
export function isKnelpunt(status: CapaciteitStatus): boolean {
  return status === "in_onderzoek" || status === "tekort";
}

type CacheEntry = { value: Netcapaciteit; expiresAt: number };
const cache = new Map<string, CacheEntry>();

function getal(v: unknown): number | null {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function tekst(v: unknown): string | null {
  const s = typeof v === "string" ? v.trim() : "";
  return s && s !== "0" ? s : null;
}

/** Bevraag één capaciteitslaag op een RD-punt. */
async function queryLaag(
  service: string,
  x: number,
  y: number,
): Promise<Record<string, unknown> | null> {
  const params = new URLSearchParams({
    f: "json",
    geometry: JSON.stringify({
      x,
      y,
      spatialReference: { wkid: 28992 },
    }),
    geometryType: "esriGeometryPoint",
    inSR: "28992",
    spatialRel: "esriSpatialRelIntersects",
    outFields: "*",
    returnGeometry: "false",
    resultRecordCount: "1",
  });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE}/${service}/FeatureServer/0/query?${params}`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
      next: { revalidate: 60 * 60 * 12 },
    });
    if (!res.ok) throw new Error(`status ${res.status}`);
    const data = (await res.json()) as {
      features?: { attributes?: Record<string, unknown> }[];
    };
    return data.features?.[0]?.attributes ?? null;
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchNetcapaciteit(params: {
  postcode: string;
  huisnummer: string;
  toevoeging?: string;
}): Promise<Netcapaciteit> {
  const postcode = params.postcode.toUpperCase().replace(/\s+/g, "");
  const huisnummer = params.huisnummer.replace(/\D/g, "");
  const toevoeging = (params.toevoeging ?? "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 6);

  if (
    !/^[1-9][0-9]{3}[A-Z]{2}$/.test(postcode) ||
    !/^[1-9][0-9]{0,4}$/.test(huisnummer)
  ) {
    return { status: "error" };
  }

  const cacheKey = `${postcode}-${huisnummer}-${toevoeging}`;
  const hit = cache.get(cacheKey);
  if (hit && hit.expiresAt > Date.now()) return hit.value;

  const put = (value: Netcapaciteit) => {
    cache.set(cacheKey, { value, expiresAt: Date.now() + CACHE_TTL_MS });
    return value;
  };

  try {
    const punt = await resolveRdPoint(postcode, huisnummer, toevoeging);
    if (!punt) return put({ status: "not_found" });

    // De twee lagen hebben eigen gebiedsindelingen: afname en teruglevering
    // kennen niet dezelfde voedingsgebieden. Daarom bevragen we ze allebei.
    const [afnameAttrs, terugAttrs] = await Promise.all([
      queryLaag(AFNAME_SERVICE, punt.x, punt.y),
      queryLaag(TERUGLEVERING_SERVICE, punt.x, punt.y),
    ]);

    if (!afnameAttrs && !terugAttrs) return put({ status: "not_found" });

    const afname = afnameAttrs
      ? mapCapaciteitCode(afnameAttrs.afname, afnameAttrs.voedingsgebied_naam)
      : "onbekend";
    const teruglevering = terugAttrs
      ? mapCapaciteitCode(terugAttrs.opwek, terugAttrs.voedingsgebied_naam)
      : "onbekend";

    const bron = afnameAttrs ?? terugAttrs ?? {};
    return put({
      status: "found",
      afname,
      teruglevering,
      voedingsgebied: tekst(bron.voedingsgebied_naam),
      netbeheerder: tekst(bron.RNB),
      wachtrijAfname: getal(afnameAttrs?.wachtrij_afname),
      wachtrijTeruglevering: getal(terugAttrs?.wachtrij_invoeding),
    });
  } catch {
    return { status: "error" };
  }
}
