import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import NodeHeaderView from "./NodeHeader/View";
import NodeTextView from "./NodeText/View";
import { NODE_HEADER_TYPE, type NodeHeaderType } from "./NodeHeader";
import { NODE_TEXT_TYPE, type NodeTextType } from "./NodeText";
import { AppContext, APP_MODE, type AppType } from "../services/providers/AppContext";
import { NodeContext } from "../services/providers/NodeContext";
import {
  NodeBuilderContext,
  type NodeBuilderValues,
} from "../services/providers/NodeBuilderContext";

function createAppValue(mode: AppType["mode"]): AppType {
  return {
    nodes: {},
    setNodes: () => undefined,
    getNode: () => null,
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

function createBuilder(
  onChange = vi.fn(),
  selected = true
): NodeBuilderValues<NodeHeaderType | NodeTextType> {
  return {
    node: {} as NodeHeaderType,
    drag: { ref: () => undefined, handleRef: () => undefined },
    onSelect: () => undefined,
    onDelete: () => undefined,
    onDuplicate: () => undefined,
    onChange,
    getChildren: () => ({}),
    isSelected: () => selected,
  };
}

function renderInlineTextView(
  View: typeof NodeTextView | typeof NodeHeaderView,
  node: NodeTextType | NodeHeaderType,
  options: {
    mode?: AppType["mode"];
    selected?: boolean;
    builder?: NodeBuilderValues<NodeHeaderType | NodeTextType> | null;
  } = {}
) {
  const mode = options.mode ?? APP_MODE.EDIT;
  const builder =
    options.builder !== undefined
      ? options.builder
      : createBuilder(vi.fn(), options.selected ?? true);

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <AppContext.Provider value={createAppValue(mode)}>
        <NodeContext.Provider value={{ node, index: 0, getChildren: () => ({}) }}>
          <NodeBuilderContext.Provider value={builder}>{children}</NodeBuilderContext.Provider>
        </NodeContext.Provider>
      </AppContext.Provider>
    );
  }

  return render(<View />, { wrapper: Wrapper });
}

describe("NodeText View — édition inline", () => {
  const node: NodeTextType = {
    id: "text-1",
    type: NODE_TEXT_TYPE,
    parent: { id: "root", order: 0, zone: "main" },
    content: { html: "Mon&nbsp;texte", tag: "p" },
    attributes: { className: "custom-text" },
  };

  it("affiche un aperçu HTML hors sélection", () => {
    renderInlineTextView(NodeTextView, node, { selected: false });

    const el = screen.getByText((_, element) => element?.innerHTML === "Mon&nbsp;texte");
    expect(el.tagName).toBe("P");
    expect(el).toHaveClass("ce-text", "custom-text");
    expect(el).not.toHaveAttribute("contenteditable");
  });

  it("active InputEditor à la sélection en mode édition", () => {
    renderInlineTextView(NodeTextView, node, { selected: true });

    const editor = screen.getByText("Mon texte");
    expect(editor.tagName).toBe("P");
    expect(editor).toHaveAttribute("contenteditable", "true");
  });
});

describe("NodeHeader View — édition inline", () => {
  const node: NodeHeaderType = {
    id: "header-1",
    type: NODE_HEADER_TYPE,
    parent: { id: "root", order: 0, zone: "main" },
    content: { html: "Titre<br>sous-titre", tag: "h2" },
    attributes: {},
  };

  it("affiche le HTML en aperçu hors sélection", () => {
    renderInlineTextView(NodeHeaderView, node, { selected: false });

    const el = screen.getByRole("heading", { level: 2 });
    expect(el).toHaveClass("ce-header", "ce-header-h2");
    expect(el.innerHTML).toBe("Titre<br>sous-titre");
    expect(el).not.toHaveAttribute("contenteditable");
  });

  it("active InputEditor à la sélection en mode édition", () => {
    renderInlineTextView(NodeHeaderView, node, { selected: true });

    const editor = screen.getByRole("heading", { level: 2 });
    expect(editor).toHaveAttribute("contenteditable", "true");
    expect(editor.innerHTML).toContain("Titre");
    expect(editor.innerHTML).toContain("sous-titre");
  });

  it("reste en aperçu en mode prévisualisation même si sélectionné", () => {
    renderInlineTextView(NodeHeaderView, node, { mode: APP_MODE.PREVIEW, selected: true });

    const el = screen.getByRole("heading", { level: 2 });
    expect(el.innerHTML).toBe("Titre<br>sous-titre");
    expect(el).not.toHaveAttribute("contenteditable");
  });
});
