import { describe, expect, it } from "vitest";
import { getVideoModalDataAttributes } from "./videoModalAttributes";

describe("getVideoModalDataAttributes", () => {
  it("retourne les attributs data en mode view", () => {
    expect(
      getVideoModalDataAttributes({
        isViewMode: true,
        src: "https://example.com/video.mp4",
        poster: "https://example.com/poster.jpg",
        mediaId: "abc123",
        favoriCount: 42,
      })
    ).toEqual({
      "data-video-src": "https://example.com/video.mp4",
      "data-video-poster": "https://example.com/poster.jpg",
      "data-media-id": "abc123",
      "data-favori-count": "42",
    });
  });

  it("omet data-media-id sans identifiant Charisma", () => {
    expect(
      getVideoModalDataAttributes({
        isViewMode: true,
        src: "https://example.com/video.mp4",
        poster: "",
      })
    ).toEqual({
      "data-video-src": "https://example.com/video.mp4",
      "data-video-poster": "",
    });
  });

  it("retourne un objet vide hors mode view", () => {
    expect(
      getVideoModalDataAttributes({
        isViewMode: false,
        src: "https://example.com/video.mp4",
        mediaId: "abc123",
      })
    ).toEqual({});
  });

  it("utilise un poster vide par défaut", () => {
    expect(
      getVideoModalDataAttributes({
        isViewMode: true,
        src: "https://example.com/video.mp4",
      })
    ).toEqual({
      "data-video-src": "https://example.com/video.mp4",
      "data-video-poster": "",
    });
  });
});
