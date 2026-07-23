/**
 * Server-side client voor de PDOK Locatieserver (openbare data, geen key).
 * Met timeout, kleine cache, inputlimieten en nette fouttolerantie,
 * een storing mag nooit tot een witte pagina leiden (handmatige invoer blijft
 * altijd mogelijk in de wizard).
 */

const PDOK_BASE = "https://api.pdok.nl/bzk/locatieserver/search/v3_1";
const TIMEOUT_MS = 4_000;

export type AddressSuggestion = {
  id: string;
  weergavenaam: string;
  postcode?: string;
  huisnummer?: string;
  straat?: string;
  plaats?: string;
  gemeente?: string;
  provincie?: string;
};

export type AddressDetails = AddressSuggestion & {
  bouwjaar?: number;
  gebruiksdoelen?: string[];
  oppervlakteM2?: number;
};

type CacheEntry<T> = { value: T; expiresAt: number };
const cache = new Map<string, CacheEntry<unknown>>();
const CACHE_TTL_MS = 10 * 60 * 1000;

function getCached<T>(key: string): T | null {
  const hit = cache.get(key);
  if (hit && hit.expiresAt > Date.now()) return hit.value as T;
  cache.delete(key);
  return null;
}

function setCached<T>(key: string, value: T) {
  if (cache.size > 500) cache.clear(); // simpele begrenzing
  cache.set(key, { value, expiresAt: Date.now() + CACHE_TTL_MS });
}

async function pdokFetch(url: string): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
      // PDOK-data verandert langzaam; server-side caching is prima.
      next: { revalidate: 600 },
    });
    if (!res.ok) throw new Error(`PDOK-status ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

type PdokDoc = {
  id?: string;
  weergavenaam?: string;
  postcode?: string;
  huisnummer?: number;
  huisletter?: string;
  huisnummertoevoeging?: string;
  straatnaam?: string;
  woonplaatsnaam?: string;
  gemeentenaam?: string;
  provincienaam?: string;
};

function toSuggestion(doc: PdokDoc): AddressSuggestion {
  return {
    id: doc.id ?? "",
    weergavenaam: doc.weergavenaam ?? "",
    postcode: doc.postcode,
    huisnummer: [doc.huisnummer, doc.huisletter, doc.huisnummertoevoeging]
      .filter((x) => x !== undefined && x !== "")
      .join(""),
    straat: doc.straatnaam,
    plaats: doc.woonplaatsnaam,
    gemeente: doc.gemeentenaam,
    provincie: doc.provincienaam,
  };
}

export async function suggestAddresses(
  q: string,
): Promise<AddressSuggestion[]> {
  const query = q.trim().slice(0, 80);
  if (query.length < 3) return [];
  const cacheKey = `suggest:${query.toLowerCase()}`;
  const cached = getCached<AddressSuggestion[]>(cacheKey);
  if (cached) return cached;

  const url = `${PDOK_BASE}/free?q=${encodeURIComponent(query)}&fq=type:adres&rows=8&fl=id,weergavenaam,postcode,huisnummer,huisletter,huisnummertoevoeging,straatnaam,woonplaatsnaam,gemeentenaam,provincienaam`;
  const data = (await pdokFetch(url)) as {
    response?: { docs?: PdokDoc[] };
  };
  const docs = data.response?.docs ?? [];
  const suggestions = docs
    .map(toSuggestion)
    .filter((s) => s.id && s.weergavenaam);
  setCached(cacheKey, suggestions);
  return suggestions;
}

export async function lookupAddress(id: string): Promise<AddressDetails | null> {
  const clean = id.trim().slice(0, 60);
  if (!clean) return null;
  const cacheKey = `lookup:${clean}`;
  const cached = getCached<AddressDetails | null>(cacheKey);
  if (cached !== null) return cached;

  const url = `${PDOK_BASE}/lookup?id=${encodeURIComponent(clean)}&fl=*`;
  const data = (await pdokFetch(url)) as {
    response?: { docs?: (PdokDoc & Record<string, unknown>)[] };
  };
  const doc = data.response?.docs?.[0];
  if (!doc) return null;
  const details: AddressDetails = {
    ...toSuggestion(doc),
  };
  setCached(cacheKey, details);
  return details;
}
