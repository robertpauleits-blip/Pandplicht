import type { Hoofdgebruik } from "@/rules/types";

/**
 * Server-side BAG-adapter (Basisregistratie Adressen en Gebouwen), keyless.
 *
 * Twee stappen, beide via officiële open PDOK-diensten:
 *  1. Locatieserver: postcode + huisnummer -> adresseerbaarobject-id (het
 *     BAG verblijfsobject-id).
 *  2. BAG WFS: dat verblijfsobject -> gebruiksdoel(en), oppervlakte en bouwjaar.
 *
 * Zo halen we de gebruiksfunctie, oppervlakte en het bouwjaar automatisch op,
 * zodat de gebruiker die niet meer hoeft in te vullen. Geen sleutel nodig.
 * Bij een storing of onbekend adres volgt een nette terugval (status !== found)
 * en blijft handmatige invoer mogelijk.
 */

const LOCATIESERVER = "https://api.pdok.nl/bzk/locatieserver/search/v3_1";
const BAG_WFS = "https://service.pdok.nl/lv/bag/wfs/v2_0";
const TIMEOUT_MS = 5_000;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // BAG verandert zelden

export type BagKenmerken =
  | { status: "not_found" }
  | { status: "error" }
  | {
      status: "found";
      /** Ruwe BAG-gebruiksdoelen, bijv. ["kantoorfunctie","industriefunctie"]. */
      gebruiksdoelen: string[];
      /** Gemapt naar onze interne enum; null als niet zakelijk (bijv. woonfunctie). */
      hoofdgebruik: Hoofdgebruik | null;
      /** true bij meerdere verschillende zakelijke functies. */
      gemengd: boolean;
      /** true als er (ook) een woonfunctie is. */
      heeftWoonfunctie: boolean;
      oppervlakteM2: number | null;
      bouwjaar: number | null;
    };

/** BAG-gebruiksdoel -> interne Hoofdgebruik. Woonfunctie telt niet als zakelijk. */
const GEBRUIKSDOEL_MAP: Record<string, Hoofdgebruik> = {
  kantoorfunctie: "kantoor",
  winkelfunctie: "winkel",
  industriefunctie: "industrie",
  gezondheidszorgfunctie: "zorg",
  onderwijsfunctie: "onderwijs",
  sportfunctie: "sport",
  bijeenkomstfunctie: "bijeenkomst",
  logiesfunctie: "anders",
  celfunctie: "anders",
  "overige gebruiksfunctie": "anders",
};

export function mapGebruiksdoelen(gebruiksdoelen: string[]): {
  hoofdgebruik: Hoofdgebruik | null;
  gemengd: boolean;
  heeftWoonfunctie: boolean;
} {
  const parts = gebruiksdoelen.map((s) => s.trim().toLowerCase()).filter(Boolean);
  const heeftWoonfunctie = parts.includes("woonfunctie");
  const zakelijk = [
    ...new Set(
      parts
        .filter((p) => p !== "woonfunctie")
        .map((p) => GEBRUIKSDOEL_MAP[p] ?? "anders"),
    ),
  ];
  if (zakelijk.length === 0) {
    // Alleen woonfunctie (of leeg): geen zakelijke functie om voor te vullen.
    return { hoofdgebruik: null, gemengd: false, heeftWoonfunctie };
  }
  if (zakelijk.length === 1) {
    return { hoofdgebruik: zakelijk[0]!, gemengd: false, heeftWoonfunctie };
  }
  return { hoofdgebruik: "gemengd", gemengd: true, heeftWoonfunctie };
}

type CacheEntry = { value: BagKenmerken; expiresAt: number };
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

