import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { createTestNode } from "../../test/nodeFixtures";
import { AppContext, type AppType } from "../services/providers/AppContext";
import { BuilderContext } from "../services/providers/BuilderContext";
import type { BuilderType } from "../types/BuilderType";
import Explorer from "./Explorer";

vi.mock("../ManagerNode/NodeRoot", () => ({
  NODE_ROOT_TYPE: "node-root",
}));

vi.mock("../utils/nodeLabel", () => ({
  getNodeDisplayLabel: () => "",
  getNodeTypeLabel: () => "",
  hasCustomNodeLabel: () => false,
}));

vi.mock("./components/ExplorerDropZone", () => ({
  default: () => <div data-testid="explorer-dropzone" />,
}));

vi.mock("./components/ExplorerTreeNode", () => ({
  default: ({
    node,
    onSelect,
  }: {
    node: { id: string; editorLabel?: string };
    onSelect: (id: string) => void;
  }) => (
    <button type="button" onClick={() => onSelect(node.id)}>
      {node.editorLabel ?? node.id}
    </button>
  ),
}));

function createAppValue(nodes: AppType["nodes"]): AppType {
  return {
    nodes,
    setNodes: () => undefined,
    getNode: (id) => nodes[id] ?? null,
    getChildren: () => ({}),
    mode: "edit",
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

function renderExplorer(
  nodes: AppType["nodes"],
  builder: Partial<BuilderType> = {}
) {
  const setSelected = builder.setSelected ?? vi.fn();

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <AppContext.Provider value={createAppValue(nodes)}>
        <BuilderContext.Provider
          value={
            {
              selected: builder.selected ?? null,
              setSelected,
              updateNode: vi.fn(),
            } as BuilderType
          }
        >
          {children}
        </BuilderContext.Provider>
      </AppContext.Provider>
    );
  }

  return {
    setSelected,
    ...render(<Explorer />, { wrapper: Wrapper }),
  };
}

describe("Explorer", () => {
  it("affiche un message sans nœud racine", () => {
    renderExplorer({});

    expect(screen.getByText("Aucun nœud racine trouvé.")).toBeTruthy();
  });

  it("affiche l'arbre à partir de la racine", () => {
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

    renderExplorer({ root, "child-1": child });

    expect(screen.getByRole("tree", { name: "Structure de la page" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "root" })).toBeTruthy();
  });

  it("sélectionne un nœud depuis l'arbre", () => {
    const root = createTestNode({
      id: "root",
      type: "node-root",
      parent: { id: null, order: 0, zone: "main" },
    });

    const { setSelected } = renderExplorer({ root });

    fireEvent.click(screen.getByRole("button", { name: "root" }));

    expect(setSelected).toHaveBeenCalledWith("root");
  });

  it("scroll vers le nœud sélectionné", async () => {
    const root = createTestNode({
      id: "root",
      type: "node-root",
      parent: { id: null, order: 0, zone: "main" },
    });

    const scrollIntoView = vi.fn();
    const row = document.createElement("div");
    row.setAttribute("data-explorer-node-id", "root");
    row.scrollIntoView = scrollIntoView;
    document.body.appendChild(row);

    const raf = vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      cb(0);
      return 0;
    });

    renderExplorer({ root }, { selected: "root" });

    await waitFor(() => {
      expect(scrollIntoView).toHaveBeenCalledWith({ block: "nearest", behavior: "smooth" });
    });

    row.remove();
    raf.mockRestore();
  });
});
