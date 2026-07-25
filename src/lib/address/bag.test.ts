import { describe, expect, it } from "vitest";
import { bepaalPandSamenstelling, mapGebruiksdoelen } from "./bag";

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

describe("bepaalPandSamenstelling (kantooraandeel uit de BAG)", () => {
  it("overwegend kantoor => gte50 (praktijkgeval Provinciehuis Utrecht)", () => {
    const r = bepaalPandSamenstelling([
      { gebruiksdoel: "kantoorfunctie", oppervlakteM2: 26127 },
      { gebruiksdoel: "logiesfunctie", oppervlakteM2: 3810 },
    ]);
    expect(r.totaalM2).toBe(29937);
    expect(r.kantoorM2).toBe(26127);
    expect(r.kantoorAandeel).toBe("gte50");
    expect(r.kantoorPctMin).toBe(87);
  });

  it("geen kantoorfunctie => lt50 (praktijkgeval winkelpand)", () => {
    const r = bepaalPandSamenstelling([
      { gebruiksdoel: "winkelfunctie", oppervlakteM2: 1959 },
      { gebruiksdoel: "bijeenkomstfunctie", oppervlakteM2: 270 },
    ]);
    expect(r.kantoorAandeel).toBe("lt50");
    expect(r.kantoorPctMax).toBe(0);
  });

  it("combifunctie is onzeker en blijft onbeantwoord (Stadskantoor Utrecht)", () => {
    const r = bepaalPandSamenstelling([
      { gebruiksdoel: "industriefunctie,kantoorfunctie", oppervlakteM2: 64446 },
      { gebruiksdoel: "industriefunctie", oppervlakteM2: 1 },
    ]);
    expect(r.onzekerM2).toBe(64446);
    expect(r.kantoorM2).toBe(0);
    // Ondergrens 0%, bovengrens ~100%: de 50%-grens ligt ertussen.
    expect(r.kantoorAandeel).toBeNull();
  });

  it("onzekere m² die de uitkomst niet kan kantelen, blokkeert niet", () => {
    // 80 m² zeker kantoor + 10 m² onzeker op 100 m² totaal: min 80%, max 90%.
    const r = bepaalPandSamenstelling([
      { gebruiksdoel: "kantoorfunctie", oppervlakteM2: 80 },
      { gebruiksdoel: "kantoorfunctie,woonfunctie", oppervlakteM2: 10 },
      { gebruiksdoel: "winkelfunctie", oppervlakteM2: 10 },
    ]);
    expect(r.kantoorAandeel).toBe("gte50");

    // Spiegelbeeld: max blijft onder de 50%.
    const laag = bepaalPandSamenstelling([
      { gebruiksdoel: "kantoorfunctie", oppervlakteM2: 30 },
      { gebruiksdoel: "kantoorfunctie,woonfunctie", oppervlakteM2: 10 },
      { gebruiksdoel: "winkelfunctie", oppervlakteM2: 60 },
    ]);
    expect(laag.kantoorAandeel).toBe("lt50");
  });

  it("precies 50% telt als gte50", () => {
    const r = bepaalPandSamenstelling([
      { gebruiksdoel: "kantoorfunctie", oppervlakteM2: 500 },
      { gebruiksdoel: "winkelfunctie", oppervlakteM2: 500 },
    ]);
    expect(r.kantoorAandeel).toBe("gte50");
    expect(r.kantoorPctMin).toBe(50);
  });

  it("zonder bruikbare oppervlakten geen uitspraak", () => {
    const r = bepaalPandSamenstelling([
      { gebruiksdoel: "kantoorfunctie", oppervlakteM2: 0 },
    ]);
    expect(r.totaalM2).toBe(0);
    expect(r.kantoorAandeel).toBeNull();
  });

  it("leeg pand levert geen uitspraak", () => {
    expect(bepaalPandSamenstelling([]).kantoorAandeel).toBeNull();
  });
});
