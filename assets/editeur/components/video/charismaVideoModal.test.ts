import { beforeEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";

const { createCharismaVideoPlayer, disposeCharismaVideoPlayer, fetchCharismaMediaFavoriCount } =
  vi.hoisted(() => ({
    createCharismaVideoPlayer: vi.fn(),
    disposeCharismaVideoPlayer: vi.fn(),
    fetchCharismaMediaFavoriCount: vi.fn(),
  }));

vi.mock("./createCharismaVideoPlayer", () => ({
  createCharismaVideoPlayer,
  disposeCharismaVideoPlayer,
}));

vi.mock("./mediaApi", () => ({
  fetchCharismaMediaFavoriCount,
}));

import { initCharismaVideoModals, openCharismaVideoModal } from "./charismaVideoModal";

describe("openCharismaVideoModal", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    createCharismaVideoPlayer.mockReset();
    disposeCharismaVideoPlayer.mockReset();
    fetchCharismaMediaFavoriCount.mockReset();
    createCharismaVideoPlayer.mockReturnValue({ isDisposed: () => false });
    fetchCharismaMediaFavoriCount.mockResolvedValue(99);
  });

  it("retourne un noop sans src", () => {
    const close = openCharismaVideoModal({ src: "" });
    expect(document.body.children).toHaveLength(0);
    expect(close()).toBeUndefined();
  });

  it("ouvre une modale et ferme via le bouton", async () => {
    const user = userEvent.setup();
    const close = openCharismaVideoModal({
      src: "https://example.com/video.mp4",
      poster: "https://example.com/poster.jpg",
      mediaId: "159",
      favoriCount: 42,
    });

    expect(document.body.querySelector(".fixed.inset-0")).not.toBeNull();

    await vi.waitFor(() => {
      expect(createCharismaVideoPlayer).toHaveBeenCalledWith(
        expect.any(HTMLVideoElement),
        expect.objectContaining({
          src: "https://example.com/video.mp4",
          mediaId: "159",
          favoriCount: 42,
        })
      );
    });

    const closeButton = document.querySelector("button[aria-label='Fermer']");
    expect(closeButton).not.toBeNull();
    await user.click(closeButton!);

    expect(disposeCharismaVideoPlayer).toHaveBeenCalled();
    expect(document.body.children).toHaveLength(0);

    close();
  });

  it("ferme au clic sur l'overlay", async () => {
    const user = userEvent.setup();
    openCharismaVideoModal({ src: "https://example.com/video.mp4" });

    const overlay = document.body.querySelector(".fixed.inset-0") as HTMLElement;
    await user.click(overlay);

    expect(disposeCharismaVideoPlayer).toHaveBeenCalled();
    expect(document.body.children).toHaveLength(0);
  });

  it("charge le compteur favori si absent", async () => {
    openCharismaVideoModal({
      src: "https://example.com/video.mp4",
      mediaId: "159",
    });

    await vi.waitFor(() => {
      expect(fetchCharismaMediaFavoriCount).toHaveBeenCalledWith("159");
      expect(createCharismaVideoPlayer).toHaveBeenCalledWith(
        expect.any(HTMLVideoElement),
        expect.objectContaining({ favoriCount: 99 })
      );
    });
  });

  it("n'initialise pas le player si fermé avant la fin du fetch", async () => {
    let resolveFetch: (value: number) => void = () => undefined;
    fetchCharismaMediaFavoriCount.mockReturnValue(
      new Promise<number>((resolve) => {
        resolveFetch = resolve;
      })
    );

    const close = openCharismaVideoModal({
      src: "https://example.com/video.mp4",
      mediaId: "159",
    });

    close();
    resolveFetch(12);
    await Promise.resolve();

    expect(createCharismaVideoPlayer).not.toHaveBeenCalled();
  });
});

describe("initCharismaVideoModals", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    createCharismaVideoPlayer.mockReset();
    createCharismaVideoPlayer.mockReturnValue({ isDisposed: () => false });
  });

  it("attache un gestionnaire de clic sur data-video-src", async () => {
    const trigger = document.createElement("button");
    trigger.setAttribute("data-video-src", "https://example.com/video.mp4");
    trigger.setAttribute("data-video-poster", "poster.jpg");
    trigger.setAttribute("data-media-id", "159");
    trigger.setAttribute("data-favori-count", "7");
    document.body.appendChild(trigger);

    initCharismaVideoModals(document);

    trigger.click();

    await vi.waitFor(() => {
      expect(createCharismaVideoPlayer).toHaveBeenCalled();
    });

    initCharismaVideoModals(document);
    createCharismaVideoPlayer.mockClear();
    trigger.click();
    expect(createCharismaVideoPlayer).toHaveBeenCalledTimes(1);
  });

  it("ignore les éléments sans data-video-src au clic", () => {
    const trigger = document.createElement("button");
    trigger.setAttribute("data-video-src", "");
    document.body.appendChild(trigger);

    initCharismaVideoModals(document);
    trigger.click();

    expect(createCharismaVideoPlayer).not.toHaveBeenCalled();
  });

  it("ouvre une modale sans poster ni media-id explicites", async () => {
    const trigger = document.createElement("button");
    trigger.setAttribute("data-video-src", "https://example.com/video.mp4");
    document.body.appendChild(trigger);

    initCharismaVideoModals(document);
    trigger.click();

    await vi.waitFor(() => {
      expect(createCharismaVideoPlayer).toHaveBeenCalledWith(
        expect.any(HTMLVideoElement),
        expect.objectContaining({
          src: "https://example.com/video.mp4",
          poster: "",
          mediaId: undefined,
        })
      );
    });
  });

  it("attache les déclencheurs ajoutés dynamiquement quand observe est activé", async () => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    initCharismaVideoModals(container, { observe: true });

    const trigger = document.createElement("button");
    trigger.setAttribute("data-video-src", "https://example.com/late.mp4");
    container.appendChild(trigger);

    await vi.waitFor(() => {
      expect(trigger.dataset.videoModalInit).toBe("1");
    });

    trigger.click();

    await vi.waitFor(() => {
      expect(createCharismaVideoPlayer).toHaveBeenCalledWith(
        expect.any(HTMLVideoElement),
        expect.objectContaining({ src: "https://example.com/late.mp4" })
      );
    });
  });
});
