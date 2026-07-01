import { beforeEach, describe, expect, it, vi } from "vitest";
import { setupCharismaMediaCompteur } from "./charismaMediaCompteur";

const { videojsMock, registeredPlugins } = vi.hoisted(() => {
  const registeredPlugins = new Map<string, (options?: { mediaId?: string }) => void>();

  const videojsMock = {
    getPlugin: vi.fn((name: string) => registeredPlugins.get(name)),
    registerPlugin: vi.fn((name: string, plugin: (options?: { mediaId?: string }) => void) => {
      registeredPlugins.set(name, plugin);
    }),
  };

  return { videojsMock, registeredPlugins };
});

vi.mock("video.js", () => ({
  default: videojsMock,
}));

async function loadCompteurPlugin() {
  vi.resetModules();
  registeredPlugins.clear();
  videojsMock.getPlugin.mockImplementation((name: string) => registeredPlugins.get(name));
  const mod = await import("./charismaMediaCompteur");
  mod.registerCharismaMediaCompteurPlugin();
  return mod;
}

describe("registerCharismaMediaCompteurPlugin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("enregistre le plugin charismaMediaCompteur", async () => {
    await loadCompteurPlugin();
    expect(videojsMock.registerPlugin).toHaveBeenCalledWith(
      "charismaMediaCompteur",
      expect.any(Function)
    );
  });

  it("ne réenregistre pas le plugin", async () => {
    const mod = await loadCompteurPlugin();
    videojsMock.registerPlugin.mockClear();
    mod.registerCharismaMediaCompteurPlugin();
    expect(videojsMock.registerPlugin).not.toHaveBeenCalled();
  });

  it("configure le compteur via ready quand mediaId est fourni", async () => {
    await loadCompteurPlugin();
    const plugin = registeredPlugins.get("charismaMediaCompteur");
    expect(plugin).toBeTypeOf("function");

    const on = vi.fn();
    const off = vi.fn();
    const player = {
      ready: (cb: () => void) => cb(),
      on,
      off,
      currentTime: () => 0,
    };

    plugin!.call(player, { mediaId: "159" });
    expect(on).toHaveBeenCalledWith("timeupdate", expect.any(Function));
    expect(on).toHaveBeenCalledWith("dispose", expect.any(Function));
  });

  it("ignore un mediaId vide", async () => {
    await loadCompteurPlugin();
    const plugin = registeredPlugins.get("charismaMediaCompteur");
    const ready = vi.fn();

    plugin!.call({ ready }, { mediaId: "   " });
    expect(ready).not.toHaveBeenCalled();
  });
});

describe("setupCharismaMediaCompteur", () => {
  it("envoie immédiatement si la lecture démarre après le seuil", () => {
    const send = vi.fn().mockResolvedValue(undefined);
    const player = {
      currentTime: () => 5,
      on: vi.fn(),
      off: vi.fn(),
    };

    setupCharismaMediaCompteur(player as never, "159", { send, minPlaybackSec: 1 });

    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledWith("159");
  });

  it("n'envoie pas immédiatement si currentTime est indéfini", () => {
    const send = vi.fn().mockResolvedValue(undefined);
    const player = {
      currentTime: () => undefined,
      on: vi.fn(),
      off: vi.fn(),
    };

    setupCharismaMediaCompteur(player as never, "159", { send, minPlaybackSec: 1 });
    expect(send).not.toHaveBeenCalled();
  });
});
