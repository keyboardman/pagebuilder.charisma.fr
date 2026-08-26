import type { ApiAdapter } from "./ApiAdapter";
import { resolvePageBuilderApiBaseUrl } from "./pageBuilderApiBase";

export interface BackendApiMeta {
  id: string;
  label: string;
  type: string;
  category?: string | null;
  collectionMode?: "normal" | "fixed";
}

/**
 * Crée un ApiAdapter qui délègue à l’API Symfony (endpoints API Platform /api/page-builder).
 * Les réponses serveur sont déjà au format mappé (id, title, description, etc.).
 */
export function createBackendApiAdapter(meta: BackendApiMeta, baseUrl: string): ApiAdapter {
  const base = baseUrl.replace(/\/$/, "");
  const fetchJson = async (url: string) =>
    fetch(url, {
      credentials: "same-origin",
      headers: { Accept: "application/json" },
    });
  return {
    id: meta.id,
    label: meta.label,
    type: meta.type as "article" | "video" | "image" | "list",
    category: meta.category ?? undefined,
    collectionMode: meta.collectionMode ?? "normal",
    categoryQueryParam: "category",

    async fetchCollection(params: {
      page: number;
      limit: number;
      search?: string;
      sort?: string;
      category?: string;
      [key: string]: string | number | undefined;
    }) {
      const q = new URLSearchParams();
      q.set("page", String(params.page));
      q.set("limit", String(params.limit));
      if (params.search != null && params.search !== "") q.set("search", String(params.search));
      if (params.sort != null && params.sort !== "") q.set("sort", String(params.sort));
      if (params.category != null && params.category !== "") q.set("category", String(params.category));
      const res = await fetchJson(`${base}/cards/${encodeURIComponent(meta.id)}/items?${q.toString()}`);
      if (!res.ok) {
        const text = await res.text().catch(() => res.statusText);
        throw new Error(text || "fetchCollection failed");
      }
      const data = (await res.json()) as { items: unknown[]; total: number };
      return { items: data.items ?? [], total: data.total ?? 0 };
    },

    async fetchItem(id: string) {
      const res = await fetchJson(
        `${base}/cards/${encodeURIComponent(meta.id)}/items/${encodeURIComponent(id)}`
      );
      if (!res.ok) {
        const text = await res.text().catch(() => res.statusText);
        throw new Error(text || "fetchItem failed");
      }
      return (await res.json()) as Record<string, unknown>;
    },

    mapItem: mapBackendCardItem,

    async fetchCategories(): Promise<Array<{ id: string; label: string }>> {
      const res = await fetchJson(`${base}/cards/${encodeURIComponent(meta.id)}/categories`);
      if (!res.ok) return [];
      const data = (await res.json()) as unknown;
      return parseJsonCollection<{ id: string; label: string }>(data);
    },
  };
}

export function mapBackendCardItem(item: unknown) {
  const o = item as Record<string, unknown>;
  const nestedRaw = o?.raw;
  const raw =
    nestedRaw != null && typeof nestedRaw === "object"
      ? nestedRaw
      : item;
  const rawRecord =
    raw != null && typeof raw === "object"
      ? (raw as Record<string, unknown>)
      : undefined;
  const counterSource =
    o?.counter ?? rawRecord?.vues ?? rawRecord?.views;
  const likeSource =
    o?.like ?? rawRecord?.likes ?? rawRecord?.favoris ?? rawRecord?.favori;

  return {
    id: String(o?.id ?? ""),
    title: String(o?.title ?? ""),
    description: o?.description != null ? String(o.description) : undefined,
    image: o?.image != null ? String(o.image) : undefined,
    labels: Array.isArray(o?.labels) ? (o.labels as string[]) : undefined,
    link: o?.link != null ? String(o.link) : undefined,
    text: o?.text != null ? String(o.text) : undefined,
    counter:
      counterSource != null && counterSource !== ""
        ? typeof counterSource === "number"
          ? counterSource
          : String(counterSource)
        : undefined,
    like:
      likeSource != null && likeSource !== ""
        ? typeof likeSource === "number"
          ? likeSource
          : String(likeSource)
        : undefined,
    raw,
  };
}

export function resolveApiCardsBaseUrl(): string {
  return resolvePageBuilderApiBaseUrl();
}

const cardItemCache = new Map<string, Record<string, unknown>>();
const cardItemInFlight = new Map<string, Promise<Record<string, unknown>>>();

export async function fetchCardItemHttp(
  apiId: string,
  itemId: string,
  baseUrl = resolveApiCardsBaseUrl()
): Promise<Record<string, unknown>> {
  const base = baseUrl.replace(/\/$/, "");
  const cacheKey = `${base}:${apiId}:${itemId}`;

  const cached = cardItemCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const inFlight = cardItemInFlight.get(cacheKey);
  if (inFlight) {
    return inFlight;
  }

  const promise = (async () => {
    const res = await fetch(
      `${base}/cards/${encodeURIComponent(apiId)}/items/${encodeURIComponent(itemId)}`,
      {
        credentials: "same-origin",
        headers: { Accept: "application/json" },
      }
    );
    if (!res.ok) {
      const text = await res.text().catch(() => res.statusText);
      throw new Error(text || "fetchCardItemHttp failed");
    }
    return (await res.json()) as Record<string, unknown>;
  })();

  cardItemInFlight.set(cacheKey, promise);

  try {
    const data = await promise;
    cardItemCache.set(cacheKey, data);
    return data;
  } finally {
    cardItemInFlight.delete(cacheKey);
  }
}

/**
 * Récupère la liste des APIs depuis le backend et les enregistre dans le registre.
 */
export async function registerBackendApis(
  baseUrl: string,
  register: (adapter: ApiAdapter) => void
): Promise<void> {
  const base = baseUrl.replace(/\/$/, "");
  const res = await fetch(`${base}/cards`, {
    credentials: "same-origin",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return;
  const list = parseJsonCollection<BackendApiMeta>(await res.json());
  for (const meta of list) {
    if (meta?.id && meta?.label && meta?.type) {
      register(createBackendApiAdapter(meta, baseUrl));
    }
  }
}

function parseJsonCollection<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    if (Array.isArray(record.member)) return record.member as T[];
    if (Array.isArray(record["hydra:member"])) return record["hydra:member"] as T[];
  }
  return [];
}
