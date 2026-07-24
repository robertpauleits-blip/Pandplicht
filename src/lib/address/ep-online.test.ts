import { describe, expect, it } from "vitest";
import { mapEnergieklasse } from "./ep-online";

describe("mapEnergieklasse (EP-Online -> interne enum)", () => {
  it("behoudt de exacte A-variant (A++ blijft A++, nooit A)", () => {
    for (const raw of ["A", "A+", "A++", "A+++", "A++++", "A+++++"]) {
      expect(mapEnergieklasse(raw)).toBe(raw);
    }
    expect(mapEnergieklasse("a+++")).toBe("A+++");
  });

  it("topt klassen buiten de schaal (meer dan vijf plussen) af op de beste", () => {
    expect(mapEnergieklasse("A++++++")).toBe("A+++++");
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
    expect(mapEnergieklasse(" a++ ")).toBe("A++");
  });
});
