import type { NodeListImageMediaEntry } from "./index";

export interface ListImageSourceMeta {
  id: string;
  label: string;
  collectionMode?: string;
}

export interface ListImageMappedItem {
  id: string;
  image: string;
  link?: string;
  alt?: string;
}

export interface ListImageCollectionResponse {
  items: ListImageMappedItem[];
  totalItems: number;
  totalPages: number;
  page: number;
  itemsPerPage: number;
}

export const DEFAULT_LIST_IMAGE_ITEMS_PER_PAGE = 10;
export const MAX_LIST_IMAGE_ITEMS_PER_PAGE = 100;
export const LIST_IMAGE_MEDIA_TYPE = "media" as const;

export type NodeListImageMode = "fixed" | "dynamic";

export function normalizeListImageMode(value?: string): NodeListImageMode {
  return value === "dynamic" ? "dynamic" : "fixed";
}

export function normalizeListImagePage(page?: number): number {
  return Math.max(1, page ?? 1);
}

export function normalizeListImageItemsPerPage(value?: number): number {
  if (value == null || Number.isNaN(value) || value < 1) {
    return DEFAULT_LIST_IMAGE_ITEMS_PER_PAGE;
  }

  return Math.min(value, MAX_LIST_IMAGE_ITEMS_PER_PAGE);
}

export function paginateListImageItems<T>(items: T[], page: number, itemsPerPage?: number): T[] {
  if (itemsPerPage == null || itemsPerPage < 1) {
    return items;
  }

  const safePage = normalizeListImagePage(page);
  const safeSize = normalizeListImageItemsPerPage(itemsPerPage);
  const start = (safePage - 1) * safeSize;

  return items.slice(start, start + safeSize);
}

export function mapMediaEntriesToListImageItems(entries: NodeListImageMediaEntry[]): ListImageMappedItem[] {
  return entries
    .filter((entry) => entry.src.trim().length > 0)
    .map((entry) => ({
      id: entry.id,
      image: entry.src.trim(),
      alt: entry.alt?.trim() || undefined,
      link: entry.link?.trim() || undefined,
    }));
}

export function mapCollectionToListImageItems(items: unknown[]): ListImageMappedItem[] {
  return items
    .map((item) => {
      const o = item as Partial<ListImageMappedItem>;
      return {
        id: String(o.id ?? ""),
        image: String(o.image ?? ""),
        link: o.link ? String(o.link) : undefined,
        alt: o.alt ? String(o.alt) : undefined,
      };
    })
    .filter((item) => item.id !== "" && item.image.trim().length > 0);
}

export async function fetchListImageCatalog(): Promise<ListImageSourceMeta[]> {
  const res = await fetch("/api/page-builder/lists-image", {
    credentials: "same-origin",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Impossible de charger le catalogue lists-image (${res.status})`);
  }

  const data = (await res.json()) as { items?: ListImageSourceMeta[] };
  return data.items ?? [];
}

export function buildListImageItemsUrl(apiId: string, page = 1, itemsPerPage = DEFAULT_LIST_IMAGE_ITEMS_PER_PAGE): string {
  const params = new URLSearchParams({
    page: String(page),
    itemsPerPage: String(itemsPerPage),
  });

  return `/api/page-builder/lists-image/${encodeURIComponent(apiId)}/items?${params.toString()}`;
}

function buildListImageCacheKey(apiId: string, page: number, itemsPerPage: number): string {
  return `${apiId}:${page}:${itemsPerPage}`;
}

const listImageCollectionCache = new Map<string, ListImageCollectionResponse>();
const listImageCollectionInFlight = new Map<string, Promise<ListImageCollectionResponse>>();

async function fetchListImageCollection(
  apiId: string,
  page: number,
  itemsPerPage: number
): Promise<ListImageCollectionResponse> {
  const res = await fetch(buildListImageItemsUrl(apiId, page, itemsPerPage), {
    credentials: "same-origin",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Impossible de charger la collection lists-image (${res.status})`);
  }

  const data = (await res.json()) as Partial<ListImageCollectionResponse>;
  const safeItemsPerPage = normalizeListImageItemsPerPage(data.itemsPerPage);
  const safePage = normalizeListImagePage(data.page);

  return {
    items: Array.isArray(data.items) ? mapCollectionToListImageItems(data.items) : [],
    totalItems: typeof data.totalItems === "number" ? data.totalItems : 0,
    totalPages: typeof data.totalPages === "number" ? data.totalPages : 0,
    page: safePage,
    itemsPerPage: safeItemsPerPage,
  };
}

export async function fetchListImageCollectionCached(
  apiId: string,
  page?: number,
  itemsPerPage?: number
): Promise<ListImageCollectionResponse> {
  const safePage = normalizeListImagePage(page);
  const safeItemsPerPage = normalizeListImageItemsPerPage(itemsPerPage);
  const cacheKey = buildListImageCacheKey(apiId, safePage, safeItemsPerPage);

  const cached = listImageCollectionCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const inFlight = listImageCollectionInFlight.get(cacheKey);
  if (inFlight) {
    return inFlight;
  }

  const promise = fetchListImageCollection(apiId, safePage, safeItemsPerPage).then((response) => {
    listImageCollectionCache.set(cacheKey, response);
    listImageCollectionInFlight.delete(cacheKey);
    return response;
  });

  listImageCollectionInFlight.set(cacheKey, promise);
  return promise;
}

export async function fetchListImageItems(
  apiId: string,
  options?: { page?: number; itemsPerPage?: number }
): Promise<ListImageCollectionResponse> {
  return fetchListImageCollectionCached(apiId, options?.page, options?.itemsPerPage);
}
