import { apiRegistry } from "../../ManagerApi/ApiRegistry";
import type { ApiAdapter } from "../../ManagerApi/ApiAdapter";

export interface ListApiMappedItem {
  id: string;
  title: string;
  description?: string;
  image?: string;
  counter?: string | number;
  like?: string | number;
  link?: string;
}

export function mapCollectionToListItems(
  items: unknown[],
  adapter: ApiAdapter
): ListApiMappedItem[] {
  return items.map((item) => {
    const mapped = adapter.mapItem(item);
    return {
      id: mapped.id,
      title: mapped.title,
      description: mapped.description,
      image: mapped.image,
      counter: mapped.counter,
      like: mapped.like,
      link: mapped.link,
    };
  });
}

export async function fetchListApiCollection(apiId: string): Promise<ListApiMappedItem[]> {
  const adapter = apiRegistry.get(apiId);
  if (!adapter) {
    throw new Error("API non trouvée");
  }

  const isFixedCollection = adapter.collectionMode === "fixed";
  const result = await adapter.fetchCollection({
    page: 1,
    limit: isFixedCollection ? 200 : 100,
  });

  return mapCollectionToListItems(result.items ?? [], adapter);
}

type FetchListApiCollectionCachedOptions = {
  page?: number;
  limit?: number;
};

// Cache in-memory (durée de vie: session/page). But: éviter des refetchs
// quand on bascule entre PREVIEW et EDIT (remount du composant).
const listApiCollectionCache = new Map<string, ListApiMappedItem[]>();
const listApiCollectionInFlight = new Map<string, Promise<ListApiMappedItem[]>>();

export async function fetchListApiCollectionCached(
  apiId: string,
  options: FetchListApiCollectionCachedOptions = {}
): Promise<ListApiMappedItem[]> {
  const adapter = apiRegistry.get(apiId);
  if (!adapter) {
    throw new Error("API non trouvée");
  }

  const page = options.page ?? 1;
  const isFixedCollection = adapter.collectionMode === "fixed";
  const limit = options.limit ?? (isFixedCollection ? 200 : 100);

  const cacheKey = `${apiId}::p${page}::l${limit}`;

  const cached = listApiCollectionCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const inFlight = listApiCollectionInFlight.get(cacheKey);
  if (inFlight) {
    return inFlight;
  }

  const promise = (async () => {
    const result = await adapter.fetchCollection({ page, limit });
    return mapCollectionToListItems(result.items ?? [], adapter);
  })();

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
  if (counter == null || counter === "") {
    return "";
  }
  return String(counter);
}

export const formatLikeValue = formatCounterValue;
