import { describe, expect, it, vi } from "vitest";
import { CHARISMA_FAVORI_COOLDOWN_MS } from "./constants";
import {
  getFavoriCooldownRemainingMs,
  isFavoriOnCooldown,
  setFavoriCooldown,
} from "./favoriStorage";

describe("favoriStorage", () => {
  it("retourne 0 lorsqu'aucun cooldown n'est enregistré", () => {
    const storage = { getItem: vi.fn(() => null), setItem: vi.fn() };
    expect(getFavoriCooldownRemainingMs("media-1", storage, 1_000)).toBe(0);
    expect(isFavoriOnCooldown("media-1", storage, 1_000)).toBe(false);
  });

  it("détecte un cooldown actif pendant une heure", () => {
    const now = 1_000_000;
    const storage = {
      getItem: vi.fn(() => String(now + 1_000)),
      setItem: vi.fn(),
    };

    expect(isFavoriOnCooldown("media-1", storage, now)).toBe(true);
    expect(getFavoriCooldownRemainingMs("media-1", storage, now)).toBe(1_000);
  });

  it("enregistre un cooldown d'une heure par mediaId", () => {
    const storage = { getItem: vi.fn(), setItem: vi.fn() };
    const now = 5_000;

    setFavoriCooldown("media-42", storage, now);

    expect(storage.setItem).toHaveBeenCalledWith(
      "charisma-favori:media-42",
      String(now + CHARISMA_FAVORI_COOLDOWN_MS)
    );
  });

  it("ignore une valeur de cooldown invalide", () => {
    const storage = {
      getItem: vi.fn(() => "not-a-number"),
      setItem: vi.fn(),
    };

    expect(getFavoriCooldownRemainingMs("media-1", storage, 1_000)).toBe(0);
    expect(isFavoriOnCooldown("media-1", storage, 1_000)).toBe(false);
  });
});
