import { describe, expect, it, vi } from "vitest";
import { createTestNode } from "../../../test/nodeFixtures";

vi.mock("../../ManagerNode/NodeRoot", () => ({
  NODE_ROOT_TYPE: "node-root",
}));

vi.mock("../../utils/nodeLabel", () => ({
  getNodeDisplayLabel: () => "",
  getNodeTypeLabel: () => "",
  hasCustomNodeLabel: () => false,
}));

import {
  findRootNode,
  getAncestorIds,
  getChildZoneGroups,
  hasChildren,
} from "./explorerTree";

function buildSampleNodes() {
  const root = createTestNode({
    id: "root",
    type: "node-root",
    parent: { id: null, order: 0, zone: "main" },
  });
  const childMain = createTestNode({
    id: "child-main",
    type: "node-text",
    parent: { id: "root", order: 0, zone: "main" },
  });
  const childLeft = createTestNode({
    id: "child-left",
    type: "node-text",
    parent: { id: "grid-1", order: 0, zone: "left" },
  });
  const childRight = createTestNode({
    id: "child-right",
    type: "node-text",
    parent: { id: "grid-1", order: 0, zone: "right" },
  });
  const grid = createTestNode({
    id: "grid-1",
    type: "node-grid",
    parent: { id: "root", order: 1, zone: "main" },
  });

  return {
    root,
    childMain,
    childLeft,
    childRight,
    grid,
    nodes: {
      root,
      "child-main": childMain,
      "child-left": childLeft,
      "child-right": childRight,
      "grid-1": grid,
    },
  };
}

describe("findRootNode", () => {
  it("retourne le nœud node-root", () => {
    const { root, nodes } = buildSampleNodes();
    expect(findRootNode(nodes)?.id).toBe(root.id);
  });

  it("retourne null sans racine", () => {
    expect(findRootNode({})).toBeNull();
  });
});

describe("getChildZoneGroups", () => {
  it("retourne un tableau vide sans enfants", () => {
    const { nodes } = buildSampleNodes();
    expect(getChildZoneGroups(nodes, "child-main")).toEqual([]);
  });

  it("regroupe les enfants par zone triée", () => {
    const { root, nodes } = buildSampleNodes();
    const groups = getChildZoneGroups(nodes, root.id);

    expect(groups).toHaveLength(1);
    expect(groups[0].zone).toBe("main");
    expect(groups[0].children.map((n) => n.id)).toEqual(["child-main", "grid-1"]);
  });

  it("sépare les zones left et right", () => {
    const { nodes } = buildSampleNodes();
    const groups = getChildZoneGroups(nodes, "grid-1");

    expect(groups.map((g) => g.zone)).toEqual(["left", "right"]);
    expect(groups[0].children[0].id).toBe("child-left");
    expect(groups[1].children[0].id).toBe("child-right");
  });
});

describe("hasChildren", () => {
  it("retourne true si le parent a des enfants", () => {
    const { root, nodes } = buildSampleNodes();
    expect(hasChildren(nodes, root.id)).toBe(true);
  });

  it("retourne false sans enfants", () => {
    const { nodes } = buildSampleNodes();
    expect(hasChildren(nodes, "child-main")).toBe(false);
  });
});

describe("getAncestorIds", () => {
  it("retourne les ancêtres du plus proche au plus lointain", () => {
    const { nodes } = buildSampleNodes();
    expect(getAncestorIds(nodes, "child-left")).toEqual(["root", "grid-1"]);
  });

  it("retourne un tableau vide pour la racine", () => {
    const { nodes } = buildSampleNodes();
    expect(getAncestorIds(nodes, "root")).toEqual([]);
  });
});
