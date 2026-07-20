import { describe, expect, it } from "vitest";
import { ARTICLES } from "./knowledge";
import { SOURCES } from "@/rules/sources";

describe("redactionele contentvalidatie", () => {
  it("bevat de volledige P0-contentset (15 artikelen)", () => {
    expect(ARTICLES.length).toBe(15);
  });

  it("ieder artikel heeft unieke slug, beschrijving en kort antwoord", () => {
    const slugs = new Set(ARTICLES.map((a) => a.slug));
    expect(slugs.size).toBe(ARTICLES.length);
    for (const a of ARTICLES) {
      expect(a.description.length, a.slug).toBeGreaterThan(40);
      // Kort antwoord ± 40–80 woorden: bewaak zelfstandige leesbaarheid.
      const words = a.kortAntwoord.split(/\s+/).length;
      expect(words, `${a.slug} kort antwoord (${words} woorden)`).toBeGreaterThanOrEqual(30);
      expect(words, `${a.slug} kort antwoord (${words} woorden)`).toBeLessThanOrEqual(95);
    }
  });

  it("ieder artikel verwijst naar bestaande bronnen met controledatum", () => {
    for (const a of ARTICLES) {
      expect(a.sourceIds.length, a.slug).toBeGreaterThan(0);
      for (const id of a.sourceIds) {
        expect(SOURCES[id], `bron ${id} in ${a.slug}`).toBeDefined();
        expect(SOURCES[id]!.checkedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    }
  });

  it("gerelateerde artikelen bestaan", () => {
    for (const a of ARTICLES) {
      for (const rel of a.related) {
        expect(
          ARTICLES.some((x) => x.slug === rel),
          `${rel} in ${a.slug}`,
        ).toBe(true);
      }
    }
  });

  it("lastReviewedAt is niet ouder dan 12 maanden (versheidswaarschuwing)", () => {
    const limit = new Date();
    limit.setMonth(limit.getMonth() - 12);
    for (const a of ARTICLES) {
      expect(new Date(a.lastReviewedAt).getTime(), a.slug).toBeGreaterThan(
        limit.getTime(),
      );
    }
  });
});
