import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  computeTotalPages,
  normalizeListApiItemsPerPage,
  normalizeListApiMode,
  normalizeListApiPage,
  paginateListApiItems,
} from "./listApiUtils";

describe("pagination helpers", () => {
  it("normalizes list mode", () => {
    expect(normalizeListApiMode()).toBe("fixed");
    expect(normalizeListApiMode("dynamic")).toBe("dynamic");
    expect(normalizeListApiMode("fixed")).toBe("fixed");
  });

  it("paginates items client-side", () => {
    const items = Array.from({ length: 25 }, (_, index) => index + 1);
    expect(paginateListApiItems(items, 2, 10)).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
    expect(paginateListApiItems(items, 1, undefined)).toEqual(items);
  });

  it("normalizes page to at least 1", () => {
    expect(normalizeListApiPage()).toBe(1);
    expect(normalizeListApiPage(0)).toBe(1);
    expect(normalizeListApiPage(3)).toBe(3);
  });

  it("normalizes itemsPerPage to a positive value capped at 100", () => {
    expect(normalizeListApiItemsPerPage()).toBe(10);
    expect(normalizeListApiItemsPerPage(15)).toBe(15);
    expect(normalizeListApiItemsPerPage(150)).toBe(100);
    expect(normalizeListApiItemsPerPage(0)).toBe(10);
  });

  it("computes total pages from totalItems and itemsPerPage", () => {
    expect(computeTotalPages(48, 10)).toBe(5);
    expect(computeTotalPages(50, 10)).toBe(5);
    expect(computeTotalPages(0, 10)).toBe(0);
  });
});

describe("fetchListApiCollectionCached", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllGlobals();
  });

  it("fetches the collection with API Platform pagination query params", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        items: [],
        totalItems: 48,
        totalPages: 5,
        page: 2,
        itemsPerPage: 10,
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const { fetchListApiCollectionCached } = await import("./listApiUtils");

    const response = await fetchListApiCollectionCached("flashnews_article_home", 2, 10);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/page-builder/lists/flashnews_article_home/items?page=2&itemsPerPage=10",
      expect.objectContaining({
        credentials: "same-origin",
        headers: { Accept: "application/json" },
      })
    );
    expect(response.totalItems).toBe(48);
    expect(response.totalPages).toBe(5);
    expect(response.page).toBe(2);
    expect(response.itemsPerPage).toBe(10);
  });
});

describe("fetchDynamicListCollectionCached", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllGlobals();
  });

  it("fetches dynamic list collection from ApiListArticleDynamique endpoint", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        items: [{ id: "1", title: "Article" }],
        totalItems: 1,
        totalPages: 1,
        page: 1,
        itemsPerPage: 20,
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const { fetchDynamicListCollectionCached } = await import("./listApiUtils");

    const response = await fetchDynamicListCollectionCached("charisma_article_auteur", 1, 20, "mission");

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/page-builder/lists/dynamic/charisma_article_auteur/items?page=1&itemsPerPage=20&search=mission",
      expect.objectContaining({
        credentials: "same-origin",
        headers: { Accept: "application/json" },
      })
    );
    expect(response.items).toHaveLength(1);
    expect(response.items[0]?.title).toBe("Article");
  });
});

describe("fetchDynamicListItemsCached", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllGlobals();
  });

  it("posts dynamic entries to the resolve endpoint", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        items: [
          { id: "1", title: "Premier" },
          { id: "2", title: "Second" },
        ],
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const { fetchDynamicListItemsCached } = await import("./listApiUtils");

    const items = await fetchDynamicListItemsCached([
      { id: "1", type: "charisma_article_enaction_home" },
      { id: "2", type: "charisma_article_expression_home" },
    ]);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/page-builder/lists/dynamic/resolve",
      expect.objectContaining({
        method: "POST",
        credentials: "same-origin",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entries: [
            { id: "1", type: "charisma_article_enaction_home" },
            { id: "2", type: "charisma_article_expression_home" },
          ],
        }),
      })
    );
    expect(items).toHaveLength(2);
    expect(items[0]?.title).toBe("Premier");
  });
});
