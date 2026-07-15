import type { NodeListApiDynamicEntry, NodeListApiMode } from "./index";

export const DEFAULT_LIST_API_ITEMS_PER_PAGE = 10;

export const MAX_LIST_API_ITEMS_PER_PAGE = 100;

export function normalizeListApiMode(value?: string): NodeListApiMode {
  return value === "dynamic" ? "dynamic" : "fixed";
}

export function paginateListApiItems<T>(items: T[], page: number, itemsPerPage?: number): T[] {
  if (itemsPerPage == null || itemsPerPage < 1) {
    return items;
  }

  const safePage = normalizeListApiPage(page);
  const safeSize = normalizeListApiItemsPerPage(itemsPerPage);
  const start = (safePage - 1) * safeSize;

  return items.slice(start, start + safeSize);
}

export interface ListApiMappedItem {
  id: string;
  title: string;
  description?: string;
  counter?: string | number;
  like?: string | number;
  link?: string;
}

export interface ListApiCollectionResponse {
  items: ListApiMappedItem[];
  totalItems: number;
  totalPages: number;
  page: number;
  itemsPerPage: number;
}

export function normalizeListApiPage(page?: number): number {
  return Math.max(1, page ?? 1);
}

export function normalizeListApiItemsPerPage(value?: number): number {
  if (value == null || Number.isNaN(value) || value < 1) {
    return DEFAULT_LIST_API_ITEMS_PER_PAGE;
  }

  return Math.min(value, MAX_LIST_API_ITEMS_PER_PAGE);
}

export function computeTotalPages(totalItems: number, itemsPerPage: number): number {
  if (totalItems <= 0) {
    return 0;
  }

  return Math.max(1, Math.ceil(totalItems / itemsPerPage));
}

export function hasListMetricValue(value: unknown): boolean {
  if (value == null) {
    return false;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed !== "" && trimmed !== "0";
  }
  if (typeof value === "number") {
    return value !== 0;
  }
  return true;
}

function normalizeListMetric(value: string | number | undefined): string | number | undefined {
  return hasListMetricValue(value) ? value : undefined;
}

export function mapCollectionToListItems(items: unknown[]): ListApiMappedItem[] {
  return items.map((item) => {
    const o = item as Partial<ListApiMappedItem> & { id?: unknown; title?: unknown };

    return {
      id: String(o?.id ?? ""),
      title: String(o?.title ?? ""),
      description: o?.description != null ? String(o.description) : undefined,
      counter: normalizeListMetric(o?.counter),
      like: normalizeListMetric(o?.like),
      link: o?.link != null ? String(o.link) : undefined,
    };
  });
}

function buildListApiItemsUrl(apiId: string, page: number, itemsPerPage: number): string {
  const params = new URLSearchParams({
    page: String(page),
    itemsPerPage: String(itemsPerPage),
  });

  return `/api/page-builder/lists/${encodeURIComponent(apiId)}/items?${params.toString()}`;
}

function buildListApiCacheKey(apiId: string, page: number, itemsPerPage: number): string {
  return `${apiId}:${page}:${itemsPerPage}`;
}

// Cache in-memory (durée de vie: session/page). But: éviter des refetchs
// quand on bascule entre PREVIEW et EDIT (remount du composant).
const listApiCollectionCache = new Map<string, ListApiCollectionResponse>();
const listApiCollectionInFlight = new Map<string, Promise<ListApiCollectionResponse>>();

