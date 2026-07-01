import { describe, expect, it } from "vitest";
import { createTestNode } from "../../test/nodeFixtures";
import { isNodeEffectivelyHidden } from "./nodeVisibility";

describe("isNodeEffectivelyHidden", () => {
  it("retourne false pour un nœud visible sans ancêtre masqué", () => {
    const nodes = {
      root: createTestNode({ id: "root", type: "node-root", parent: { id: null, order: 0, zone: "main" } }),
      child: createTestNode({ id: "child", parent: { id: "root", order: 0, zone: "main" } }),
    };

    expect(isNodeEffectivelyHidden("child", nodes)).toBe(false);
  });

  it("retourne true si le nœud est masqué", () => {
    const nodes = {
      child: createTestNode({ id: "child", hidden: true }),
    };

    expect(isNodeEffectivelyHidden("child", nodes)).toBe(true);
  });

  it("retourne true si un ancêtre est masqué", () => {
    const nodes = {
      parent: createTestNode({
        id: "parent",
        type: "node-flex",
        hidden: true,
        parent: { id: "root", order: 0, zone: "main" },
      }),
      child: createTestNode({
        id: "child",
        parent: { id: "parent", order: 0, zone: "main" },
      }),
    };

    expect(isNodeEffectivelyHidden("child", nodes)).toBe(true);
  });

  it("retourne false si l'enfant est masqué mais le parent visible (enfant seul)", () => {
    const nodes = {
      parent: createTestNode({
        id: "parent",
        type: "node-flex",
        parent: { id: "root", order: 0, zone: "main" },
      }),
      child: createTestNode({
        id: "child",
        hidden: true,
        parent: { id: "parent", order: 0, zone: "main" },
      }),
    };

    expect(isNodeEffectivelyHidden("parent", nodes)).toBe(false);
    expect(isNodeEffectivelyHidden("child", nodes)).toBe(true);
  });

  it("retourne false pour un id inconnu", () => {
    expect(isNodeEffectivelyHidden("missing", {})).toBe(false);
  });
});
