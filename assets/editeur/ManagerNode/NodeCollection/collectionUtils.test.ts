import { describe, expect, it } from "vitest";
import { COLLECTION_IMAGE_MEDIA_TYPE } from "./index";
import {
  normalizeCollectionDisplay,
  normalizeCollectionItemsPerPage,
  normalizeCollectionMode,
  normalizeCollectionPage,
  normalizeCollectionType,
  normalizeCollectionView,
  paginateCollectionItems,
  resolveCollectionImageItemsDynamic,
} from "./collectionUtils";

describe("collectionUtils", () => {
  it("normalizes collection type", () => {
    expect(normalizeCollectionType()).toBe("article");
    expect(normalizeCollectionType("image")).toBe("image");
    expect(normalizeCollectionType("video")).toBe("video");
    expect(normalizeCollectionType("unknown")).toBe("article");
  });

  it("normalizes collection mode", () => {
    expect(normalizeCollectionMode()).toBe("fixed");
    expect(normalizeCollectionMode("dynamic")).toBe("dynamic");
  });

  it("normalizes display modes", () => {
    expect(normalizeCollectionDisplay("slideshow")).toBe("slideshow");
    expect(normalizeCollectionDisplay("grid")).toBe("grid");
    expect(normalizeCollectionDisplay("list")).toBe("list");
    expect(normalizeCollectionDisplay()).toBe("list");
  });

  it("normalizes view per collection type", () => {
    expect(normalizeCollectionView("image")).toBe("default");
    expect(normalizeCollectionView("video", "card")).toBe("default");
    expect(normalizeCollectionView("article", "article")).toBe("article");
    expect(normalizeCollectionView("article", "card")).toBe("default");
  });

  it("paginates items locally", () => {
    const items = Array.from({ length: 25 }, (_, index) => index + 1);
    expect(paginateCollectionItems(items, 2, 10)).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
    expect(paginateCollectionItems(items, 1, undefined)).toEqual(items);
  });

  it("normalizes page and itemsPerPage", () => {
    expect(normalizeCollectionPage(0)).toBe(1);
    expect(normalizeCollectionItemsPerPage(150)).toBe(100);
    expect(normalizeCollectionItemsPerPage(0)).toBe(10);
  });

  it("maps dynamic image entries", () => {
    const items = resolveCollectionImageItemsDynamic([
      {
        id: "1",
        type: COLLECTION_IMAGE_MEDIA_TYPE,
        src: "https://example.com/a.jpg",
        alt: "A",
      },
    ]);

    expect(items).toEqual([
      {
        id: "1",
        collectionType: "image",
        image: "https://example.com/a.jpg",
        alt: "A",
        link: undefined,
      },
    ]);
  });

  it("maps dynamic image entries with link", () => {
    const items = resolveCollectionImageItemsDynamic([
      {
        id: "2",
        type: COLLECTION_IMAGE_MEDIA_TYPE,
        src: " https://example.com/b.jpg ",
        alt: " B ",
        link: " https://example.com/target ",
      },
      {
        id: "3",
        type: COLLECTION_IMAGE_MEDIA_TYPE,
        src: "https://example.com/c.jpg",
        link: "   ",
      },
    ]);

    expect(items).toEqual([
      {
        id: "2",
        collectionType: "image",
        image: "https://example.com/b.jpg",
        alt: "B",
        link: "https://example.com/target",
      },
      {
        id: "3",
        collectionType: "image",
        image: "https://example.com/c.jpg",
        alt: undefined,
        link: undefined,
      },
    ]);
  });
});