async function fetchListItems(
  apiId: string,
  page: number,
  itemsPerPage: number
): Promise<ListApiCollectionResponse> {
  const res = await fetch(buildListApiItemsUrl(apiId, page, itemsPerPage), {
    credentials: "same-origin",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(text || "fetchListItems failed");
  }

  const data = (await res.json()) as {
    items: unknown[];
    totalItems?: number;
    totalPages?: number;
    page?: number;
    itemsPerPage?: number;
  };

  const safeItemsPerPage = normalizeListApiItemsPerPage(data.itemsPerPage);
  const safePage = normalizeListApiPage(data.page);
  const totalItems = data.totalItems ?? 0;
  const totalPages = data.totalPages ?? computeTotalPages(totalItems, safeItemsPerPage);

  return {
    items: mapCollectionToListItems(data.items ?? []),
    totalItems,
    totalPages,
    page: safePage,
    itemsPerPage: safeItemsPerPage,
  };
}

export async function fetchListApiCollectionCached(
  apiId: string,
  page?: number,
  itemsPerPage?: number
): Promise<ListApiCollectionResponse> {
  const safePage = normalizeListApiPage(page);
  const safeItemsPerPage = normalizeListApiItemsPerPage(itemsPerPage);
  const cacheKey = buildListApiCacheKey(apiId, safePage, safeItemsPerPage);

  const cached = listApiCollectionCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const inFlight = listApiCollectionInFlight.get(cacheKey);
  if (inFlight) {
    return inFlight;
  }

  const promise = fetchListItems(apiId, safePage, safeItemsPerPage);

  listApiCollectionInFlight.set(cacheKey, promise);

  try {
    const mapped = await promise;
    listApiCollectionCache.set(cacheKey, mapped);
    return mapped;
  } finally {
    listApiCollectionInFlight.delete(cacheKey);
  }
}

export function isShowEnabled(value: boolean | undefined): boolean {
  return value !== false;
}

export function formatCounterValue(counter: string | number | undefined): string {
  if (!hasListMetricValue(counter)) {
    return "";
  }
  return String(counter);
}

export const formatLikeValue = formatCounterValue;

export interface DynamicListSource {
  id: string;
  label: string;
}

function buildDynamicListItemsUrl(apiId: string, page: number, itemsPerPage: number, search?: string): string {
  const params = new URLSearchParams({
    page: String(page),
    itemsPerPage: String(itemsPerPage),
  });
  if (search?.trim()) {
    params.set("search", search.trim());
  }

  return `/api/page-builder/lists/dynamic/${encodeURIComponent(apiId)}/items?${params.toString()}`;
}

function buildDynamicListCollectionCacheKey(
  apiId: string,
  page: number,
  itemsPerPage: number,
  search?: string
): string {
  return `${apiId}:${page}:${itemsPerPage}:${search ?? ""}`;
}

const dynamicListCollectionCache = new Map<string, ListApiCollectionResponse>();
const dynamicListCollectionInFlight = new Map<string, Promise<ListApiCollectionResponse>>();

export async function fetchDynamicListSources(): Promise<DynamicListSource[]> {
  const res = await fetch("/api/page-builder/lists/dynamic", {
    credentials: "same-origin",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    return [];
  }

  const data = (await res.json()) as { items?: DynamicListSource[] };
  return data.items ?? [];
}

async function fetchDynamicListCollection(
  apiId: string,
  page: number,
  itemsPerPage: number,
  search?: string
): Promise<ListApiCollectionResponse> {
  const res = await fetch(buildDynamicListItemsUrl(apiId, page, itemsPerPage, search), {
    credentials: "same-origin",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(text || "fetchDynamicListCollection failed");
  }

  const data = (await res.json()) as {
    items: unknown[];
    totalItems?: number;
    totalPages?: number;
    page?: number;
    itemsPerPage?: number;
  };

  const safeItemsPerPage = normalizeListApiItemsPerPage(data.itemsPerPage);
  const safePage = normalizeListApiPage(data.page);
  const totalItems = data.totalItems ?? 0;
  const totalPages = data.totalPages ?? computeTotalPages(totalItems, safeItemsPerPage);

  return {
    items: mapCollectionToListItems(data.items ?? []),
    totalItems,
    totalPages,
    page: safePage,
    itemsPerPage: safeItemsPerPage,
  };
}

export async function fetchDynamicListCollectionCached(
  apiId: string,
  page?: number,
  itemsPerPage?: number,
  search?: string
): Promise<ListApiCollectionResponse> {
  const safePage = normalizeListApiPage(page);
  const safeItemsPerPage = normalizeListApiItemsPerPage(itemsPerPage);
  const cacheKey = buildDynamicListCollectionCacheKey(apiId, safePage, safeItemsPerPage, search);

  const cached = dynamicListCollectionCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const inFlight = dynamicListCollectionInFlight.get(cacheKey);
  if (inFlight) {
    return inFlight;
  }

  const promise = fetchDynamicListCollection(apiId, safePage, safeItemsPerPage, search);
  dynamicListCollectionInFlight.set(cacheKey, promise);

  try {
    const mapped = await promise;
    dynamicListCollectionCache.set(cacheKey, mapped);
    return mapped;
  } finally {
    dynamicListCollectionInFlight.delete(cacheKey);
  }
}

function buildDynamicListCacheKey(entries: NodeListApiDynamicEntry[]): string {
  return entries.map((entry) => `${entry.type}:${entry.id}`).join("|");
}

const dynamicListCache = new Map<string, ListApiMappedItem[]>();
const dynamicListInFlight = new Map<string, Promise<ListApiMappedItem[]>>();

async function fetchDynamicListItems(entries: NodeListApiDynamicEntry[]): Promise<ListApiMappedItem[]> {
  if (entries.length === 0) {
    return [];
  }

  const res = await fetch("/api/page-builder/lists/dynamic/resolve", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ entries }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(text || "fetchDynamicListItems failed");
  }

  const data = (await res.json()) as { items?: unknown[] };

  return mapCollectionToListItems(data.items ?? []);
}

export async function fetchDynamicListItemsCached(
  entries: NodeListApiDynamicEntry[]
): Promise<ListApiMappedItem[]> {
  const cacheKey = buildDynamicListCacheKey(entries);

  const cached = dynamicListCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const inFlight = dynamicListInFlight.get(cacheKey);
  if (inFlight) {
    return inFlight;
  }

  const promise = fetchDynamicListItems(entries);
  dynamicListInFlight.set(cacheKey, promise);

  try {
    const mapped = await promise;
    dynamicListCache.set(cacheKey, mapped);
    return mapped;
  } finally {
    dynamicListInFlight.delete(cacheKey);
  }
}
