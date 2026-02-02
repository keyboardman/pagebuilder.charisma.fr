import type { ApiAdapter } from "./ApiAdapter";

export interface BackendApiMeta {
  id: string;
  label: string;
  type: string;
  category?: string | null;
}

/**
 * Crée un ApiAdapter qui délègue à l’API Symfony (endpoints page-builder/api).
 * Les réponses serveur sont déjà au format mappé (id, title, description, etc.).
 */
export function createBackendApiAdapter(meta: BackendApiMeta, baseUrl: string): ApiAdapter {
  const base = baseUrl.replace(/\/$/, "");
  return {
    id: meta.id,
    label: meta.label,
    type: meta.type as "article" | "video" | "image",
    category: meta.category ?? undefined,
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
      const res = await fetch(`${base}/cards/${encodeURIComponent(meta.id)}/items?${q.toString()}`);
      if (!res.ok) {
        const text = await res.text().catch(() => res.statusText);
        throw new Error(text || "fetchCollection failed");
      }
      const data = (await res.json()) as { items: unknown[]; total: number };
      return { items: data.items ?? [], total: data.total ?? 0 };
    },

    async fetchItem(id: string) {
      const res = await fetch(
        `${base}/cards/${encodeURIComponent(meta.id)}/items/${encodeURIComponent(id)}`
      );
      if (!res.ok) {
        const text = await res.text().catch(() => res.statusText);
        throw new Error(text || "fetchItem failed");
      }
      return (await res.json()) as Record<string, unknown>;
    },

    mapItem(item: unknown) {
      const o = item as Record<string, unknown>;
      return {
        id: String(o?.id ?? ""),
        title: String(o?.title ?? ""),
        description: o?.description != null ? String(o.description) : undefined,
        image: o?.image != null ? String(o.image) : undefined,
        labels: Array.isArray(o?.labels) ? (o.labels as string[]) : undefined,
        link: o?.link != null ? String(o.link) : undefined,
        text: o?.text != null ? String(o.text) : undefined,
        raw: item,
      };
    },

    async fetchCategories(): Promise<Array<{ id: string; label: string }>> {
      const res = await fetch(`${base}/cards/${encodeURIComponent(meta.id)}/categories`);
      if (!res.ok) return [];
      const data = (await res.json()) as Array<{ id: string; label: string }>;
      return Array.isArray(data) ? data : [];
    },
  };
}

/**
 * Récupère la liste des APIs depuis le backend et les enregistre dans le registre.
 */
export async function registerBackendApis(
  baseUrl: string,
  register: (adapter: ApiAdapter) => void
): Promise<void> {
  const base = baseUrl.replace(/\/$/, "");
  const res = await fetch(`${base}/cards`);
  if (!res.ok) return;
  const list = (await res.json()) as BackendApiMeta[];
  if (!Array.isArray(list)) return;
  for (const meta of list) {
    if (meta?.id && meta?.label && meta?.type) {
      register(createBackendApiAdapter(meta, baseUrl));
    }
  }
}
