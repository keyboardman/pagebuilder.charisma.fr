import { describe, expect, it, vi } from "vitest";
import { createTestNode } from "../../test/nodeFixtures";
import {
  getNodeDisplayLabel,
  getNodeTypeLabel,
  hasCustomNodeLabel,
} from "./nodeLabel";

const NODE_ROOT_TYPE = "node-root";
const NODE_NAV_ITEM_TYPE = "node-nav-item";
const NODE_IMAGE_TYPE = "node-image";

vi.mock("../ManagerNode/components/NodeRegistry", () => {
  const registry: Record<string, { button: { label: string } }> = {
    "node-image": { button: { label: "Image" } },
    "node-text": { button: { label: "Text" } },
  };

  return {
    default: registry,
    isKnownNode: (node: { type: string }) => node.type in registry,
  };
});

vi.mock("../ManagerNode/NodeNavItem", () => ({
  NODE_NAV_ITEM_TYPE: "node-nav-item",
}));

vi.mock("../ManagerNode/NodeRoot", () => ({
  NODE_ROOT_TYPE: "node-root",
}));

describe("getNodeTypeLabel", () => {
  it("retourne Page pour le nœud racine", () => {
    const node = createTestNode({ type: NODE_ROOT_TYPE });
    expect(getNodeTypeLabel(node)).toBe("Page");
  });

  it("retourne le libellé du registre pour un type connu", () => {
    const node = createTestNode({ type: NODE_IMAGE_TYPE });
    expect(getNodeTypeLabel(node)).toBe("Image");
  });

  it("retire le préfixe node- pour un type inconnu", () => {
    const node = createTestNode({ type: "node-custom-widget" });
    expect(getNodeTypeLabel(node)).toBe("custom-widget");
  });
});

describe("getNodeDisplayLabel", () => {
  it("priorise editorLabel quand il est renseigné", () => {
    const node = createTestNode({ editorLabel: "  Mon bloc  " });
    expect(getNodeDisplayLabel(node)).toBe("Mon bloc");
  });

  it("utilise le label de contenu pour un nav-item", () => {
    const node = createTestNode({
      type: NODE_NAV_ITEM_TYPE,
      content: { label: "Accueil" },
    });
    expect(getNodeDisplayLabel(node)).toBe("Accueil");
  });

  it("retombe sur le type sans label personnalisé", () => {
    const node = createTestNode({ type: NODE_IMAGE_TYPE });
    expect(getNodeDisplayLabel(node)).toBe("Image");
  });
});

describe("hasCustomNodeLabel", () => {
  it("retourne true si editorLabel est non vide", () => {
    expect(hasCustomNodeLabel(createTestNode({ editorLabel: "Bloc A" }))).toBe(true);
  });

  it("retourne false si editorLabel est absent ou vide", () => {
    expect(hasCustomNodeLabel(createTestNode())).toBe(false);
    expect(hasCustomNodeLabel(createTestNode({ editorLabel: "   " }))).toBe(false);
  });
});
