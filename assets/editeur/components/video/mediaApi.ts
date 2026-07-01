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
    credentials: "include",
  });
}

export async function sendCharismaMediaCompteur(
  mediaId: string,
  fetchImpl: typeof fetch = fetch
): Promise<Response> {
  return fetchImpl(buildCharismaMediaCompteurUrl(mediaId), {
    method: "POST",
    credentials: "include",
  });
}

export async function fetchCharismaMediaFavoriCount(
  mediaId: string,
  fetchImpl: typeof fetch = fetch
): Promise<number> {
  const response = await fetchImpl(buildCharismaMediaItemUrl(mediaId), {
    credentials: "include",
  });
  if (!response.ok) return 0;
  const data = (await response.json()) as unknown;
  return parseFavoriCount(data);
}
