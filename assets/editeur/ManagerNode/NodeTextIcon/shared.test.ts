import { describe, expect, it } from "vitest";
import {
  ceIconBackgroundImageStyle,
  ceIconSvgMaskStyle,
  ceIconUrlStyle,
  isSvgIconUrl,
} from "./shared";

describe("isSvgIconUrl", () => {
  it("detects svg extension", () => {
    expect(isSvgIconUrl("https://example.com/icons/youtube.svg")).toBe(true);
    expect(isSvgIconUrl("/kbd/filemanager/media/default/icons/youtube.svg")).toBe(true);
    expect(isSvgIconUrl("/media/icon.SVG?cache=1")).toBe(true);
  });

  it("rejects raster extensions", () => {
    expect(isSvgIconUrl("https://example.com/icons/youtube.png")).toBe(false);
    expect(isSvgIconUrl("")).toBe(false);
  });
});

describe("ceIconUrlStyle", () => {
  it("uses mask for svg urls", () => {
    const url = "https://pagebuilder.charisma.fr/kbd/filemanager/media/default/icons/youtube.svg";
    expect(ceIconUrlStyle(url)).toEqual(ceIconSvgMaskStyle(url));
    expect(ceIconUrlStyle(url).maskImage).toContain("youtube.svg");
    expect(ceIconUrlStyle(url).backgroundColor).toBe("currentColor");
  });

  it("uses background-image for raster urls", () => {
    const url = "https://example.com/photo.png";
    expect(ceIconUrlStyle(url)).toEqual(ceIconBackgroundImageStyle(url));
  });
});
