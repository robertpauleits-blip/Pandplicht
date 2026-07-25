import type { Hoofdgebruik, KantoorAandeel } from "@/rules/types";

/**
 * Server-side BAG-adapter (Basisregistratie Adressen en Gebouwen), keyless.
 *
 * Drie stappen, alle via officiële open PDOK-diensten:
 *  1. Locatieserver: postcode + huisnummer -> adresseerbaarobject-id (het
 *     BAG verblijfsobject-id).
 *  2. BAG WFS: dat verblijfsobject -> gebruiksdoel(en), oppervlakte, bouwjaar
 *     en de pandidentificatie.
 *  3. BAG WFS: alle verblijfsobjecten in datzelfde pand -> samenstelling van
 *     het gebouw, waarmee we het kantooraandeel kunnen afleiden.
 *
 * Zo halen we de gebruiksfunctie, oppervlakte, het bouwjaar en het
 * kantooraandeel automatisch op, zodat de gebruiker die niet meer hoeft in te
 * vullen. Geen sleutel nodig. Bij een storing of onbekend adres volgt een nette
 * terugval (status !== found) en blijft handmatige invoer mogelijk.
 */

const LOCATIESERVER = "https://api.pdok.nl/bzk/locatieserver/search/v3_1";
const BAG_WFS = "https://service.pdok.nl/lv/bag/wfs/v2_0";
const TIMEOUT_MS = 5_000;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // BAG verandert zelden

/**
 * Samenstelling van het hele pand, afgeleid uit alle verblijfsobjecten die
 * dezelfde pandidentificatie delen.
 */
export type PandSamenstelling = {
  aantalVerblijfsobjecten: number;
  totaalM2: number;
  /** m² van verblijfsobjecten met uitsluitend een kantoorfunctie. */
  kantoorM2: number;
  /**
   * m² van verblijfsobjecten die kantoorfunctie combineren met een andere
   * functie. De BAG splitst die oppervlakte niet, dus dit deel is onzeker.
   */
  onzekerM2: number;
  /** Ondergrens van het kantooraandeel (onzekere m² tellen niet mee), 0-100. */
  kantoorPctMin: number;
  /** Bovengrens van het kantooraandeel (onzekere m² tellen wél mee), 0-100. */
  kantoorPctMax: number;
  /**
   * Alleen gevuld wanneer de uitkomst niet van de onzekere m² afhangt:
   * de boven- én ondergrens vallen dan aan dezelfde kant van de 50%-grens.
   */
  kantoorAandeel: KantoorAandeel | null;
};

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
      /** null wanneer de pandsamenstelling niet op te halen was. */
      pand: PandSamenstelling | null;
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

/** Eén verblijfsobject zoals wij het voor de pandsamenstelling nodig hebben. */
export type VboRegel = { gebruiksdoel: string; oppervlakteM2: number };

/**
 * Leidt de samenstelling van een pand af uit zijn verblijfsobjecten.
 *
 * Een verblijfsobject kan meerdere gebruiksdoelen tegelijk hebben (bijv.
 * "kantoorfunctie,woonfunctie") zonder dat de BAG de oppervlakte over die
 * functies verdeelt. Die m² zijn dus onzeker. We rekenen daarom met een onder-
 * en bovengrens en vullen het kantooraandeel alleen automatisch in wanneer
 * beide grenzen aan dezelfde kant van de 50%-grens liggen. Zo geven we nooit
 * een schijnzeker antwoord op een vraag die de label-C-plicht bepaalt.
 */
