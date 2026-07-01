import { describe, expect, it } from "vitest";
import { buildControlBarChildrenWithFavori } from "./controlBarChildren";

describe("buildControlBarChildrenWithFavori", () => {
  it("place CharismaFavoriButton juste avant pictureInPictureToggle", () => {
    const children = buildControlBarChildrenWithFavori("media-123", 42);
    const pipIndex = children.indexOf("pictureInPictureToggle");
    const favori = children[pipIndex - 1];

    expect(pipIndex).toBeGreaterThan(0);
    expect(favori).toEqual({ name: "CharismaFavoriButton", mediaId: "media-123", favoriCount: 42 });
  });
});
