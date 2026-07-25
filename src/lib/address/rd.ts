/**
 * Gedeelde helper om van postcode + huisnummer naar een RD-coördinaat
 * (Rijksdriehoek, EPSG:28992) te komen via de PDOK Locatieserver.
 *
 * Meerdere adapters hebben dit nodig om ruimtelijke vragen te stellen:
 * ligt het pand in een monumentvlak, in welk voedingsgebied valt het, enz.
 */

const LOCATIESERVER = "https://api.pdok.nl/bzk/locatieserver/search/v3_1";
const TIMEOUT_MS = 5_000;

export type RdPunt = { x: number; y: number };

/** Parse "POINT(x y)" (RD, EPSG:28992) naar coördinaten. */
export function parseRdPoint(centroideRd: string): RdPunt | null {
  const m = /POINT\(\s*([0-9.]+)\s+([0-9.]+)\s*\)/i.exec(centroideRd ?? "");
  if (!m) return null;
  const x = Number(m[1]);
  const y = Number(m[2]);
  return Number.isFinite(x) && Number.isFinite(y) ? { x, y } : null;
}

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

/** Zoek het RD-coördinaat van een adres; null als het adres onbekend is. */
export async function resolveRdPoint(
  postcode: string,
  huisnummer: string,
  toevoeging = "",
): Promise<RdPunt | null> {
  const q = `${postcode} ${huisnummer}${toevoeging ? ` ${toevoeging}` : ""}`;
  const params = new URLSearchParams({
    q,
    fq: "type:adres",
    rows: "5",
    fl: "centroide_rd,postcode,huisnummer",
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
  const rd = chosen?.centroide_rd;
  return typeof rd === "string" ? parseRdPoint(rd) : null;
}
