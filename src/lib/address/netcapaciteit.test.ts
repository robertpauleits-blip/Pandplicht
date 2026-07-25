import { describe, expect, it } from "vitest";
import { isKnelpunt, mapCapaciteitCode } from "./netcapaciteit";

describe("mapCapaciteitCode (codes van de capaciteitskaart)", () => {
  it("volgt de officiële codering", () => {
    expect(mapCapaciteitCode(0, "Nieuwegein")).toBe("beschikbaar");
    expect(mapCapaciteitCode(1, "Nieuwegein")).toBe("beperkt");
    expect(mapCapaciteitCode(2, "Nieuwegein")).toBe("in_onderzoek");
    expect(mapCapaciteitCode(3, "Nieuwegein")).toBe("tekort");
  });

  it("code 0 zonder echt voedingsgebied is nog niet vastgesteld", () => {
    // De kaart toont deze gebieden als 'kleur wordt later toegevoegd'.
    expect(mapCapaciteitCode(0, "0")).toBe("onbekend");
    expect(mapCapaciteitCode(0, "")).toBe("onbekend");
    expect(mapCapaciteitCode(-1, "0")).toBe("onbekend");
  });

  it("een knelpuntcode blijft ook zonder gebiedsnaam een knelpunt", () => {
    expect(mapCapaciteitCode(3, "0")).toBe("tekort");
  });

  it("onbruikbare invoer levert 'onbekend'", () => {
    expect(mapCapaciteitCode(null, "Nieuwegein")).toBe("onbekend");
    expect(mapCapaciteitCode("x", "Nieuwegein")).toBe("onbekend");
    expect(mapCapaciteitCode(99, "Nieuwegein")).toBe("onbekend");
  });

  it("accepteert numerieke strings", () => {
    expect(mapCapaciteitCode("2", "Amsterdam")).toBe("in_onderzoek");
  });
});

describe("isKnelpunt", () => {
  it("alleen onderzoek en tekort zijn knelpunten", () => {
    expect(isKnelpunt("in_onderzoek")).toBe(true);
    expect(isKnelpunt("tekort")).toBe(true);
    expect(isKnelpunt("beschikbaar")).toBe(false);
    expect(isKnelpunt("beperkt")).toBe(false);
    expect(isKnelpunt("onbekend")).toBe(false);
  });
});
