import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import View from "./View";

const NODE_ROOT_TYPE = "node-root" as const;

type NodeRootType = {
  id: string;
  type: typeof NODE_ROOT_TYPE;
  parent: null;
  content: {
    title: string;
    background?: { type: string };
  };
};
import { AppContext, APP_MODE, type AppType } from "../../services/providers/AppContext";
import { NodeContext } from "../../services/providers/NodeContext";

vi.mock("../components/NodeCollection", () => ({
  default: ({ parentId }: { parentId: string }) => (
    <div data-testid="node-collection" data-parent={parentId} />
  ),
}));

const rootNode: NodeRootType = {
  id: "root-1",
  type: NODE_ROOT_TYPE,
  parent: null,
  content: {
    title: "Titre de test",
    background: { type: "default" },
  },
};

function createAppValue(overrides: Partial<AppType> = {}): AppType {
  return {
    nodes: {},
    setNodes: () => undefined,
    getNode: () => null,
    getChildren: vi.fn(() => ({ child: { id: "child-1" } })),
    mode: APP_MODE.VIEW,
    setMode: () => undefined,
    breakpoint: "tablet",
    setBreakpoint: () => undefined,
    fileManagerConfig: null,
    themeIcons: [],
    themeNodeOverrides: {},
    themeVars: {},
    pageBuilderApiBaseUrl: null,
    ...overrides,
  };
}

function renderView(appOverrides: Partial<AppType> = {}) {
  const appValue = createAppValue(appOverrides);

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <AppContext.Provider value={appValue}>
        <NodeContext.Provider value={{ node: rootNode, index: 0, getChildren: () => ({}) }}>
          {children}
        </NodeContext.Provider>
      </AppContext.Provider>
    );
  }

  return render(<View />, { wrapper: Wrapper });
}

describe("NodeRoot View", () => {
  it("met à jour le titre de page et rend le contenu", () => {
    renderView();
    expect(document.title).toBe("Titre de test");
    expect(screen.getByTestId("node-collection")).toHaveAttribute("data-parent", "root-1");
  });

  it("récupère les enfants via getChildren sur la zone main", () => {
    const getChildren = vi.fn(() => ({}));
    renderView({ getChildren });
    expect(getChildren).toHaveBeenCalledWith("root-1", "main");
  });

  it("applique le breakpoint du contexte", () => {
    renderView({ breakpoint: "mobile" });
    const innerColumn = document.querySelector(".node-root-content > .relative.z-10");
    expect(innerColumn?.className).toContain("max-w-sm");
  });
});
