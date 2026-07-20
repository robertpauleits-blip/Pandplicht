import { z } from "zod";
import type { AssessmentInput } from "@/rules/types";

const jaNeeOnbekend = z.enum(["ja", "nee", "onbekend"]);

const elektriciteitWaarde = z
  .discriminatedUnion("type", [
    z.object({ type: z.literal("exact"), value: z.number().min(0).max(1e10) }),
    z.object({
      type: z.literal("band"),
      band: z.enum(["lt10k", "b10k_50k", "b50k_200k", "b200k_10m", "gt10m"]),
    }),
    z.object({ type: z.literal("onbekend") }),
  ])
  .nullable();

const gasWaarde = z
  .discriminatedUnion("type", [
    z.object({ type: z.literal("exact"), value: z.number().min(0).max(1e10) }),
    z.object({
      type: z.literal("band"),
      band: z.enum(["lt3k", "b3k_25k", "b25k_75k", "b75k_170k", "gt170k"]),
    }),
    z.object({ type: z.literal("onbekend") }),
  ])
  .nullable();

export const assessmentInputSchema = z.object({
  adres: z
    .object({
      postcode: z.string().max(8),
      huisnummer: z.string().max(8),
      toevoeging: z.string().max(8).optional(),
      straat: z.string().max(120).optional(),
      plaats: z.string().max(80).optional(),
      gemeente: z.string().max(80).optional(),
      provincie: z.string().max(40).optional(),
      bouwjaar: z.number().int().min(1000).max(2100).optional(),
      bagGebruiksdoelen: z.array(z.string().max(60)).max(12).optional(),
      bagOppervlakteM2: z.number().min(0).max(1e7).optional(),
      handmatig: z.boolean().optional(),
    })
    .nullable(),
  relatie: z
    .enum([
      "eigenaar_gebruiker",
      "eigenaar_verhuurder",
      "huurder",
      "beheerder_adviseur",
      "anders",
    ])
    .nullable(),
  hoofdgebruik: z
    .enum([
      "kantoor",
      "winkel",
      "horeca",
      "industrie",
      "opslag_logistiek",
      "zorg",
      "onderwijs",
      "sport",
      "bijeenkomst",
      "gemengd",
      "anders",
    ])
    .nullable(),
  oppervlakteBand: z
    .enum(["lt100", "b100_250", "b250_1000", "b1000_5000", "gt5000", "onbekend"])
    .nullable(),
  oppervlakteExactM2: z.number().min(0).max(1e7).nullable(),
  kantoorAandeel: z.enum(["lt50", "gte50", "onbekend"]).nullable(),
  monument: jaNeeOnbekend.nullable(),
  transactieGepland: z.enum(["ja", "nee", "mogelijk", "onbekend"]).nullable(),
  elektriciteit: elektriciteitWaarde,
  gas: gasWaarde,
  energielabel: z
    .enum(["A", "B", "C", "D", "E", "F", "G", "geen", "onbekend"])
    .nullable(),
  eigenOpwek: z.enum(["geen", "zon", "wind", "anders"]).nullable(),
  terugleveringKwh: z.number().min(0).max(1e10).nullable(),
  aansluiting: z.enum(["klein", "groot", "onbekend"]).nullable(),
  gecontracteerdVermogenKw: z.number().min(0).max(1e6).nullable(),
  wachtOpAansluiting: jaNeeOnbekend.nullable(),
  beperkingen: jaNeeOnbekend.nullable(),
  plannen: z
    .array(
      z.enum([
        "uitbreiding",
        "warmtepomp",
        "wagenpark",
        "zonnepanelen",
        "verhuizing",
        "geen",
      ]),
    )
    .max(6),
  grootsteProbleem: z
    .enum([
      "piekvermogen",
      "teruglevering",
      "uitbreiding",
      "kosten",
      "leveringszekerheid",
      "onbekend",
    ])
    .nullable(),
  batterij: z
    .object({
      hoofddoel: z
        .enum([
          "peak_shaving",
          "zon_later_gebruiken",
          "uitbreiding_beperkt_vermogen",
          "energiehandel",
          "noodstroom",
          "combinatie",
        ])
        .nullable(),
      kwartierdataBeschikbaar: jaNeeOnbekend.nullable(),
      piekKw: z.number().min(0).max(1e6).nullable(),
      flexibelProfiel: jaNeeOnbekend.nullable(),
      ruimteBeschikbaar: z.enum(["ja", "beperkt", "nee", "onbekend"]).nullable(),
      investeringshorizonJaren: z.enum(["lt5", "b5_10", "gt10", "onbekend"]).nullable(),
      noodstroomNodig: jaNeeOnbekend.nullable(),
    })
    .nullable(),
}) satisfies z.ZodType<AssessmentInput>;
