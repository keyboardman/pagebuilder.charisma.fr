import { describe, expect, it } from "vitest";
import { formatFavoriCountLabel, parseFavoriCount } from "./favoriCount";

describe("parseFavoriCount", () => {
  it("lit raw.favori numérique", () => {
    expect(parseFavoriCount({ favori: 42 })).toBe(42);
  });

  it("lit raw.favori chaîne", () => {
    expect(parseFavoriCount({ favori: "15" })).toBe(15);
  });

  it("lit favori imbriqué dans raw.raw (item API mappé)", () => {
    expect(
      parseFavoriCount({
        id: "159",
        title: "10 000 Reasons",
        raw: { id: 159, favori: 1027 },
      })
    ).toBe(1027);
  });

  it("retourne 0 si absent ou invalide", () => {
    expect(parseFavoriCount(null)).toBe(0);
    expect(parseFavoriCount({})).toBe(0);
    expect(parseFavoriCount({ favori: "abc" })).toBe(0);
  });
});

describe("formatFavoriCountLabel", () => {
  it("formate les grands nombres", () => {
    expect(formatFavoriCountLabel(10000)).toBe("9999+");
  });

  it("gère les valeurs invalides", () => {
    expect(formatFavoriCountLabel(-1)).toBe("0");
    expect(formatFavoriCountLabel(Number.NaN)).toBe("0");
  });
});

describe("parseFavoriCountAttribute", () => {
  it("parse un attribut data-favori-count", async () => {
    const { parseFavoriCountAttribute } = await import("./favoriCount");
    expect(parseFavoriCountAttribute("12")).toBe(12);
    expect(parseFavoriCountAttribute("12.8")).toBe(12);
    expect(parseFavoriCountAttribute("")).toBeUndefined();
    expect(parseFavoriCountAttribute(null)).toBeUndefined();
    expect(parseFavoriCountAttribute("abc")).toBeUndefined();
  });
});
