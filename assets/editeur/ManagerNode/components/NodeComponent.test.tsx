import { render, screen } from "@testing-library/react";
import { createElement, type ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { createTestNode } from "../../../test/nodeFixtures";
import { AppContext, APP_MODE, type AppType } from "../../services/providers/AppContext";
import { NodeContext } from "../../services/providers/NodeContext";
import {
  NodeBuilderContext,
  type NodeBuilderValues,
} from "../../services/providers/NodeBuilderContext";
import NodeComponent from "./NodeComponent";

vi.mock("./NodeRegistry", () => ({
  default: {
    "node-text": {
      view: () => createElement("div", { "data-testid": "node-view" }, "Contenu"),
    },
  },
  isKnownNode: (node: { type: string }) => node.type === "node-text",
}));

vi.mock("./DropZone", () => ({
  default: () => null,
}));

vi.mock("./NodeMenu", () => ({
  default: () => null,
}));

function createAppValue(mode: AppType["mode"], nodes: AppType["nodes"]): AppType {
  return {
    nodes,
    setNodes: () => undefined,
    getNode: (id) => nodes[id] ?? null,
    getChildren: () => ({}),
    mode,
    setMode: () => undefined,
    breakpoint: "desktop",
    setBreakpoint: () => undefined,
    fileManagerConfig: null,
    themeIcons: [],
    themeNodeOverrides: {},
    themeVars: {},
    pageBuilderApiBaseUrl: null,
  };
}

function createBuilder(): NodeBuilderValues {
  return {
    node: {} as never,
    drag: { ref: () => undefined, handleRef: () => undefined },
    onSelect: () => undefined,
    onDelete: () => undefined,
    onDuplicate: () => undefined,
    onChange: vi.fn(),
    getChildren: () => ({}),
    isSelected: () => false,
  };
}

function renderNodeComponent(
  node: ReturnType<typeof createTestNode>,
  mode: AppType["mode"],
  nodes?: AppType["nodes"]
) {
  const allNodes = nodes ?? { [node.id]: node };

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <AppContext.Provider value={createAppValue(mode, allNodes)}>
        <NodeContext.Provider value={{ node, index: 0, getChildren: () => ({}) }}>
          <NodeBuilderContext.Provider value={createBuilder()}>
            {children}
          </NodeBuilderContext.Provider>
        </NodeContext.Provider>
      </AppContext.Provider>
    );
  }

  return render(<NodeComponent />, { wrapper: Wrapper });
}

describe("NodeComponent — visibilité", () => {
  it("ne rend pas le nœud en édition si masqué", () => {
    const node = createTestNode({ id: "child-1", hidden: true });

    renderNodeComponent(node, APP_MODE.EDIT);

    expect(screen.queryByTestId("node-view")).toBeNull();
  });

  it("ne rend pas le nœud en prévisualisation si masqué", () => {
    const node = createTestNode({ id: "child-1", hidden: true });

    renderNodeComponent(node, APP_MODE.PREVIEW);

    expect(screen.queryByTestId("node-view")).toBeNull();
  });

  it("ne rend pas le nœud en vue si un ancêtre est masqué", () => {
    const parent = createTestNode({
      id: "parent-1",
      type: "node-flex",
      hidden: true,
      parent: { id: "root", order: 0, zone: "main" },
    });
    const child = createTestNode({
      id: "child-1",
      parent: { id: "parent-1", order: 0, zone: "main" },
    });

    renderNodeComponent(child, APP_MODE.VIEW, {
      "parent-1": parent,
      "child-1": child,
    });

    expect(screen.queryByTestId("node-view")).toBeNull();
  });

  it("rend le nœud visible en prévisualisation", () => {
    const node = createTestNode({ id: "child-1" });

    renderNodeComponent(node, APP_MODE.PREVIEW);

    expect(screen.getByTestId("node-view")).toBeTruthy();
  });
});
