import { describe, expect, it } from "vitest";
import { parseRdPoint } from "./rd";

describe("parseRdPoint", () => {
  it("leest RD-coördinaten uit een POINT-string", () => {
    expect(parseRdPoint("POINT(120816.373 485901.503)")).toEqual({
      x: 120816.373,
      y: 485901.503,
    });
  });

  it("negeert extra spaties en hoofdletters", () => {
    expect(parseRdPoint("point(  138964.792   456284.283 )")).toEqual({
      x: 138964.792,
      y: 456284.283,
    });
  });

  it("geeft null bij ongeldige invoer", () => {
    expect(parseRdPoint("")).toBeNull();
    expect(parseRdPoint("geen punt")).toBeNull();
    expect(parseRdPoint("POINT(a b)")).toBeNull();
  });
});
