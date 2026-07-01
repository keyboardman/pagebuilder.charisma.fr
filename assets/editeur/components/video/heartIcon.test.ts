import { describe, expect, it } from "vitest";
import { renderCharismaFavoriHeart } from "./heartIcon";

describe("renderCharismaFavoriHeart", () => {
  it("affiche le compteur dans le SVG", () => {
    const html = renderCharismaFavoriHeart(1027);

    expect(html).toContain("vjs-charisma-favori__svg");
    expect(html).toContain("1027");
    expect(html).toContain('font-weight="700"');
  });

  it("formate les grands nombres", () => {
    expect(renderCharismaFavoriHeart(10000)).toContain("9999+");
  });
});
