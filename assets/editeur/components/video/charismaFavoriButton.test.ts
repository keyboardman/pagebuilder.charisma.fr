import { beforeEach, describe, expect, it, vi } from "vitest";

class MockButtonBase {
  controlTextValue = "";
  classes: string[] = [];
  el_ = document.createElement("button");

  controlText(value?: string) {
    if (value !== undefined) this.controlTextValue = value;
    return this.controlTextValue;
  }

  addClass(value: string) {
    this.classes.push(value);
  }

  el() {
    return this.el_;
  }

  buildCSSClass() {
    return "vjs-button";
  }
}

const { videojsMock, getRegisteredComponent } = vi.hoisted(() => {
  let registered: (new (
    player: unknown,
    options: Record<string, unknown>
  ) => MockButtonBase & {
    mediaId: string;
    favoriCount: number;
    favoriDisabled: boolean;
    handleClick: () => void;
  }) | undefined;

  const videojsMock = {
    getComponent: vi.fn((name: string) => {
      if (name === "Button") return MockButtonBase;
      if (name === "CharismaFavoriButton") return registered;
      return undefined;
    }),
    registerComponent: vi.fn((_name: string, component: typeof registered) => {
      registered = component;
    }),
  };

  return {
    videojsMock,
    getRegisteredComponent: () => registered,
  };
});

vi.mock("video.js", () => ({
  default: videojsMock,
}));

vi.mock("./mediaApi", () => ({
  sendCharismaMediaFavori: vi.fn(),
}));

vi.mock("./favoriStorage", () => ({
  isFavoriOnCooldown: vi.fn(() => false),
  setFavoriCooldown: vi.fn(),
}));

vi.mock("./heartIcon", () => ({
  renderCharismaFavoriHeart: vi.fn((count: number) => `<span>${count}</span>`),
}));

import { sendCharismaMediaFavori } from "./mediaApi";
import { isFavoriOnCooldown, setFavoriCooldown } from "./favoriStorage";

async function loadPlugin() {
  vi.resetModules();
  const mod = await import("./charismaFavoriButton");
  mod.registerCharismaFavoriButtonPlugin();
  return mod;
}

function createButton(options: Record<string, unknown> = { mediaId: "159", favoriCount: 10 }) {
  const Component = getRegisteredComponent();
  if (!Component) throw new Error("CharismaFavoriButton not registered");
  return new Component({}, options);
}

describe("registerCharismaFavoriButtonPlugin", () => {
  beforeEach(() => {
    vi.mocked(isFavoriOnCooldown).mockReturnValue(false);
    vi.mocked(sendCharismaMediaFavori).mockResolvedValue({ ok: true } as Response);
    videojsMock.registerComponent.mockClear();
    videojsMock.getComponent.mockImplementation((name: string) => {
      if (name === "Button") return MockButtonBase;
      if (name === "CharismaFavoriButton") return getRegisteredComponent();
      return undefined;
    });
  });

  it("enregistre le composant CharismaFavoriButton", async () => {
    await loadPlugin();
    expect(videojsMock.registerComponent).toHaveBeenCalledWith(
      "CharismaFavoriButton",
      expect.any(Function)
    );
  });

  it("ne réenregistre pas si le composant existe déjà", async () => {
    videojsMock.getComponent.mockImplementation((name: string) => {
      if (name === "CharismaFavoriButton") return function Existing() {};
      if (name === "Button") return MockButtonBase;
      return undefined;
    });

    await loadPlugin();
    expect(videojsMock.registerComponent).not.toHaveBeenCalled();
  });

  it("ignore l'enregistrement si Button est absent", async () => {
    videojsMock.getComponent.mockReturnValue(undefined);
    await loadPlugin();
    expect(videojsMock.registerComponent).not.toHaveBeenCalled();
  });

  it("ne réenregistre pas lors d'un second appel module", async () => {
    const mod = await loadPlugin();
    videojsMock.registerComponent.mockClear();
    mod.registerCharismaFavoriButtonPlugin();
    expect(videojsMock.registerComponent).not.toHaveBeenCalled();
  });
});

describe("CharismaFavoriButton", () => {
  beforeEach(async () => {
    vi.mocked(isFavoriOnCooldown).mockReturnValue(false);
    vi.mocked(sendCharismaMediaFavori).mockResolvedValue({ ok: true } as Response);
    await loadPlugin();
  });

  it("affiche le compteur et désactive si cooldown actif", () => {
    vi.mocked(isFavoriOnCooldown).mockReturnValue(true);
    const button = createButton({ mediaId: "159", favoriCount: 5 });

    expect(button.el().innerHTML).toContain("5");
    expect(button.el().getAttribute("aria-disabled")).toBe("true");
    expect(button.classes).toContain("vjs-charisma-favori--disabled");
  });

  it("incrémente et envoie le favori au clic", () => {
    const button = createButton({ mediaId: "159", favoriCount: 10 });
    button.handleClick();

    expect(button.el().innerHTML).toContain("11");
    expect(setFavoriCooldown).toHaveBeenCalledWith("159");
    expect(sendCharismaMediaFavori).toHaveBeenCalledWith("159");
  });

  it("ignore le clic sans mediaId, en cooldown ou si déjà désactivé", () => {
    const empty = createButton({ mediaId: "", favoriCount: 0 });
    empty.handleClick();
    expect(sendCharismaMediaFavori).not.toHaveBeenCalled();

    vi.mocked(isFavoriOnCooldown).mockReturnValue(true);
    const cooldown = createButton({ mediaId: "159", favoriCount: 1 });
    cooldown.handleClick();
    expect(sendCharismaMediaFavori).not.toHaveBeenCalled();

    vi.mocked(isFavoriOnCooldown).mockReturnValue(false);
    const active = createButton({ mediaId: "159", favoriCount: 1 });
    active.handleClick();
    vi.mocked(sendCharismaMediaFavori).mockClear();
    active.handleClick();
    expect(sendCharismaMediaFavori).not.toHaveBeenCalled();
  });

  it("ignore les erreurs réseau et les réponses non OK", async () => {
    vi.mocked(sendCharismaMediaFavori)
      .mockResolvedValueOnce({ ok: false, status: 500 } as Response)
      .mockRejectedValueOnce(new Error("network"));

    const first = createButton({ mediaId: "201", favoriCount: 1 });
    first.handleClick();
    await Promise.resolve();

    vi.mocked(isFavoriOnCooldown).mockReturnValue(false);
    const second = createButton({ mediaId: "202", favoriCount: 1 });
    second.handleClick();
    await Promise.resolve();

    expect(sendCharismaMediaFavori).toHaveBeenCalledTimes(2);
  });

  it("accepte 429 sans erreur", async () => {
    vi.mocked(sendCharismaMediaFavori).mockResolvedValue({ ok: false, status: 429 } as Response);
    const button = createButton({ mediaId: "159", favoriCount: 2 });
    button.handleClick();
    await Promise.resolve();
    expect(sendCharismaMediaFavori).toHaveBeenCalled();
  });

  it("normalise favoriCount invalide", () => {
    const button = createButton({ mediaId: "159", favoriCount: "bad" });
    expect(button.el().innerHTML).toContain("0");
  });

  it("borne un favoriCount négatif", () => {
    const button = createButton({ mediaId: "159", favoriCount: -8 });
    expect(button.el().innerHTML).toContain("0");
  });

  it("expose une classe CSS dédiée", () => {
    const button = createButton();
    expect(button.buildCSSClass()).toContain("vjs-charisma-favori");
  });
});
