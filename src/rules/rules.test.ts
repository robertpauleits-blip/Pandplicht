import { describe, expect, it } from "vitest";
import type { AssessmentInput } from "./types";
import { runAssessment } from "./engine";
import { assessEnergiebesparingsplicht, assessOnderzoeksplicht } from "./energy-obligations";
import { assessEnergielabelCKantoor } from "./office-label";
import { assessEnergielabelTransactie } from "./utility-label";
import { assessNetcongestie } from "./congestion";
import { assessBatterijscan, batteryCategory, computeBatteryScore } from "./battery";
import { SOURCES } from "./sources";
import { RULESET_VERSION } from "./version";

/** Basisinvoer: alles onbekend/leeg. */
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

describe("energiebesparingsplicht", () => {
  it("is waarschijnlijk van toepassing boven de elektriciteitsdrempel", () => {
    const r = assessEnergiebesparingsplicht(
      baseInput({
        elektriciteit: { type: "exact", value: 80_000 },
        gas: { type: "exact", value: 1_000 },
      }),
    );
    expect(r.status).toBe("likely_applicable");
    expect(r.confidence).toBe("high");
  });

  it("telt exact op de drempel als op-of-boven", () => {
    const r = assessEnergiebesparingsplicht(
      baseInput({
        elektriciteit: { type: "exact", value: 50_000 },
        gas: { type: "exact", value: 1_000 },
      }),
    );
    expect(r.status).toBe("likely_applicable");
  });

  it("is waarschijnlijk niet van toepassing duidelijk onder beide drempels", () => {
    const r = assessEnergiebesparingsplicht(
      baseInput({
        elektriciteit: { type: "exact", value: 12_000 },
        gas: { type: "exact", value: 2_000 },
      }),
    );
    expect(r.status).toBe("likely_not_applicable");
    expect(r.confidence).toBe("high");
  });

  it("geeft 'mogelijk' rond de grens (binnen de marge)", () => {
    const r = assessEnergiebesparingsplicht(
      baseInput({
        elektriciteit: { type: "exact", value: 47_000 }, // binnen 10% marge
        gas: { type: "exact", value: 1_000 },
      }),
    );
    expect(r.status).toBe("possibly_applicable");
  });

  it("geeft 'meer informatie nodig' zonder verbruiksgegevens", () => {
    const r = assessEnergiebesparingsplicht(baseInput());
    expect(r.status).toBe("insufficient_data");
    expect(r.missingInputs.length).toBeGreaterThan(0);
  });

  it("werkt met bandbreedtes: band boven drempel is van toepassing", () => {
    const r = assessEnergiebesparingsplicht(
      baseInput({
        elektriciteit: { type: "band", band: "b50k_200k" },
        gas: { type: "onbekend" },
      }),
    );
    expect(r.status).toBe("likely_applicable");
    expect(r.confidence).toBe("medium");
  });

  it("gasdrempel werkt onafhankelijk van elektriciteit", () => {
    const r = assessEnergiebesparingsplicht(
      baseInput({
        elektriciteit: { type: "exact", value: 5_000 },
        gas: { type: "exact", value: 30_000 },
      }),
    );
    expect(r.status).toBe("likely_applicable");
  });
});

describe("onderzoeksplicht", () => {
  it("is 'mogelijk' boven 10 mln kWh (activiteit onbekend)", () => {
    const r = assessOnderzoeksplicht(
      baseInput({
        elektriciteit: { type: "band", band: "gt10m" },
        gas: { type: "exact", value: 0 },
      }),
    );
    expect(r.status).toBe("possibly_applicable");
  });

  it("is waarschijnlijk niet van toepassing bij mkb-verbruik", () => {
    const r = assessOnderzoeksplicht(
      baseInput({
        elektriciteit: { type: "exact", value: 60_000 },
        gas: { type: "exact", value: 10_000 },
      }),
    );
    expect(r.status).toBe("likely_not_applicable");
  });
});

