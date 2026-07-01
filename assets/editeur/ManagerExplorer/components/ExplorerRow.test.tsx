import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { createTestNode } from "../../../test/nodeFixtures";
import { AppContext, type AppType } from "../../services/providers/AppContext";
import { BuilderContext } from "../../services/providers/BuilderContext";
import type { BuilderType } from "../../types/BuilderType";
import ExplorerRow from "./ExplorerRow";

vi.mock("@dnd-kit/react", () => ({
  useDraggable: () => ({
    ref: () => undefined,
    handleRef: () => undefined,
  }),
}));

vi.mock("../../ManagerNode/NodeRoot", () => ({
  NODE_ROOT_TYPE: "node-root",
}));

vi.mock("../utils/explorerTree", () => ({
  getNodeDisplayLabel: () => "Mon bloc",
  getNodeTypeLabel: () => "Text",
  hasCustomNodeLabel: () => false,
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

function renderExplorerRow(
  node: ReturnType<typeof createTestNode>,
  options: {
    nodes?: AppType["nodes"];
    updateNode?: BuilderType["updateNode"];
    onSelect?: () => void;
    onToggleExpand?: (event: React.MouseEvent) => void;
    isExpandable?: boolean;
    isExpanded?: boolean;
    isActive?: boolean;
  } = {}
) {
  const nodes = options.nodes ?? { [node.id]: node };
  const updateNode = options.updateNode ?? vi.fn();
  const onSelect = options.onSelect ?? vi.fn();
  const onToggleExpand = options.onToggleExpand ?? vi.fn();

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <AppContext.Provider value={createAppValue(nodes)}>
        <BuilderContext.Provider
          value={
            {
              updateNode,
            } as BuilderType
          }
        >
          {children}
        </BuilderContext.Provider>
      </AppContext.Provider>
    );
  }

  return render(
    <ExplorerRow
      node={node}
      depth={1}
      isExpandable={options.isExpandable ?? false}
      isExpanded={options.isExpanded ?? false}
      isActive={options.isActive ?? false}
      isDraggable={node.type !== "node-root"}
      onToggleExpand={onToggleExpand}
      onSelect={onSelect}
    />,
    { wrapper: Wrapper }
  );
}

describe("ExplorerRow — visibilité", () => {
  it("bascule hidden via l'icône œil", () => {
    const node = createTestNode({ id: "child-1", type: "node-text" });
    const updateNode = vi.fn();

    renderExplorerRow(node, { updateNode });

    fireEvent.click(screen.getByRole("button", { name: "Masquer le composant" }));

    expect(updateNode).toHaveBeenCalledWith({ ...node, hidden: true });
  });

  it("n'affiche pas l'icône œil sur node-root", () => {
    const node = createTestNode({
      id: "root-1",
      type: "node-root",
      parent: { id: null, order: 0, zone: "main" },
    });

    renderExplorerRow(node, { nodes: { "root-1": node } });

    expect(screen.queryByRole("button", { name: "Masquer le composant" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Afficher le composant" })).toBeNull();
  });

  it("ne sélectionne pas le nœud au clic sur l'icône œil", () => {
    const node = createTestNode({ id: "child-1", type: "node-text" });
    const onSelect = vi.fn();

    renderExplorerRow(node, { onSelect });

    fireEvent.click(screen.getByRole("button", { name: "Masquer le composant" }));

    expect(onSelect).not.toHaveBeenCalled();
  });

  it("affiche EyeOff quand le nœud est effectivement masqué", () => {
    const node = createTestNode({ id: "child-1", type: "node-text", hidden: true });

    renderExplorerRow(node);

    expect(screen.getByRole("button", { name: "Afficher le composant" })).toBeTruthy();
  });
});

describe("ExplorerRow — interactions", () => {
  it("sélectionne le nœud au clic sur la ligne", () => {
    const node = createTestNode({ id: "child-1", type: "node-text" });
    const onSelect = vi.fn();

    renderExplorerRow(node, { onSelect });

    fireEvent.click(screen.getByText("Mon bloc"));

    expect(onSelect).toHaveBeenCalled();
  });

  it("déclenche onToggleExpand via le chevron", () => {
    const node = createTestNode({ id: "child-1", type: "node-text" });
    const onToggleExpand = vi.fn();

    renderExplorerRow(node, {
      isExpandable: true,
      isExpanded: false,
      onToggleExpand,
    });

    fireEvent.click(screen.getByRole("button", { name: "Déplier" }));

    expect(onToggleExpand).toHaveBeenCalled();
  });

  it("renomme le nœud via double-clic et validation Entrée", () => {
    const node = createTestNode({ id: "child-1", type: "node-text" });
    const updateNode = vi.fn();

    renderExplorerRow(node, { updateNode });

    fireEvent.doubleClick(screen.getByText("Mon bloc"));
    const input = screen.getByRole("textbox", { name: "Nom dans l'éditeur" });
    fireEvent.change(input, { target: { value: "  Nouveau nom  " } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(updateNode).toHaveBeenCalledWith({
      ...node,
      editorLabel: "Nouveau nom",
    });
  });

  it("annule le renommage avec Échap", () => {
    const node = createTestNode({ id: "child-1", type: "node-text", editorLabel: "Avant" });
    const updateNode = vi.fn();

    renderExplorerRow(node, { updateNode });

    fireEvent.doubleClick(screen.getByText("Mon bloc"));
    const input = screen.getByRole("textbox", { name: "Nom dans l'éditeur" });
    fireEvent.change(input, { target: { value: "Après" } });
    fireEvent.keyDown(input, { key: "Escape" });

    expect(updateNode).not.toHaveBeenCalled();
    expect(screen.getByText("Mon bloc")).toBeTruthy();
  });

  it("réactive un nœud masqué via l'icône œil", () => {
    const node = createTestNode({ id: "child-1", type: "node-text", hidden: true });
    const updateNode = vi.fn();

    renderExplorerRow(node, { updateNode });

    fireEvent.click(screen.getByRole("button", { name: "Afficher le composant" }));

    expect(updateNode).toHaveBeenCalledWith({ ...node, hidden: false });
  });

  it("valide le renommage au blur", () => {
    const node = createTestNode({ id: "child-1", type: "node-text" });
    const updateNode = vi.fn();

    renderExplorerRow(node, { updateNode });

    fireEvent.doubleClick(screen.getByText("Mon bloc"));
    const input = screen.getByRole("textbox", { name: "Nom dans l'éditeur" });
    fireEvent.change(input, { target: { value: "Nom blur" } });
    fireEvent.blur(input);

    expect(updateNode).toHaveBeenCalledWith({ ...node, editorLabel: "Nom blur" });
  });

  it("affiche le chevron replié quand isExpanded est true", () => {
    const node = createTestNode({ id: "child-1", type: "node-text" });

    renderExplorerRow(node, { isExpandable: true, isExpanded: true });

    expect(screen.getByRole("button", { name: "Replier" })).toBeTruthy();
  });
});
