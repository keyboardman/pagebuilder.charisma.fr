import { fireEvent, render, screen } from "@testing-library/react";
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

import ExplorerTreeNode from "./ExplorerTreeNode";

vi.mock("./ExplorerDropZone", () => ({
  default: ({
    parent,
  }: {
    parent: { id: string | null; zone: string; order: number };
  }) => (
    <div data-testid={`dropzone-${parent.zone}-${parent.order}`} />
  ),
}));

vi.mock("./ExplorerRow", () => ({
  default: ({
    node,
    onSelect,
    onToggleExpand,
    isExpandable,
    isExpanded,
  }: {
    node: { id: string; type: string };
    onSelect: () => void;
    onToggleExpand: (event: React.MouseEvent) => void;
    isExpandable: boolean;
    isExpanded: boolean;
  }) => (
    <div data-testid={`row-${node.id}`}>
      <button type="button" onClick={onSelect}>
        Sélectionner {node.id}
      </button>
      {isExpandable ? (
        <button type="button" onClick={onToggleExpand}>
          {isExpanded ? "Replier" : "Déplier"} {node.id}
        </button>
      ) : null}
    </div>
  ),
}));

function buildTreeNodes() {
  const root = createTestNode({
    id: "root",
    type: "node-root",
    parent: { id: null, order: 0, zone: "main" },
  });
  const child = createTestNode({
    id: "child-1",
    type: "node-text",
    parent: { id: "root", order: 0, zone: "main" },
  });
  const grid = createTestNode({
    id: "grid-1",
    type: "node-grid",
    parent: { id: "root", order: 1, zone: "main" },
  });
  const left = createTestNode({
    id: "left-1",
    type: "node-text",
    parent: { id: "grid-1", order: 0, zone: "left" },
  });
  const right = createTestNode({
    id: "right-1",
    type: "node-text",
    parent: { id: "grid-1", order: 0, zone: "right" },
  });

  return {
    root,
    nodes: {
      root,
      "child-1": child,
      "grid-1": grid,
      "left-1": left,
      "right-1": right,
    },
  };
}

describe("ExplorerTreeNode", () => {
  it("sélectionne le nœud au clic sur la ligne", () => {
    const onSelect = vi.fn();
    const { root, nodes } = buildTreeNodes();

    render(
      <ExplorerTreeNode
        node={root}
        nodes={nodes}
        depth={0}
        expanded={new Set(["root"])}
        selected={null}
        onToggleExpand={vi.fn()}
        onSelect={onSelect}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Sélectionner root" }));

    expect(onSelect).toHaveBeenCalledWith("root");
  });

  it("déplie automatiquement un conteneur au premier clic", () => {
    const onToggleExpand = vi.fn();
    const { root, nodes } = buildTreeNodes();

    render(
      <ExplorerTreeNode
        node={root}
        nodes={nodes}
        depth={0}
        expanded={new Set()}
        selected={null}
        onToggleExpand={onToggleExpand}
        onSelect={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Sélectionner root" }));

    expect(onToggleExpand).toHaveBeenCalledWith("root");
  });

  it("affiche les enfants et les en-têtes de zone quand déplié", () => {
    const { root, nodes } = buildTreeNodes();

    render(
      <ExplorerTreeNode
        node={root}
        nodes={nodes}
        depth={0}
        expanded={new Set(["root", "grid-1"])}
        selected={null}
        onToggleExpand={vi.fn()}
        onSelect={vi.fn()}
      />
    );

    expect(screen.getByText("left")).toBeTruthy();
    expect(screen.getByText("right")).toBeTruthy();
    expect(screen.getByTestId("row-child-1")).toBeTruthy();
    expect(screen.getByTestId("row-grid-1")).toBeTruthy();
    expect(screen.getByTestId("row-left-1")).toBeTruthy();
    expect(screen.getByTestId("row-right-1")).toBeTruthy();
  });

  it("bascule le repli via le bouton dédié", () => {
    const onToggleExpand = vi.fn();
    const { root, nodes } = buildTreeNodes();

    render(
      <ExplorerTreeNode
        node={root}
        nodes={nodes}
        depth={0}
        expanded={new Set(["root"])}
        selected={null}
        onToggleExpand={onToggleExpand}
        onSelect={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Replier root" }));

    expect(onToggleExpand).toHaveBeenCalledWith("root");
  });
});
