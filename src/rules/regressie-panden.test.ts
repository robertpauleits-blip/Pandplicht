import { describe, expect, it } from "vitest";
import type { AssessmentInput, AssessmentStatus, TopicId } from "./types";
import { runAssessment } from "./engine";

/**
 * Regressie over uiteenlopende testpanden. Naast de assertions print deze test
 * een overzichtsmatrix (zichtbaar bij `vitest run`), zodat in één oogopslag te
 * zien is wat de engine per pand en per onderwerp concludeert. Bewust
 * deterministisch (vaste datum).
 *
 * Adresvalidatie (bijv. een ongeldige postcode) zit niet in de engine maar in
 * de wizard/PDOK-laag en is daar apart getest.
 */

const NU = new Date("2026-07-24T10:00:00Z");

function baseInput(overrides: Partial<AssessmentInput> = {}): AssessmentInput {
  return {
    adres: null,
    relatie: null,
    hoofdgebruik: null,
    oppervlakteBand: null,
    oppervlakteExactM2: null,
    kantoorAandeel: null,
    monument: null,
    transactieGepland: null,
    elektriciteit: null,
    gas: null,
    energielabel: null,
    eigenOpwek: null,
    terugleveringKwh: null,
    aansluiting: null,
    gecontracteerdVermogenKw: null,
    wachtOpAansluiting: null,
    beperkingen: null,
    plannen: [],
    grootsteProbleem: null,
    batterij: null,
    ...overrides,
  };
}

const STRONG_BATTERY = {
  hoofddoel: "peak_shaving" as const,
  kwartierdataBeschikbaar: "ja" as const,
  piekKw: 120,
  flexibelProfiel: "ja" as const,
  ruimteBeschikbaar: "ja" as const,
  investeringshorizonJaren: "b5_10" as const,
  noodstroomNodig: "nee" as const,
};

type Scenario = {
  naam: string;
  input: AssessmentInput;
  /** Verwachte status per relevant onderwerp. */
  verwacht: Partial<Record<TopicId, AssessmentStatus>>;
  /** Extra controle op de leesbare redenen. */
  redenBevat?: { topic: TopicId; tekst: string };
  redenBevatNiet?: { topic: TopicId; tekst: string };
};

const SCENARIOS: Scenario[] = [
  {
    naam: "Kantoor, slecht label (F), onder de plicht",
    input: baseInput({
      hoofdgebruik: "kantoor",
      oppervlakteBand: "b1000_5000",
      kantoorAandeel: "gte50",
      monument: "nee",
      energielabel: "F",
    }),
    verwacht: { energielabel_c_kantoor: "likely_applicable" },
  },
  {
    naam: "Kantoor, goed label A++ (uit EP-Online)",
    input: baseInput({
      hoofdgebruik: "kantoor",
      oppervlakteBand: "b250_1000",
      kantoorAandeel: "gte50",
      monument: "nee",
      energielabel: "A++",
    }),
    verwacht: { energielabel_c_kantoor: "likely_not_applicable" },
    redenBevat: { topic: "energielabel_c_kantoor", tekst: "A++" },
  },
  {
    naam: "Klein kantoorpand (< 100 m²), label E",
    input: baseInput({
      hoofdgebruik: "kantoor",
      oppervlakteExactM2: 80,
      kantoorAandeel: "gte50",
      monument: "nee",
      energielabel: "E",
    }),
    verwacht: { energielabel_c_kantoor: "likely_not_applicable" },
  },
  {
    naam: "Monument (kantoor), label F",
    input: baseInput({
      hoofdgebruik: "kantoor",
      oppervlakteBand: "b250_1000",
      kantoorAandeel: "gte50",
      monument: "ja",
      energielabel: "F",
    }),
    verwacht: { energielabel_c_kantoor: "likely_not_applicable" },
  },
  {
    naam: "Kantoor, geen label geregistreerd",
    input: baseInput({
      hoofdgebruik: "kantoor",
      oppervlakteBand: "b250_1000",
      kantoorAandeel: "gte50",
      monument: "nee",
      energielabel: "geen",
    }),
    verwacht: { energielabel_c_kantoor: "possibly_applicable" },
  },
  {
    naam: "Gemengd gebruik, kantooraandeel onbekend",
    input: baseInput({
      hoofdgebruik: "gemengd",
      kantoorAandeel: "onbekend",
      oppervlakteBand: "b250_1000",
    }),
    verwacht: { energielabel_c_kantoor: "insufficient_data" },
  },
  {
    naam: "Grootverbruiker (industrie)",
    input: baseInput({
      hoofdgebruik: "industrie",
      elektriciteit: { type: "exact", value: 300_000 },
      gas: { type: "exact", value: 40_000 },
    }),
    verwacht: { energiebesparingsplicht: "likely_applicable" },
  },
  {
    naam: "Netcongestie: actueel knelpunt gemeld",
    input: baseInput({ aansluiting: "groot", beperkingen: "ja" }),
    verwacht: { netcongestie: "likely_applicable" },
  },
  {
    naam: "Netcongestie: alles onbekend (mag geen 'nee' worden)",
    input: baseInput({
      aansluiting: "groot",
      beperkingen: "onbekend",
      wachtOpAansluiting: "onbekend",
      plannen: ["geen"],
    }),
    verwacht: { netcongestie: "insufficient_data" },
    redenBevatNiet: { topic: "netcongestie", tekst: "geen gemelde beperkingen" },
  },
  {
    naam: "Zon met overschot + sterke batterijcasus",
    input: baseInput({
      eigenOpwek: "zon",
      terugleveringKwh: 30_000,
      elektriciteit: { type: "exact", value: 400_000 },
      beperkingen: "ja",
      wachtOpAansluiting: "ja",
      grootsteProbleem: "piekvermogen",
      batterij: STRONG_BATTERY,
    }),
    verwacht: {
      batterijscan: "likely_applicable",
      netcongestie: "likely_applicable",
    },
    redenBevat: { topic: "batterijscan", tekst: "van 100" },
  },
  {
    naam: "Batterij: onvoldoende gegevens (geen cijfer)",
    input: baseInput(),
    verwacht: { batterijscan: "insufficient_data" },
    redenBevatNiet: { topic: "batterijscan", tekst: "van 100" },
  },
];

