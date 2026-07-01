import {
  CHARISMA_MEDIA_COMPTEUR_URL,
  CHARISMA_MEDIA_FAVORI_URL,
  CHARISMA_MEDIA_ITEM_URL,
} from "./constants";
import { parseFavoriCount } from "./favoriCount";

export function buildCharismaMediaItemUrl(mediaId: string): string {
  return CHARISMA_MEDIA_ITEM_URL.replace("{id}", encodeURIComponent(mediaId));
}

export function buildCharismaMediaFavoriUrl(mediaId: string): string {
  return CHARISMA_MEDIA_FAVORI_URL.replace("{id}", encodeURIComponent(mediaId));
}

export function buildCharismaMediaCompteurUrl(mediaId: string): string {
  return CHARISMA_MEDIA_COMPTEUR_URL.replace("{id}", encodeURIComponent(mediaId));
}

export async function sendCharismaMediaFavori(
  mediaId: string,
  fetchImpl: typeof fetch = fetch
): Promise<Response> {
  return fetchImpl(buildCharismaMediaFavoriUrl(mediaId), {
    method: "PUT",
    mode: "cors",
    credentials: "include",
  });
}

export async function sendCharismaMediaCompteur(
  mediaId: string,
  fetchImpl: typeof fetch = fetch
): Promise<Response> {
  return fetchImpl(buildCharismaMediaCompteurUrl(mediaId), {
    method: "PUT",
    mode: "cors",
    credentials: "include",
  });
}

export interface FetchCharismaMediaFavoriCountOptions {
  fetchImpl?: typeof fetch;
  /** Base API page-builder (proxy same-origin, fiable en prod). */
  apiCardsBaseUrl?: string | null;
  apiId?: string;
}

async function fetchCharismaMediaFavoriCountViaProxy(
  mediaId: string,
  options: { apiCardsBaseUrl: string; apiId: string } &
    Pick<FetchCharismaMediaFavoriCountOptions, "fetchImpl">
): Promise<number | null> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const base = options.apiCardsBaseUrl.replace(/\/$/, "");

  try {
    const response = await fetchImpl(
      `${base}/cards/${encodeURIComponent(options.apiId)}/items/${encodeURIComponent(mediaId)}`,
      {
        credentials: "same-origin",
        headers: { Accept: "application/json" },
      }
    );
    if (!response.ok) return null;
    const data = (await response.json()) as unknown;
    if (!data || typeof data !== "object") return null;
    const record = data as Record<string, unknown>;
    return parseFavoriCount(record.raw ?? data);
  } catch {
    return null;
  }
}

async function fetchCharismaMediaFavoriCountDirect(
  mediaId: string,
  fetchImpl: typeof fetch = fetch
): Promise<number> {
  try {
    const response = await fetchImpl(buildCharismaMediaItemUrl(mediaId), {
      mode: "cors",
      // Lecture publique : sans credentials (ACAO:* côté content.charisma.fr).
    });
    if (!response.ok) return 0;
    const data = (await response.json()) as unknown;
    return parseFavoriCount(data);
  } catch {
    return 0;
  }
}

export async function fetchCharismaMediaFavoriCount(
  mediaId: string,
  fetchImplOrOptions: typeof fetch | FetchCharismaMediaFavoriCountOptions = fetch
): Promise<number> {
  const options =
    typeof fetchImplOrOptions === "function"
      ? { fetchImpl: fetchImplOrOptions }
      : fetchImplOrOptions;
  const fetchImpl = options.fetchImpl ?? fetch;

  if (options.apiCardsBaseUrl && options.apiId) {
    const proxied = await fetchCharismaMediaFavoriCountViaProxy(mediaId, {
      apiCardsBaseUrl: options.apiCardsBaseUrl,
      apiId: options.apiId,
      fetchImpl,
    });
    if (proxied !== null) return proxied;
  }

  return fetchCharismaMediaFavoriCountDirect(mediaId, fetchImpl);
}