describe("energielabel C kantoren", () => {
  const kantoorBasis = {
    hoofdgebruik: "kantoor" as const,
    oppervlakteBand: "b250_1000" as const,
    kantoorAandeel: "gte50" as const,
    monument: "nee" as const,
  };

  it("label D bij kantoor onder de plicht: waarschijnlijk van toepassing, prioriteit nu", () => {
    const r = assessEnergielabelCKantoor(
      baseInput({ ...kantoorBasis, energielabel: "D" }),
    );
    expect(r.status).toBe("likely_applicable");
    expect(r.priority).toBe("now");
    expect(r.confidence).toBe("high");
  });

  it("label G idem", () => {
    const r = assessEnergielabelCKantoor(
      baseInput({ ...kantoorBasis, energielabel: "G" }),
    );
    expect(r.status).toBe("likely_applicable");
  });

  it("label A t/m C: waarschijnlijk geen actie nodig", () => {
    for (const label of ["A", "B", "C"] as const) {
      const r = assessEnergielabelCKantoor(
        baseInput({ ...kantoorBasis, energielabel: label }),
      );
      expect(r.status).toBe("likely_not_applicable");
    }
  });

  it("geen of onbekend label: mogelijk van toepassing", () => {
    for (const label of ["geen", "onbekend"] as const) {
      const r = assessEnergielabelCKantoor(
        baseInput({ ...kantoorBasis, energielabel: label }),
      );
      expect(r.status).toBe("possibly_applicable");
    }
  });

  it("behoudt de exacte labelklasse in de uitslag (A++ telt als beter dan C)", () => {
    const r = assessEnergielabelCKantoor(
      baseInput({ ...kantoorBasis, energielabel: "A++" }),
    );
    expect(r.status).toBe("likely_not_applicable");
    // De exacte klasse moet letterlijk in de tekst staan, niet genormaliseerd.
    expect(r.reasons.join(" ")).toContain("A++");
    expect(r.reasons.join(" ")).not.toContain("label A voldoet");
  });

  it("klein kantoorgebouw (<100 m²) is uitgezonderd", () => {
    const r = assessEnergielabelCKantoor(
      baseInput({ ...kantoorBasis, oppervlakteBand: "lt100", energielabel: "E" }),
    );
    expect(r.status).toBe("likely_not_applicable");
  });

  it("exact 100 m² valt niet onder de kleine-gebouwenuitzondering", () => {
    const r = assessEnergielabelCKantoor(
      baseInput({
        ...kantoorBasis,
        oppervlakteBand: null,
        oppervlakteExactM2: 100,
        energielabel: "E",
      }),
    );
    expect(r.status).toBe("likely_applicable");
  });

  it("99 m² valt er wél onder", () => {
    const r = assessEnergielabelCKantoor(
      baseInput({
        ...kantoorBasis,
        oppervlakteBand: null,
        oppervlakteExactM2: 99,
        energielabel: "E",
      }),
    );
    expect(r.status).toBe("likely_not_applicable");
  });

  it("kantooraandeel < 50%: waarschijnlijk niet van toepassing", () => {
    const r = assessEnergielabelCKantoor(
      baseInput({
        hoofdgebruik: "gemengd",
        kantoorAandeel: "lt50",
        oppervlakteBand: "b250_1000",
        energielabel: "F",
      }),
    );
    expect(r.status).toBe("likely_not_applicable");
  });

  it("monument: uitzondering", () => {
    const r = assessEnergielabelCKantoor(
      baseInput({ ...kantoorBasis, monument: "ja", energielabel: "F" }),
    );
    expect(r.status).toBe("likely_not_applicable");
  });

  it("niet-kantoorgebruik: waarschijnlijk niet van toepassing", () => {
    const r = assessEnergielabelCKantoor(
      baseInput({ hoofdgebruik: "industrie", energielabel: "F" }),
    );
    expect(r.status).toBe("likely_not_applicable");
  });

  it("gemengd gebruik met onbekend kantooraandeel: meer informatie nodig", () => {
    const r = assessEnergielabelCKantoor(
      baseInput({ hoofdgebruik: "gemengd", kantoorAandeel: "onbekend" }),
    );
    expect(r.status).toBe("insufficient_data");
  });
});

describe("energielabel bij transactie", () => {
  it("transactie gepland: waarschijnlijk van toepassing", () => {
    const r = assessEnergielabelTransactie(
      baseInput({ transactieGepland: "ja", hoofdgebruik: "kantoor" }),
    );
    expect(r.status).toBe("likely_applicable");
    expect(r.priority).toBe("now");
  });

  it("geen transactie: waarschijnlijk niet van toepassing", () => {
    const r = assessEnergielabelTransactie(baseInput({ transactieGepland: "nee" }));
    expect(r.status).toBe("likely_not_applicable");
  });

  it("transactiecontext onbekend: meer informatie nodig", () => {
    const r = assessEnergielabelTransactie(baseInput({ transactieGepland: "onbekend" }));
    expect(r.status).toBe("insufficient_data");
  });
});

describe("netcongestie", () => {
  it("gemelde beperkingen: actueel knelpunt", () => {
    const r = assessNetcongestie(
      baseInput({ beperkingen: "ja", aansluiting: "groot" }),
    );
    expect(r.status).toBe("likely_applicable");
    expect(r.priority).toBe("now");
  });

  it("uitbreidingsplannen: verhoogde relevantie", () => {
    const r = assessNetcongestie(
      baseInput({ plannen: ["uitbreiding"], aansluiting: "groot", beperkingen: "nee" }),
    );
    expect(r.status).toBe("possibly_applicable");
  });

  it("zonder data: onvoldoende informatie", () => {
    const r = assessNetcongestie(baseInput());
    expect(r.status).toBe("insufficient_data");
    expect(r.confidence).toBe("low");
  });

  it("geen signalen: geen concreet knelpunt, blijven monitoren", () => {
    const r = assessNetcongestie(
      baseInput({
        aansluiting: "klein",
        beperkingen: "nee",
        wachtOpAansluiting: "nee",
        plannen: ["geen"],
      }),
    );
    expect(r.status).toBe("likely_not_applicable");
    expect(r.priority).toBe("monitor");
  });

  it("'onbekend' telt niet als 'nee': geen geruststellende conclusie", () => {
    const r = assessNetcongestie(
      baseInput({
        aansluiting: "groot",
        beperkingen: "onbekend",
        wachtOpAansluiting: "onbekend",
        plannen: ["geen"],
      }),
    );
    expect(r.status).toBe("insufficient_data");
    // Mag nooit beweren dat er geen beperkingen of aanvraag zijn.
    expect(r.reasons.join(" ")).not.toContain("geen gemelde beperkingen");
  });

  it("beperkingen 'nee' maar wachtstatus onbekend: nog geen conclusie", () => {
    const r = assessNetcongestie(
      baseInput({
        aansluiting: "klein",
        beperkingen: "nee",
        wachtOpAansluiting: "onbekend",
        plannen: ["geen"],
      }),
    );
    expect(r.status).toBe("insufficient_data");
  });
});

