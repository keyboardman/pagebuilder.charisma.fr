export type FontPayload = {
  id: number;
  name: string;
  href: string;
  fontFamily: string;
  type: string;
};

export type FontListResponse = {
  items: FontPayload[];
  total: number;
};

const normalizeBase = (baseUrl: string) => baseUrl.replace(/\/$/, "");

export type FetchFontsParams = {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  excludeNative?: boolean;
  excludeIds?: number[];
};

export async function fetchFonts(
  baseUrl: string,
  params: FetchFontsParams = {}
): Promise<FontListResponse> {
  const q = new URLSearchParams();
  q.set("page", String(params.page ?? 1));
  q.set("limit", String(params.limit ?? 20));
  if (params.search?.trim()) q.set("search", params.search.trim());
  if (params.type?.trim()) q.set("type", params.type.trim());
  if (params.excludeNative !== false) q.set("excludeNative", "1");
  if (params.excludeIds?.length) {
    q.set("excludeIds", params.excludeIds.join(","));
  }

  const res = await fetch(`${normalizeBase(baseUrl)}/fonts?${q.toString()}`, {
    credentials: "same-origin",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(text || "fetchFonts failed");
  }
  return (await res.json()) as FontListResponse;
}

const resolveCache = new Map<string, FontPayload | null>();

export async function resolveFontFamily(
  baseUrl: string,
  fontFamily: string,
  options: { excludeIds?: number[] } = {}
): Promise<FontPayload | null> {
  const key = fontFamily.trim();
  if (!key) return null;
  const cacheKey = `${key}|${(options.excludeIds ?? []).join(",")}`;
  if (resolveCache.has(cacheKey)) {
    return resolveCache.get(cacheKey) ?? null;
  }

  const q = new URLSearchParams({ family: key });
  if (options.excludeIds?.length) {
    q.set("excludeIds", options.excludeIds.join(","));
  }
  const res = await fetch(`${normalizeBase(baseUrl)}/fonts/resolve?${q.toString()}`, {
    credentials: "same-origin",
    headers: { Accept: "application/json" },
  });
  if (res.status === 404 || res.status === 204) {
    resolveCache.set(cacheKey, null);
    return null;
  }
  if (!res.ok) {
    return null;
  }
  const payload = (await res.json()) as FontPayload | null;
  if (!payload || typeof payload.id !== "number") {
    resolveCache.set(cacheKey, null);
    return null;
  }
  resolveCache.set(cacheKey, payload);
  return payload;
}
