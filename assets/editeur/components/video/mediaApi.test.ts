import { describe, expect, it, vi } from "vitest";
import {
  buildCharismaMediaCompteurUrl,
  buildCharismaMediaFavoriUrl,
  buildCharismaMediaItemUrl,
  fetchCharismaMediaFavoriCount,
  sendCharismaMediaCompteur,
  sendCharismaMediaFavori,
} from "./mediaApi";
import {
  CHARISMA_FAVORI_COOLDOWN_MS,
  CHARISMA_MEDIA_COMPTEUR_URL,
  CHARISMA_MEDIA_FAVORI_URL,
  CHARISMA_MEDIA_ITEM_URL,
} from "./constants";

describe("mediaApi", () => {
  it("construit les URLs favori et compteur", () => {
    expect(buildCharismaMediaFavoriUrl("abc/123")).toBe(
      `${CHARISMA_MEDIA_FAVORI_URL.replace("{id}", "abc%2F123")}`
    );
    expect(buildCharismaMediaCompteurUrl("xyz")).toBe(
      CHARISMA_MEDIA_COMPTEUR_URL.replace("{id}", "xyz")
    );
    expect(buildCharismaMediaItemUrl("159")).toBe(
      CHARISMA_MEDIA_ITEM_URL.replace("{id}", "159")
    );
  });

  it("envoie favori et compteur en POST/PUT", async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: true });

    await sendCharismaMediaFavori("159", fetchImpl);
    await sendCharismaMediaCompteur("159", fetchImpl);

    expect(fetchImpl).toHaveBeenNthCalledWith(
      1,
      buildCharismaMediaFavoriUrl("159"),
      { method: "PUT", credentials: "include" }
    );
    expect(fetchImpl).toHaveBeenNthCalledWith(
      2,
      buildCharismaMediaCompteurUrl("159"),
      { method: "POST", credentials: "include" }
    );
  });

  it("récupère le compteur favori depuis l'API item", async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ favori: 1027 }),
    });

    await expect(fetchCharismaMediaFavoriCount("159", fetchImpl)).resolves.toBe(1027);
    expect(fetchImpl).toHaveBeenCalledWith(buildCharismaMediaItemUrl("159"), {
      credentials: "include",
    });
  });

  it("retourne 0 si la réponse item est en erreur", async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: false });
    await expect(fetchCharismaMediaFavoriCount("159", fetchImpl)).resolves.toBe(0);
  });
});

describe("constants", () => {
  it("définit un cooldown favori d'une heure", () => {
    expect(CHARISMA_FAVORI_COOLDOWN_MS).toBe(60 * 60 * 1000);
  });
});