const TOPIC_ORDER: { id: TopicId; kort: string }[] = [
  { id: "energiebesparingsplicht", kort: "EBP" },
  { id: "informatieplicht", kort: "INFO" },
  { id: "onderzoeksplicht", kort: "ONDZ" },
  { id: "energielabel_c_kantoor", kort: "LBL-C" },
  { id: "energielabel_transactie", kort: "LBL-T" },
  { id: "netcongestie", kort: "NET" },
  { id: "batterijscan", kort: "BAT" },
];

const STATUS_KORT: Record<AssessmentStatus, string> = {
  likely_applicable: "JA",
  possibly_applicable: "mog",
  likely_not_applicable: "nee",
  insufficient_data: "?",
};

const runs = SCENARIOS.map((s) => ({
  scenario: s,
  outcome: runAssessment(s.input, NU),
}));

function statusVan(outcome: (typeof runs)[number]["outcome"], topic: TopicId) {
  const r = outcome.results.find((x) => x.topicId === topic);
  if (!r) throw new Error(`onderwerp ${topic} ontbreekt`);
  return r;
}

describe("regressie: uiteenlopende testpanden", () => {
  it.each(runs)("$scenario.naam", ({ scenario, outcome }) => {
    for (const [topic, status] of Object.entries(scenario.verwacht)) {
      expect(statusVan(outcome, topic as TopicId).status).toBe(status);
    }
    if (scenario.redenBevat) {
      const r = statusVan(outcome, scenario.redenBevat.topic);
      expect(r.reasons.join(" ")).toContain(scenario.redenBevat.tekst);
    }
    if (scenario.redenBevatNiet) {
      const r = statusVan(outcome, scenario.redenBevatNiet.topic);
      expect(r.reasons.join(" ")).not.toContain(scenario.redenBevatNiet.tekst);
    }
  });

  it("elk pand levert alle zeven onderwerpen met een geldige bron", () => {
    for (const { outcome } of runs) {
      expect(outcome.results).toHaveLength(7);
      for (const r of outcome.results) {
        expect(r.sourceIds.length).toBeGreaterThan(0);
      }
    }
  });

  it("print de overzichtsmatrix", () => {
    const naamBreedte = Math.max(...SCENARIOS.map((s) => s.naam.length));
    const kop =
      "PAND".padEnd(naamBreedte) +
      " | " +
      TOPIC_ORDER.map((t) => t.kort.padStart(5)).join(" ");
    const lijnen = runs.map(({ scenario, outcome }) => {
      const cellen = TOPIC_ORDER.map((t) =>
        STATUS_KORT[statusVan(outcome, t.id).status].padStart(5),
      ).join(" ");
      return scenario.naam.padEnd(naamBreedte) + " | " + cellen;
    });
    const legenda =
      "Legenda: JA = waarschijnlijk van toepassing, mog = mogelijk, " +
      "nee = waarschijnlijk niet, ? = meer informatie nodig.";

    // eslint-disable-next-line no-console
    console.log(
      "\n" +
        kop +
        "\n" +
        "-".repeat(kop.length) +
        "\n" +
        lijnen.join("\n") +
        "\n\n" +
        legenda +
        "\n",
    );
    expect(runs.length).toBeGreaterThanOrEqual(10);
  });
});
