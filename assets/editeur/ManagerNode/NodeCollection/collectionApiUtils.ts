export interface CollectionApiSourceMeta {
  id: string;
  label: string;
  type: string;
  supportedModes: string[];
}

export interface CollectionApiMappedItem {
  id: string;
  image?: string;
  title?: string;
  description?: string;
  label?: string;
  labels?: string[];
  counter?: string | number;
  like?: string | number;
  link?: string;
  alt?: string;
  text?: string;
}

export interface CollectionApiPageResponse {
  items: CollectionApiMappedItem[];
  totalItems: number;
  totalPages: number;
  page: number;
  itemsPerPage: number;
}

export interface CollectionApiResolveEntry {
  apiId: string;
  itemId: string;
}

function hasMetricValue(value: unknown): boolean {
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

function normalizeMetric(value: unknown): string | number | undefined {
  if (!hasMetricValue(value)) {
    return undefined;
  }
  if (typeof value === "number" || typeof value === "string") {
    return value;
  }
  return String(value);
}

export function mapRawToCollectionApiItem(raw: unknown): CollectionApiMappedItem {
  const o = (raw ?? {}) as Record<string, unknown>;
  const labels = Array.isArray(o.labels)
    ? o.labels.map((v) => String(v)).filter((v) => v !== "")
    : undefined;

  return {
    id: String(o.id ?? ""),
    image: o.image != null && String(o.image) !== "" ? String(o.image) : undefined,
    title: o.title != null && String(o.title) !== "" ? String(o.title) : undefined,
    description: o.description != null ? String(o.description) : undefined,
    label: o.label != null && String(o.label) !== "" ? String(o.label) : undefined,
    labels: labels && labels.length > 0 ? labels : undefined,
    counter: normalizeMetric(o.counter),
    like: normalizeMetric(o.like),
    link: o.link != null && String(o.link) !== "" ? String(o.link) : undefined,
    alt: o.alt != null && String(o.alt) !== "" ? String(o.alt) : undefined,
    text: o.text != null && String(o.text) !== "" ? String(o.text) : undefined,
  };
}

function buildCatalogUrl(type?: string, mode?: string): string {
  const params = new URLSearchParams();
  if (type) params.set("type", type);
  if (mode) params.set("mode", mode);
  const qs = params.toString();
  return qs ? `/api/page-builder/collections?${qs}` : "/api/page-builder/collections";
}

function buildItemsUrl(
  apiId: string,
  page: number,
  itemsPerPage: number,
  search?: string,
  category?: string
): string {
  const params = new URLSearchParams({
    page: String(page),
    itemsPerPage: String(itemsPerPage),
  });
  if (search && search.trim() !== "") {
    params.set("search", search.trim());
  }
  if (category && category.trim() !== "") {
    params.set("category", category.trim());
  }
  return `/api/page-builder/collections/${encodeURIComponent(apiId)}/items?${params.toString()}`;
}

const catalogCache = new Map<string, CollectionApiSourceMeta[]>();
const catalogInFlight = new Map<string, Promise<CollectionApiSourceMeta[]>>();

const itemsCache = new Map<string, CollectionApiPageResponse>();
const itemsInFlight = new Map<string, Promise<CollectionApiPageResponse>>();

const resolveCache = new Map<string, CollectionApiMappedItem[]>();
const resolveInFlight = new Map<string, Promise<CollectionApiMappedItem[]>>();

export async function fetchCollectionCatalog(
  type?: string,
  mode?: string,
  options?: { bypassCache?: boolean }
): Promise<CollectionApiSourceMeta[]> {
  const key = `${type ?? ""}:${mode ?? ""}`;
  if (!options?.bypassCache) {
    const cached = catalogCache.get(key);
    if (cached) return cached;

    const inflight = catalogInFlight.get(key);
    if (inflight) return inflight;
  }

  const promise = (async () => {
    const res = await fetch(buildCatalogUrl(type, mode), {
      credentials: "same-origin",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`Catalogue collections HTTP ${res.status}`);
    }
    const data = (await res.json()) as { items?: CollectionApiSourceMeta[] };
    const items = (data.items ?? []).map((i) => ({
      id: String(i.id),
      label: String(i.label ?? i.id),
      type: String(i.type ?? ""),
      supportedModes: Array.isArray(i.supportedModes) ? i.supportedModes.map(String) : [],
    }));
    catalogCache.set(key, items);
    return items;
  })();

  if (!options?.bypassCache) {
    catalogInFlight.set(key, promise);
  }
  try {
    return await promise;
  } finally {
    catalogInFlight.delete(key);
  }
}

export async function fetchCollectionItemsPage(
  apiId: string,
  page = 1,
  itemsPerPage = 10,
  search?: string,
  category?: string
): Promise<CollectionApiPageResponse> {
  const safePage = Math.max(1, page);
  const safeSize = Math.max(1, Math.min(100, itemsPerPage));
  const searchKey = search?.trim() || "";
  const categoryKey = category?.trim() || "";
  const key = `${apiId}:${safePage}:${safeSize}:${searchKey}:${categoryKey}`;

  const cached = itemsCache.get(key);
  if (cached) return cached;

  const inflight = itemsInFlight.get(key);
  if (inflight) return inflight;

  const promise = (async () => {
    const res = await fetch(
      buildItemsUrl(apiId, safePage, safeSize, searchKey || undefined, categoryKey || undefined),
      {
        credentials: "same-origin",
        headers: { Accept: "application/json" },
      }
    );
    if (!res.ok) {
      throw new Error(`Collections items HTTP ${res.status}`);
    }
    const data = (await res.json()) as {
      items?: unknown[];
      totalItems?: number;
      totalPages?: number;
      page?: number;
      itemsPerPage?: number;
    };
    const response: CollectionApiPageResponse = {
      items: (data.items ?? []).map(mapRawToCollectionApiItem),
      totalItems: Number(data.totalItems ?? 0),
      totalPages: Number(data.totalPages ?? 0),
      page: Number(data.page ?? safePage),
      itemsPerPage: Number(data.itemsPerPage ?? safeSize),
    };
    itemsCache.set(key, response);
    return response;
  })();

  itemsInFlight.set(key, promise);
  try {
    return await promise;
  } finally {
    itemsInFlight.delete(key);
  }
}

export async function fetchCollectionCategories(
  apiId: string
): Promise<Array<{ id: string; label: string }>> {
  const res = await fetch(
    `/api/page-builder/collections/${encodeURIComponent(apiId)}/categories`,
    {
      credentials: "same-origin",
      headers: { Accept: "application/json" },
      cache: "no-store",
    }
  );
  if (!res.ok) {
    return [];
  }
  const data = (await res.json()) as unknown;
  if (Array.isArray(data)) {
    return data
      .filter((c): c is { id: string; label: string } => c != null && typeof c === "object")
      .map((c) => ({ id: String((c as { id?: unknown }).id ?? ""), label: String((c as { label?: unknown }).label ?? "") }))
      .filter((c) => c.id !== "" && c.label !== "");
  }
  if (data != null && typeof data === "object" && Array.isArray((data as { categories?: unknown }).categories)) {
    const cats = (data as { categories: unknown[] }).categories;
    return cats
      .filter((c): c is { id: string; label: string } => c != null && typeof c === "object")
      .map((c) => ({ id: String((c as { id?: unknown }).id ?? ""), label: String((c as { label?: unknown }).label ?? "") }))
      .filter((c) => c.id !== "" && c.label !== "");
  }
  return [];
}

export async function resolveCollectionEntries(
  entries: CollectionApiResolveEntry[]
): Promise<CollectionApiMappedItem[]> {
  // Normalise ids en string : le JSON legacy peut stocker itemId en number.
  const normalizedEntries = entries
    .map((entry) => ({
      apiId: String(entry.apiId ?? "").trim(),
      itemId: String(entry.itemId ?? "").trim(),
    }))
    .filter((entry) => entry.apiId !== "" && entry.itemId !== "");

  if (normalizedEntries.length === 0) {
    return [];
  }

  const key = JSON.stringify(normalizedEntries);
  const cached = resolveCache.get(key);
  if (cached) return cached;

  const inflight = resolveInFlight.get(key);
  if (inflight) return inflight;

  const promise = (async () => {
    const res = await fetch("/api/page-builder/collections/resolve", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ entries: normalizedEntries }),
    });
    if (!res.ok) {
      throw new Error(`Collections resolve HTTP ${res.status}`);
    }
    const data = (await res.json()) as { items?: unknown[] };
    const items = (data.items ?? []).map(mapRawToCollectionApiItem);
    resolveCache.set(key, items);
    return items;
  })();

  resolveInFlight.set(key, promise);
  try {
    return await promise;
  } finally {
    resolveInFlight.delete(key);
  }
}

/** @internal tests */
export function __clearCollectionApiCaches(): void {
  catalogCache.clear();
  catalogInFlight.clear();
  itemsCache.clear();
  itemsInFlight.clear();
  resolveCache.clear();
  resolveInFlight.clear();
}
