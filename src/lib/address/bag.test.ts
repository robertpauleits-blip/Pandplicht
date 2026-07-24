import { describe, expect, it } from "vitest";
import { mapGebruiksdoelen } from "./bag";

describe("mapGebruiksdoelen (BAG -> interne hoofdgebruik)", () => {
  it("mapt enkele zakelijke functies", () => {
    expect(mapGebruiksdoelen(["kantoorfunctie"]).hoofdgebruik).toBe("kantoor");
    expect(mapGebruiksdoelen(["winkelfunctie"]).hoofdgebruik).toBe("winkel");
    expect(mapGebruiksdoelen(["industriefunctie"]).hoofdgebruik).toBe("industrie");
    expect(mapGebruiksdoelen(["gezondheidszorgfunctie"]).hoofdgebruik).toBe("zorg");
    expect(mapGebruiksdoelen(["onderwijsfunctie"]).hoofdgebruik).toBe("onderwijs");
    expect(mapGebruiksdoelen(["sportfunctie"]).hoofdgebruik).toBe("sport");
    expect(mapGebruiksdoelen(["bijeenkomstfunctie"]).hoofdgebruik).toBe("bijeenkomst");
  });

  it("onbekende zakelijke functies vallen onder 'anders'", () => {
    expect(mapGebruiksdoelen(["logiesfunctie"]).hoofdgebruik).toBe("anders");
    expect(mapGebruiksdoelen(["overige gebruiksfunctie"]).hoofdgebruik).toBe("anders");
  });

  it("meerdere verschillende zakelijke functies => gemengd", () => {
    const r = mapGebruiksdoelen(["kantoorfunctie", "industriefunctie"]);
    expect(r.hoofdgebruik).toBe("gemengd");
    expect(r.gemengd).toBe(true);
  });

  it("dezelfde functie dubbel telt als één (niet gemengd)", () => {
    const r = mapGebruiksdoelen(["kantoorfunctie", "kantoorfunctie"]);
    expect(r.hoofdgebruik).toBe("kantoor");
    expect(r.gemengd).toBe(false);
  });

  it("woonfunctie telt niet als zakelijk maar wordt wel gemeld", () => {
    const alleen = mapGebruiksdoelen(["woonfunctie"]);
    expect(alleen.hoofdgebruik).toBeNull();
    expect(alleen.heeftWoonfunctie).toBe(true);

    const gemengdWonen = mapGebruiksdoelen(["woonfunctie", "winkelfunctie"]);
    expect(gemengdWonen.hoofdgebruik).toBe("winkel");
    expect(gemengdWonen.heeftWoonfunctie).toBe(true);
    expect(gemengdWonen.gemengd).toBe(false);
  });

  it("negeert hoofdletters en spaties", () => {
    expect(mapGebruiksdoelen([" Kantoorfunctie "]).hoofdgebruik).toBe("kantoor");
  });
});
