export interface ListApiMappedItem {
  id: string;
  title: string;
  description?: string;
  counter?: string | number;
  like?: string | number;
  link?: string;
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

export function mapCollectionToListItems(
  items: unknown[]
): ListApiMappedItem[] {
  return items.map((item) => {
    const o = item as Partial<ListApiMappedItem> & { id?: unknown; title?: unknown };

    // Le backend `/page-builder/lists/{apiId}/items` renvoie les items déjà mappés
    // au contrat standard (id, title, description, counter, like, link, raw…).
    // On évite donc de re-mapper côté frontend.
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

// Cache in-memory (durée de vie: session/page). But: éviter des refetchs
// quand on bascule entre PREVIEW et EDIT (remount du composant).
const listApiCollectionCache = new Map<string, ListApiMappedItem[]>();
const listApiCollectionInFlight = new Map<string, Promise<ListApiMappedItem[]>>();

async function fetchListItems(apiId: string): Promise<ListApiMappedItem[]> {
  const res = await fetch(
    `/api/page-builder/lists/${encodeURIComponent(apiId)}/items`,
    {
      credentials: "same-origin",
      headers: { Accept: "application/json" },
    }
  );

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(text || "fetchListItems failed");
  }

  const data = (await res.json()) as { items: unknown[] };
  return mapCollectionToListItems(data.items ?? []);
}

export async function fetchListApiCollectionCached(apiId: string): Promise<ListApiMappedItem[]> {
  const cacheKey = apiId;

  const cached = listApiCollectionCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const inFlight = listApiCollectionInFlight.get(cacheKey);
  if (inFlight) {
    return inFlight;
  }

  const promise = fetchListItems(apiId);

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
