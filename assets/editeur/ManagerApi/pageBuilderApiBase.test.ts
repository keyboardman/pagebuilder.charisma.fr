import { afterEach, describe, expect, it } from "vitest";
import {
  pageBuilderApiUrl,
  resolvePageBuilderApiBaseUrl,
  toPageBuilderAbsoluteUrl,
} from "./pageBuilderApiBase";

describe("pageBuilderApiBase", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("falls back to the relative API path without a DOM base", () => {
    expect(resolvePageBuilderApiBaseUrl()).toBe("/api/page-builder");
    expect(pageBuilderApiUrl("collections/resolve")).toBe("/api/page-builder/collections/resolve");
  });

  it("prefixes subpaths with the absolute data-api-cards-base-url", () => {
    document.body.innerHTML =
      '<div data-api-cards-base-url="https://pagebuilder.example/api/page-builder"></div>';

    expect(resolvePageBuilderApiBaseUrl()).toBe("https://pagebuilder.example/api/page-builder");
    expect(pageBuilderApiUrl("collections/resolve")).toBe(
      "https://pagebuilder.example/api/page-builder/collections/resolve"
    );
    expect(
      pageBuilderApiUrl("lists-image/charisma_evenement_home/items?page=1&itemsPerPage=10")
    ).toBe(
      "https://pagebuilder.example/api/page-builder/lists-image/charisma_evenement_home/items?page=1&itemsPerPage=10"
    );
  });

  it("absolutizes relative form actions against the page-builder origin", () => {
    document.body.innerHTML =
      '<div data-api-cards-base-url="https://pagebuilder.example/api/page-builder"></div>';

    expect(toPageBuilderAbsoluteUrl("/api/page-builder/forms/contact/submit")).toBe(
      "https://pagebuilder.example/api/page-builder/forms/contact/submit"
    );
    expect(toPageBuilderAbsoluteUrl("https://other.example/submit")).toBe("https://other.example/submit");
  });
});
