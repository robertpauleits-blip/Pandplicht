import type {
  ElektriciteitBand,
  EnergieWaarde,
  Energielabel,
  GasBand,
} from "./types";

/**
 * Energielabelschaal van best naar slechtst. De exacte klasse (incl. plus-
 * varianten) blijft behouden; vergelijken gebeurt op rang, niet door te
 * normaliseren naar de eerste letter.
 */
export const LABEL_SCALE = [
  "A+++++",
  "A++++",
  "A+++",
  "A++",
  "A+",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
] as const;

/** Rang op de labelschaal (0 = best). null voor "geen"/"onbekend"/onvergelijkbaar. */
export function labelIndex(label: Energielabel | null): number | null {
  if (!label) return null;
  const i = (LABEL_SCALE as readonly string[]).indexOf(label);
  return i === -1 ? null : i;
}

/**
 * Voldoet `label` minimaal aan `minimum` (bijv. minimaal C)?
 * true = gelijk of beter, false = slechter, null = niet vergelijkbaar
 * (geen/onbekend label). A++ telt dus correct als "beter dan C".
 */
export function labelMeetsMinimum(
  label: Energielabel | null,
  minimum: Energielabel,
): boolean | null {
  const li = labelIndex(label);
  const mi = labelIndex(minimum);
  if (li === null || mi === null) return null;
  return li <= mi;
}

/** Bandbreedtes in kWh per jaar. `max: null` = geen bovengrens. */
export const ELEKTRA_BANDS: Record<
  ElektriciteitBand,
  { min: number; max: number | null; label: string }
> = {
  lt10k: { min: 0, max: 10_000, label: "minder dan 10.000 kWh" },
  b10k_50k: { min: 10_000, max: 50_000, label: "10.000 – 50.000 kWh" },
  b50k_200k: { min: 50_000, max: 200_000, label: "50.000 – 200.000 kWh" },
  b200k_10m: { min: 200_000, max: 10_000_000, label: "200.000 kWh – 10 mln kWh" },
  gt10m: { min: 10_000_000, max: null, label: "meer dan 10 mln kWh" },
};

/** Bandbreedtes in m³ aardgas(equivalent) per jaar. */
export const GAS_BANDS: Record<
  GasBand,
  { min: number; max: number | null; label: string }
> = {
  lt3k: { min: 0, max: 3_000, label: "minder dan 3.000 m³" },
  b3k_25k: { min: 3_000, max: 25_000, label: "3.000 – 25.000 m³" },
  b25k_75k: { min: 25_000, max: 75_000, label: "25.000 – 75.000 m³" },
  b75k_170k: { min: 75_000, max: 170_000, label: "75.000 – 170.000 m³" },
  gt170k: { min: 170_000, max: null, label: "meer dan 170.000 m³" },
};

export type Range = { min: number; max: number | null };

export function toRange(
  value: EnergieWaarde<ElektriciteitBand> | null,
  kind: "elektra",
): Range | null;
export function toRange(
  value: EnergieWaarde<GasBand> | null,
  kind: "gas",
): Range | null;
export function toRange(
  value: EnergieWaarde<string> | null,
  kind: "elektra" | "gas",
): Range | null {
  if (!value || value.type === "onbekend") return null;
  if (value.type === "exact") return { min: value.value, max: value.value };
  const table = kind === "elektra" ? ELEKTRA_BANDS : GAS_BANDS;
  const band = (table as Record<string, Range>)[value.band];
  return band ? { min: band.min, max: band.max } : null;
}

/**
 * Vergelijk een bereik met een drempel.
 * - "above": hele bereik op of boven de drempel
 * - "below": hele bereik duidelijk onder de drempel (ook buiten de marge)
 * - "around": bereik overlapt de drempel of ligt binnen de marge
 */
export function compareToThreshold(
  range: Range,
  threshold: number,
  margin: number,
): "above" | "below" | "around" {
  const lower = threshold * (1 - margin);
  if (range.min >= threshold) return "above";
  if (range.max !== null && range.max < lower) return "below";
  return "around";
}

export function formatKwh(n: number): string {
  return `${n.toLocaleString("nl-NL")} kWh`;
}

export function formatGas(n: number): string {
  return `${n.toLocaleString("nl-NL")} m³`;
}
