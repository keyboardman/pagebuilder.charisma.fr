import { CHARISMA_FAVORI_COOLDOWN_MS, CHARISMA_FAVORI_STORAGE_PREFIX } from "./constants";

export function getFavoriCooldownKey(mediaId: string): string {
  return `${CHARISMA_FAVORI_STORAGE_PREFIX}${mediaId}`;
}

export function getFavoriCooldownRemainingMs(
  mediaId: string,
  storage: Pick<Storage, "getItem"> = localStorage,
  now = Date.now()
): number {
  const raw = storage.getItem(getFavoriCooldownKey(mediaId));
  if (!raw) return 0;

  const until = Number(raw);
  if (!Number.isFinite(until)) return 0;

  return Math.max(0, until - now);
}

export function isFavoriOnCooldown(
  mediaId: string,
  storage: Pick<Storage, "getItem"> = localStorage,
  now = Date.now()
): boolean {
  return getFavoriCooldownRemainingMs(mediaId, storage, now) > 0;
}

export function setFavoriCooldown(
  mediaId: string,
  storage: Pick<Storage, "setItem"> = localStorage,
  now = Date.now(),
  cooldownMs = CHARISMA_FAVORI_COOLDOWN_MS
): void {
  storage.setItem(getFavoriCooldownKey(mediaId), String(now + cooldownMs));
}