describe("batterijscore", () => {
  const vol = baseInput({
    beperkingen: "ja",
    wachtOpAansluiting: "ja",
    eigenOpwek: "zon",
    terugleveringKwh: 30_000,
    elektriciteit: { type: "exact", value: 400_000 },
    grootsteProbleem: "piekvermogen",
    batterij: {
      hoofddoel: "peak_shaving",
      kwartierdataBeschikbaar: "ja",
      piekKw: 120,
      flexibelProfiel: "ja",
      ruimteBeschikbaar: "ja",
      investeringshorizonJaren: "b5_10",
      noodstroomNodig: "nee",
    },
  });

  it("volledige sterke casus scoort ≥ 70 (kansrijk)", () => {
    const s = computeBatteryScore(vol);
    expect(s.total).toBeGreaterThanOrEqual(70);
    expect(batteryCategory(s.total)).toBe("kansrijk");
  });

  it("scoregrenzen: 44/45/69/70", () => {
    expect(batteryCategory(44)).toBe("niet_eerste_stap");
    expect(batteryCategory(45)).toBe("meer_data");
    expect(batteryCategory(69)).toBe("meer_data");
    expect(batteryCategory(70)).toBe("kansrijk");
  });

  it("lege invoer scoort laag en registreert ontbrekende data", () => {
    const s = computeBatteryScore(baseInput());
    expect(s.total).toBeLessThan(45);
    expect(s.missingCount).toBeGreaterThanOrEqual(4);
  });

  it("deelscores blijven binnen hun maxima", () => {
    const s = computeBatteryScore(vol);
    expect(s.parts.knelpunt).toBeLessThanOrEqual(20);
    expect(s.parts.piek).toBeLessThanOrEqual(20);
    expect(s.parts.opwek).toBeLessThanOrEqual(20);
    expect(s.parts.flexibiliteit).toBeLessThanOrEqual(15);
    expect(s.parts.economisch).toBeLessThanOrEqual(10);
    expect(s.parts.meetdata).toBeLessThanOrEqual(10);
    expect(s.parts.fysiek).toBeLessThanOrEqual(5);
  });

  it("toont geen cijfer bij te veel ontbrekende gegevens", () => {
    const r = assessBatterijscan(baseInput());
    expect(r.status).toBe("insufficient_data");
    // Geen misleidende "0 van 100" tonen.
    expect(r.reasons.join(" ")).not.toContain("van 100");
    expect(r.reasons.join(" ")).toContain("nog niet betrouwbaar");
  });

  it("toont wél een score bij een voldoende ingevulde casus", () => {
    const r = assessBatterijscan(vol);
    expect(r.status).toBe("likely_applicable");
    expect(r.reasons.join(" ")).toContain("van 100");
  });

  it("schrijft 'onderdelen' correct (geen 'onderdeelen')", () => {
    const r = assessBatterijscan(baseInput());
    expect(r.reasons.join(" ")).not.toContain("onderdeelen");
  });
});

describe("engine", () => {
  it("levert voor ieder resultaat minimaal één geldige bron", () => {
    const outcome = runAssessment(baseInput());
    for (const r of outcome.results) {
      expect(r.sourceIds.length).toBeGreaterThan(0);
      for (const id of r.sourceIds) {
        expect(SOURCES[id], `bron ${id} bestaat`).toBeDefined();
      }
    }
  });

  it("gebruikt de actuele rulesetversie en is deterministisch", () => {
    const input = baseInput({
      elektriciteit: { type: "exact", value: 80_000 },
      hoofdgebruik: "kantoor",
      oppervlakteBand: "b250_1000",
      kantoorAandeel: "gte50",
      energielabel: "D",
    });
    const now = new Date("2026-07-20T12:00:00Z");
    const a = runAssessment(input, now);
    const b = runAssessment(input, now);
    expect(a.rulesetVersion).toBe(RULESET_VERSION);
    expect(a).toEqual(b);
  });

  it("beoordeelt alle zeven onderwerpen", () => {
    const outcome = runAssessment(baseInput());
    expect(outcome.results).toHaveLength(7);
    const ids = outcome.results.map((r) => r.topicId);
    expect(new Set(ids).size).toBe(7);
  });
});