export function bepaalPandSamenstelling(vbos: VboRegel[]): PandSamenstelling {
  let totaalM2 = 0;
  let kantoorM2 = 0;
  let onzekerM2 = 0;

  for (const vbo of vbos) {
    const m2 = Number.isFinite(vbo.oppervlakteM2) ? Math.max(vbo.oppervlakteM2, 0) : 0;
    if (m2 <= 0) continue;
    const doelen = vbo.gebruiksdoel
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    totaalM2 += m2;
    const heeftKantoor = doelen.includes("kantoorfunctie");
    if (!heeftKantoor) continue;
    if (doelen.length === 1) kantoorM2 += m2;
    else onzekerM2 += m2;
  }

  if (totaalM2 <= 0) {
    return {
      aantalVerblijfsobjecten: vbos.length,
      totaalM2: 0,
      kantoorM2: 0,
      onzekerM2: 0,
      kantoorPctMin: 0,
      kantoorPctMax: 0,
      kantoorAandeel: null,
    };
  }

  const pctMin = (kantoorM2 / totaalM2) * 100;
  const pctMax = ((kantoorM2 + onzekerM2) / totaalM2) * 100;
  const kantoorAandeel: KantoorAandeel | null =
    pctMax < 50 ? "lt50" : pctMin >= 50 ? "gte50" : null;

  return {
    aantalVerblijfsobjecten: vbos.length,
    totaalM2,
    kantoorM2,
    onzekerM2,
    kantoorPctMin: Math.round(pctMin),
    kantoorPctMax: Math.round(pctMax),
    kantoorAandeel,
  };
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

/** Haal verblijfsobjecten op met een gelijkheidsfilter op één veld. */
async function queryVerblijfsobjecten(
  veld: "identificatie" | "pandidentificatie",
  waarde: string,
  count: number,
): Promise<Record<string, unknown>[]> {
  const filter =
    `<Filter xmlns="http://www.opengis.net/fes/2.0">` +
    `<PropertyIsEqualTo><ValueReference>${veld}</ValueReference>` +
    `<Literal>${waarde}</Literal></PropertyIsEqualTo></Filter>`;
  const params = new URLSearchParams({
    service: "WFS",
    version: "2.0.0",
    request: "GetFeature",
    typeNames: "bag:verblijfsobject",
    outputFormat: "application/json",
    count: String(count),
    filter,
  });
  const data = (await fetchJson(`${BAG_WFS}?${params}`)) as {
    features?: { properties?: Record<string, unknown> }[];
  };
  return (data.features ?? [])
    .map((f) => f.properties)
    .filter((p): p is Record<string, unknown> => !!p);
}

/** Stap 2: kenmerken van het verblijfsobject ophalen via de BAG WFS. */
async function fetchVerblijfsobject(id: string): Promise<{
  gebruiksdoelen: string[];
  oppervlakteM2: number | null;
  bouwjaar: number | null;
  pandId: string | null;
} | null> {
  const props = (await queryVerblijfsobjecten("identificatie", id, 1))[0];
  if (!props) return null;

  const gebruiksdoelen = String(props.gebruiksdoel ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const opp = Number(props.oppervlakte);
  const bj = Number(props.bouwjaar);
  const pandId = props.pandidentificatie;
  return {
    gebruiksdoelen,
    oppervlakteM2: Number.isFinite(opp) && opp > 0 ? Math.round(opp) : null,
    bouwjaar: Number.isFinite(bj) && bj > 1500 ? bj : null,
    pandId: typeof pandId === "string" && pandId ? pandId : null,
  };
}

/**
 * Stap 3: alle verblijfsobjecten van hetzelfde pand ophalen, zodat we het
 * kantooraandeel van het gebouw kunnen afleiden. Faalt dit, dan blijft de rest
 * van de BAG-gegevens gewoon bruikbaar (we geven null terug).
 */
async function fetchPandSamenstelling(
  pandId: string,
): Promise<PandSamenstelling | null> {
  try {
    const props = await queryVerblijfsobjecten("pandidentificatie", pandId, 200);
    if (props.length === 0) return null;
    const vbos: VboRegel[] = props.map((p) => ({
      gebruiksdoel: String(p.gebruiksdoel ?? ""),
      oppervlakteM2: Number(p.oppervlakte) || 0,
    }));
    return bepaalPandSamenstelling(vbos);
  } catch {
    return null;
  }
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
    const pand = vo.pandId ? await fetchPandSamenstelling(vo.pandId) : null;
    const value: BagKenmerken = {
      status: "found",
      gebruiksdoelen: vo.gebruiksdoelen,
      hoofdgebruik: mapped.hoofdgebruik,
      gemengd: mapped.gemengd,
      heeftWoonfunctie: mapped.heeftWoonfunctie,
      oppervlakteM2: vo.oppervlakteM2,
      bouwjaar: vo.bouwjaar,
      pand,
    };
    cache.set(cacheKey, { value, expiresAt: Date.now() + CACHE_TTL_MS });
    return value;
  } catch {
    return { status: "error" };
  }
}