/** Stap 1: exact verblijfsobject-id ophalen via de Locatieserver. */
async function resolveVerblijfsobjectId(
  postcode: string,
  huisnummer: string,
  toevoeging: string,
): Promise<string | null> {
  const q = `${postcode} ${huisnummer}${toevoeging ? ` ${toevoeging}` : ""}`;
  const params = new URLSearchParams({
    q,
    fq: "type:adres",
    rows: "5",
    fl: "adresseerbaarobject_id,postcode,huisnummer,huisletter,huisnummertoevoeging",
  });
  const data = (await fetchJson(`${LOCATIESERVER}/free?${params}`)) as {
    response?: { docs?: Record<string, unknown>[] };
  };
  const docs = data.response?.docs ?? [];
  const pc = postcode.toUpperCase().replace(/\s+/g, "");
  const exact = docs.find(
    (d) =>
      String(d.postcode ?? "").toUpperCase().replace(/\s+/g, "") === pc &&
      String(d.huisnummer ?? "") === huisnummer,
  );
  const chosen = exact ?? docs[0];
  const id = chosen?.adresseerbaarobject_id;
  return typeof id === "string" && id ? id : null;
}

/** Stap 2: kenmerken van het verblijfsobject ophalen via de BAG WFS. */
async function fetchVerblijfsobject(id: string): Promise<{
  gebruiksdoelen: string[];
  oppervlakteM2: number | null;
  bouwjaar: number | null;
} | null> {
  const filter =
    `<Filter xmlns="http://www.opengis.net/fes/2.0">` +
    `<PropertyIsEqualTo><ValueReference>identificatie</ValueReference>` +
    `<Literal>${id}</Literal></PropertyIsEqualTo></Filter>`;
  const params = new URLSearchParams({
    service: "WFS",
    version: "2.0.0",
    request: "GetFeature",
    typeNames: "bag:verblijfsobject",
    outputFormat: "application/json",
    count: "1",
    filter,
  });
  const data = (await fetchJson(`${BAG_WFS}?${params}`)) as {
    features?: { properties?: Record<string, unknown> }[];
  };
  const props = data.features?.[0]?.properties;
  if (!props) return null;

  const gebruiksdoelen = String(props.gebruiksdoel ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const opp = Number(props.oppervlakte);
  const bj = Number(props.bouwjaar);
  return {
    gebruiksdoelen,
    oppervlakteM2: Number.isFinite(opp) && opp > 0 ? Math.round(opp) : null,
    bouwjaar: Number.isFinite(bj) && bj > 1500 ? bj : null,
  };
}

export async function fetchBagKenmerken(params: {
  postcode: string;
  huisnummer: string;
  toevoeging?: string;
}): Promise<BagKenmerken> {
  const postcode = params.postcode.toUpperCase().replace(/\s+/g, "");
  const huisnummer = params.huisnummer.replace(/\D/g, "");
  const toevoeging = (params.toevoeging ?? "").replace(/[^a-zA-Z0-9]/g, "").slice(0, 6);

  if (!/^[1-9][0-9]{3}[A-Z]{2}$/.test(postcode) || !/^[1-9][0-9]{0,4}$/.test(huisnummer)) {
    return { status: "error" };
  }

  const cacheKey = `${postcode}-${huisnummer}-${toevoeging}`;
  const hit = cache.get(cacheKey);
  if (hit && hit.expiresAt > Date.now()) return hit.value;

  try {
    const id = await resolveVerblijfsobjectId(postcode, huisnummer, toevoeging);
    if (!id) {
      const value: BagKenmerken = { status: "not_found" };
      cache.set(cacheKey, { value, expiresAt: Date.now() + CACHE_TTL_MS });
      return value;
    }
    const vo = await fetchVerblijfsobject(id);
    if (!vo) {
      const value: BagKenmerken = { status: "not_found" };
      cache.set(cacheKey, { value, expiresAt: Date.now() + CACHE_TTL_MS });
      return value;
    }
    const mapped = mapGebruiksdoelen(vo.gebruiksdoelen);
    const value: BagKenmerken = {
      status: "found",
      gebruiksdoelen: vo.gebruiksdoelen,
      hoofdgebruik: mapped.hoofdgebruik,
      gemengd: mapped.gemengd,
      heeftWoonfunctie: mapped.heeftWoonfunctie,
      oppervlakteM2: vo.oppervlakteM2,
      bouwjaar: vo.bouwjaar,
    };
    cache.set(cacheKey, { value, expiresAt: Date.now() + CACHE_TTL_MS });
    return value;
  } catch {
    return { status: "error" };
  }
}
