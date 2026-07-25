import { describe, expect, it } from "vitest";
import { classifyFeatures, formatMonumentnummer } from "./monument";

describe("formatMonumentnummer", () => {
  it("verwijdert de .00-suffix", () => {
    expect(formatMonumentnummer("10001.00")).toBe("10001");
  });

  it("laat onderdeelnummers (.01) staan", () => {
    expect(formatMonumentnummer("523456.01")).toBe("523456.01");
  });

  it("geeft null bij ontbrekende of niet-string invoer", () => {
    expect(formatMonumentnummer(undefined)).toBeNull();
    expect(formatMonumentnummer(123)).toBeNull();
    expect(formatMonumentnummer("")).toBeNull();
  });
});

describe("classifyFeatures", () => {
  const rijksmonument = {
    namespace: "nlps-rijksmonumenten",
    localid: "70887.00",
    ci_citation: "https://monumentenregister.cultureelerfgoed.nl/monumenten/530421",
  };
  const gezicht = {
    namespace: "nlps-stadsendorpsgezichten",
    localid: "10134346.00",
    ci_citation: "https://kennis.cultureelerfgoed.nl/index.php/Gezicht/1477",
  };

  it("herkent een individueel rijksmonument", () => {
    const r = classifyFeatures([rijksmonument]);
    expect(r?.status).toBe("rijksmonument");
    expect(r).toMatchObject({ monumentnummer: "70887", match: "vlak" });
  });

  it("een rijksmonument wint van een beschermd gezicht", () => {
    const r = classifyFeatures([gezicht, rijksmonument]);
    expect(r?.status).toBe("rijksmonument");
  });

  it("alleen een gezicht => beschermd_gezicht (geen monument)", () => {
    const r = classifyFeatures([gezicht]);
    expect(r?.status).toBe("beschermd_gezicht");
  });

  it("geen relevante features => null", () => {
    expect(classifyFeatures([])).toBeNull();
  });

  it("classificeert ook op ci_citation als namespace ontbreekt", () => {
    const r = classifyFeatures([
      { ci_citation: "https://monumentenregister.cultureelerfgoed.nl/monumenten/1" },
    ]);
    expect(r?.status).toBe("rijksmonument");
  });
});
