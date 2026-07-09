import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  computeTotalPages,
  normalizeListApiItemsPerPage,
  normalizeListApiPage,
} from "./listApiUtils";

describe("pagination helpers", () => {
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
