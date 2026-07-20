import { describe, expect, it } from "vitest";
import { mapEnergieklasse } from "./ep-online";

describe("mapEnergieklasse (EP-Online -> interne enum)", () => {
  it("mapt alle A-varianten naar 'A'", () => {
    for (const raw of ["A", "A+", "A++", "A+++", "A++++", "a+++"]) {
      expect(mapEnergieklasse(raw)).toBe("A");
    }
  });

  it("behoudt B t/m G", () => {
    for (const raw of ["B", "C", "D", "E", "F", "G"]) {
      expect(mapEnergieklasse(raw)).toBe(raw);
    }
  });

  it("geeft 'onbekend' bij lege of onbekende waarde", () => {
    expect(mapEnergieklasse(null)).toBe("onbekend");
    expect(mapEnergieklasse(undefined)).toBe("onbekend");
    expect(mapEnergieklasse("")).toBe("onbekend");
    expect(mapEnergieklasse("X")).toBe("onbekend");
  });

  it("negeert omringende spaties en hoofd-/kleine letters", () => {
    expect(mapEnergieklasse("  c ")).toBe("C");
  });
});
