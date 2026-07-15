import { describe, expect, it } from "vitest";
import {
  buildListImageItemsUrl,
  LIST_IMAGE_MEDIA_TYPE,
  mapMediaEntriesToListImageItems,
  normalizeListImageItemsPerPage,
  normalizeListImageMode,
  normalizeListImagePage,
} from "./listImageApiUtils";

describe("listImageApiUtils", () => {
  it("buildListImageItemsUrl encodes apiId and pagination params", () => {
    expect(buildListImageItemsUrl("charisma_evenement_home", 2, 20)).toBe(
      "/api/page-builder/lists-image/charisma_evenement_home/items?page=2&itemsPerPage=20"
    );
  });

  it("normalizeListImagePage defaults to 1", () => {
    expect(normalizeListImagePage()).toBe(1);
    expect(normalizeListImagePage(0)).toBe(1);
    expect(normalizeListImagePage(3)).toBe(3);
  });

  it("normalizeListImageItemsPerPage clamps values", () => {
    expect(normalizeListImageItemsPerPage()).toBe(10);
    expect(normalizeListImageItemsPerPage(15)).toBe(15);
    expect(normalizeListImageItemsPerPage(150)).toBe(100);
    expect(normalizeListImageItemsPerPage(0)).toBe(10);
  });

  it("normalizeListImageMode defaults to fixed", () => {
    expect(normalizeListImageMode()).toBe("fixed");
    expect(normalizeListImageMode("dynamic")).toBe("dynamic");
  });

  it("mapMediaEntriesToListImageItems maps médiathèque entries", () => {
    const items = mapMediaEntriesToListImageItems([
      {
        id: "abc",
        type: LIST_IMAGE_MEDIA_TYPE,
        src: "https://cdn.example/a.jpg",
        alt: "Image A",
        link: "https://example/a",
      },
      {
        id: "empty",
        type: LIST_IMAGE_MEDIA_TYPE,
        src: "   ",
      },
    ]);

    expect(items).toHaveLength(1);
    expect(items[0]).toEqual({
      id: "abc",
      image: "https://cdn.example/a.jpg",
      alt: "Image A",
      link: "https://example/a",
    });
  });
});
