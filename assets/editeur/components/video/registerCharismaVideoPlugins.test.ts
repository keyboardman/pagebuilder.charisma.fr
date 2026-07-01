import { beforeEach, describe, expect, it, vi } from "vitest";

const registerFavori = vi.fn();
const registerCompteur = vi.fn();

vi.mock("./charismaFavoriButton", () => ({
  registerCharismaFavoriButtonPlugin: registerFavori,
}));

vi.mock("./charismaMediaCompteur", () => ({
  registerCharismaMediaCompteurPlugin: registerCompteur,
}));

describe("registerCharismaVideoPlugins", () => {
  beforeEach(() => {
    vi.resetModules();
    registerFavori.mockClear();
    registerCompteur.mockClear();
  });

  it("enregistre favori et compteur une seule fois", async () => {
    const { registerCharismaVideoPlugins } = await import("./registerCharismaVideoPlugins");

    registerCharismaVideoPlugins();
    registerCharismaVideoPlugins();

    expect(registerFavori).toHaveBeenCalledTimes(1);
    expect(registerCompteur).toHaveBeenCalledTimes(1);
  });
});
