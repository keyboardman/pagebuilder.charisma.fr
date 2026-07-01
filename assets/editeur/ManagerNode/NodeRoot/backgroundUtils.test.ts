import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  DEFAULT_NODE_ROOT_BACKGROUND,
  getNodeRootWrapperStyle,
  hasCustomNodeRootBackground,
  resolveNodeRootBackground,
  toAbsoluteUrl,
} from "./backgroundUtils";

describe("toAbsoluteUrl", () => {
  beforeEach(() => {
    vi.stubGlobal("location", {
      ...window.location,
      origin: "https://pagebuilder.test",
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("retourne l'url telle quelle si vide ou absolue", () => {
    expect(toAbsoluteUrl("")).toBe("");
    expect(toAbsoluteUrl("https://cdn.example.com/bg.jpg")).toBe(
      "https://cdn.example.com/bg.jpg"
    );
    expect(toAbsoluteUrl("http://localhost/media/video.mp4")).toBe(
      "http://localhost/media/video.mp4"
    );
  });

  it("préfixe les chemins relatifs avec l'origine courante", () => {
    vi.stubGlobal("window", {
      location: { origin: "https://pagebuilder.test" },
    } as Window & typeof globalThis);

    expect(toAbsoluteUrl("/media/hero.jpg")).toBe("https://pagebuilder.test/media/hero.jpg");
    expect(toAbsoluteUrl("media/hero.jpg")).toBe("https://pagebuilder.test/media/hero.jpg");
  });
});

describe("resolveNodeRootBackground", () => {
  it("retourne default si absent ou déjà default", () => {
    expect(resolveNodeRootBackground()).toEqual(DEFAULT_NODE_ROOT_BACKGROUND);
    expect(resolveNodeRootBackground({ type: "default" })).toEqual({
      type: "default",
    });
  });

  it("conserve les autres types", () => {
    const color = { type: "color" as const, color: "#fff" };
    expect(resolveNodeRootBackground(color)).toEqual(color);
  });
});

describe("hasCustomNodeRootBackground", () => {
  it("retourne false pour default ou valeurs vides", () => {
    expect(hasCustomNodeRootBackground()).toBe(false);
    expect(hasCustomNodeRootBackground({ type: "default" })).toBe(false);
    expect(hasCustomNodeRootBackground({ type: "color", color: "  " })).toBe(false);
    expect(hasCustomNodeRootBackground({ type: "image", url: "" })).toBe(false);
    expect(hasCustomNodeRootBackground({ type: "video", url: "   " })).toBe(false);
  });

  it("retourne true pour une couleur, image ou vidéo renseignée", () => {
    expect(hasCustomNodeRootBackground({ type: "color", color: "#000" })).toBe(true);
    expect(hasCustomNodeRootBackground({ type: "image", url: "/bg.png" })).toBe(true);
    expect(hasCustomNodeRootBackground({ type: "video", url: "/bg.mp4" })).toBe(true);
  });
});

describe("getNodeRootWrapperStyle", () => {
  beforeEach(() => {
    vi.stubGlobal("location", {
      ...window.location,
      origin: "https://pagebuilder.test",
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("retourne un objet vide pour default", () => {
    expect(getNodeRootWrapperStyle({ type: "default" })).toEqual({});
  });

  it("applique backgroundColor pour une couleur", () => {
    expect(getNodeRootWrapperStyle({ type: "color", color: "#ff0000" })).toEqual({
      backgroundColor: "#ff0000",
    });
    expect(getNodeRootWrapperStyle({ type: "color", color: "" })).toEqual({});
  });

  it("applique les propriétés image avec url absolue", () => {
    vi.stubGlobal("window", {
      location: { origin: "https://pagebuilder.test" },
    } as Window & typeof globalThis);

    expect(
      getNodeRootWrapperStyle({
        type: "image",
        url: "/media/bg.jpg",
        position: "top",
        size: "contain",
        repeat: "repeat",
        color: "#111",
      })
    ).toEqual({
      backgroundImage: "url(https://pagebuilder.test/media/bg.jpg)",
      backgroundPosition: "top",
      backgroundSize: "contain",
      backgroundRepeat: "repeat",
      backgroundColor: "#111",
    });
  });

  it("utilise les valeurs par défaut image et ignore une url vide", () => {
    expect(
      getNodeRootWrapperStyle({
        type: "image",
        url: "  ",
        color: "#222",
      })
    ).toEqual({ backgroundColor: "#222" });
  });

  it("applique backgroundColor pour une vidéo avec couleur fallback", () => {
    expect(
      getNodeRootWrapperStyle({
        type: "video",
        url: "/video.mp4",
        color: "#333",
      })
    ).toEqual({ backgroundColor: "#333" });
    expect(getNodeRootWrapperStyle({ type: "video", url: "/video.mp4" })).toEqual({});
  });
});
