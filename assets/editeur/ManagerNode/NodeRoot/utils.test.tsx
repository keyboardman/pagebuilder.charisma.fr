import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { usePageTitle } from "./utils";

describe("usePageTitle", () => {
  it("met à jour document.title quand un titre est fourni", () => {
    document.title = "Avant";
    renderHook(() => usePageTitle("Ma page"));
    expect(document.title).toBe("Ma page");
  });

  it("ne modifie pas le titre quand il est vide", () => {
    document.title = "Titre inchangé";
    renderHook(() => usePageTitle(""));
    expect(document.title).toBe("Titre inchangé");
  });

  it("utilise un document personnalisé si fourni", () => {
    const customDoc = document.implementation.createHTMLDocument("custom");
    customDoc.title = "Initial";

    renderHook(() => usePageTitle("Titre custom", customDoc));
    expect(customDoc.title).toBe("Titre custom");
  });
});
