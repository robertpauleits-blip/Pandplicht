import type { Energielabel } from "@/rules/types";
import { FLAGS } from "@/lib/site";

/**
 * Server-side adapter voor de officiële EP-Online API (RVO).
 *
 * Vereist een API-sleutel (`EPONLINE_API_KEY`) die je gratis bij RVO aanvraagt,
 * en de feature flag `ENABLE_EP_ONLINE_INTEGRATION=true`. Zonder sleutel of
 * flag geeft de adapter bewust `not_configured` terug — er wordt nooit een
 * label verzonnen (harde regel: geen nepdata als echte labeldata).
 *
 * Endpoint: GET /api/v5/PandEnergielabel/Adres?postcode=&huisnummer=&huisnummertoevoeging=
 * Auth: Authorization-header met de sleutel.
 */

const BASE = "https://public.ep-online.nl/api/v5";
const TIMEOUT_MS = 5_000;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // labels veranderen zelden

export type EnergyLabelLookup =
  | { status: "not_configured" }
  | { status: "not_found" }
  | { status: "error" }
  | {
      status: "found";
      /** Ruwe klasse zoals EP-Online die geeft, bijv. "A++++". */
      labelRaw: string;
      /** Gemapt naar onze enum (A+ -varianten vallen onder "A"). */
      label: Energielabel;
      oppervlakteM2: number | null;
      registratiedatum: string | null;
      geldigTot: string | null;
      gebouwklasse: string | null;
    };

type CacheEntry = { value: EnergyLabelLookup; expiresAt: number };
const cache = new Map<string, CacheEntry>();

/** Map een EP-Online-energieklasse naar onze interne enum. */
export function mapEnergieklasse(raw: string | null | undefined): Energielabel {
  if (!raw) return "onbekend";
  const v = raw.trim().toUpperCase();
  // A, A+, A++, A+++, A++++ vallen bij ons allemaal onder "A".
  if (v.startsWith("A")) return "A";
  if (["B", "C", "D", "E", "F", "G"].includes(v)) return v as Energielabel;
  return "onbekend";
}

/** Normaliseer een numerieke oppervlakte uit de API. */
function parseOppervlakte(v: unknown): number | null {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
}

type EpRecord = Record<string, unknown>;

/** Kies het meest recente label wanneer er meerdere registraties zijn. */
function pickMostRecent(records: EpRecord[]): EpRecord | null {
  if (records.length === 0) return null;
  return [...records].sort((a, b) => {
    const da = String(a["Registratiedatum"] ?? "");
    const db = String(b["Registratiedatum"] ?? "");
    return db.localeCompare(da);
  })[0]!;
}

export async function fetchEnergyLabel(params: {
  postcode: string;
  huisnummer: string;
  toevoeging?: string;
}): Promise<EnergyLabelLookup> {
  const apiKey = process.env.EPONLINE_API_KEY;
  if (!FLAGS.epOnlineIntegration || !apiKey) {
    return { status: "not_configured" };
  }

  const postcode = params.postcode.toUpperCase().replace(/\s+/g, "");
  const huisnummer = params.huisnummer.replace(/\D/g, "");
  const toevoeging = (params.toevoeging ?? "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 4);

  if (!/^[1-9][0-9]{3}[A-Z]{2}$/.test(postcode) || !/^[1-9][0-9]{0,4}$/.test(huisnummer)) {
    return { status: "error" };
  }

  const cacheKey = `${postcode}-${huisnummer}-${toevoeging}`;
  const hit = cache.get(cacheKey);
  if (hit && hit.expiresAt > Date.now()) return hit.value;

  const qs = new URLSearchParams({ postcode, huisnummer });
  if (toevoeging) qs.set("huisnummertoevoeging", toevoeging);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE}/PandEnergielabel/Adres?${qs.toString()}`, {
      signal: controller.signal,
      headers: {
        Authorization: apiKey,
        Accept: "application/json",
      },
      // Labels veranderen zelden; server-side caching mag ruim.
      next: { revalidate: 60 * 60 * 24 },
    });

    if (res.status === 404) {
      const value: EnergyLabelLookup = { status: "not_found" };
      cache.set(cacheKey, { value, expiresAt: Date.now() + CACHE_TTL_MS });
      return value;
    }
    if (!res.ok) return { status: "error" };

    const data = (await res.json()) as EpRecord | EpRecord[];
    const records = Array.isArray(data) ? data : data ? [data] : [];
    const record = pickMostRecent(records);
    if (!record || !record["Energieklasse"]) {
      const value: EnergyLabelLookup = { status: "not_found" };
      cache.set(cacheKey, { value, expiresAt: Date.now() + CACHE_TTL_MS });
      return value;
    }

    const value: EnergyLabelLookup = {
      status: "found",
      labelRaw: String(record["Energieklasse"]),
      label: mapEnergieklasse(String(record["Energieklasse"])),
      oppervlakteM2: parseOppervlakte(
        record["Gebruiksoppervlakte_thermische_zone"] ??
          record["Gebruiksoppervlakte"],
      ),
      registratiedatum: record["Registratiedatum"]
        ? String(record["Registratiedatum"])
        : null,
      geldigTot: record["Geldig_tot"] ? String(record["Geldig_tot"]) : null,
      gebouwklasse: record["Gebouwklasse"] ? String(record["Gebouwklasse"]) : null,
    };
    cache.set(cacheKey, { value, expiresAt: Date.now() + CACHE_TTL_MS });
    return value;
  } catch {
    // Time-out of netwerkfout: geen witte pagina, gewoon terugval op handmatig.
    return { status: "error" };
  } finally {
    clearTimeout(timer);
  }
}
