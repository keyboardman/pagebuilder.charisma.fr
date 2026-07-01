import { describe, expect, it, vi, beforeEach } from "vitest";

const { videojsMock } = vi.hoisted(() => ({
  videojsMock: vi.fn(),
}));

vi.mock("video.js", () => ({
  default: videojsMock,
}));

vi.mock("./registerCharismaVideoPlugins", () => ({
  registerCharismaVideoPlugins: vi.fn(),
}));

vi.mock("./controlBarChildren", () => ({
  buildControlBarChildrenWithFavori: vi.fn(() => ["playToggle", "CharismaFavoriButton"]),
}));

import { createCharismaVideoPlayer, disposeCharismaVideoPlayer } from "./createCharismaVideoPlayer";

describe("createCharismaVideoPlayer", () => {
  beforeEach(() => {
    videojsMock.mockReset();
    videojsMock.mockReturnValue({ isDisposed: () => false });
  });

  it("passe le plugin compteur sous options.plugins (requis par Video.js)", () => {
    const element = document.createElement("video");

    createCharismaVideoPlayer(element, {
      src: "https://example.com/video.mp4",
      mediaId: "159",
      favoriCount: 1027,
    });

    expect(videojsMock).toHaveBeenCalledTimes(1);
    const [, options] = videojsMock.mock.calls[0] as [HTMLElement, Record<string, unknown>];

    expect(options.plugins).toEqual({
      charismaMediaCompteur: { mediaId: "159" },
    });
    expect(options).not.toHaveProperty("charismaMediaCompteur");
  });

  it("n'ajoute pas le plugin compteur sans mediaId", () => {
    const element = document.createElement("video");

    createCharismaVideoPlayer(element, {
      src: "https://example.com/video.mp4",
    });

    const [, options] = videojsMock.mock.calls[0] as [HTMLElement, Record<string, unknown>];
    expect(options.plugins).toBeUndefined();
  });
});

describe("disposeCharismaVideoPlayer", () => {
  it("dispose le player actif", () => {
    const dispose = vi.fn();
    const player = { isDisposed: () => false, dispose } as never;

    disposeCharismaVideoPlayer(player);

    expect(dispose).toHaveBeenCalled();
  });

  it("ignore null ou player déjà disposé", () => {
    const dispose = vi.fn();
    disposeCharismaVideoPlayer(null);
    disposeCharismaVideoPlayer({ isDisposed: () => true, dispose } as never);
    expect(dispose).not.toHaveBeenCalled();
  });
});
