import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Settings from "./Settings";

const NODE_ROOT_TYPE = "node-root" as const;

type NodeRootType = {
  id: string;
  type: typeof NODE_ROOT_TYPE;
  parent: null;
  content: {
    title: string;
    background?: {
      type: string;
      color?: string;
      url?: string;
      position?: string;
      size?: string;
      repeat?: string;
      poster?: string;
      objectFit?: string;
      objectPosition?: string;
    };
  };
};
import { AppContext, type AppType } from "../../services/providers/AppContext";
import {
  NodeBuilderContext,
  type NodeBuilderValues,
} from "../../services/providers/NodeBuilderContext";

vi.mock("../../ManagerAsset/FileManagerIframePicker", () => ({
  FileManagerIframePicker: () => null,
}));

const rootNode: NodeRootType = {
  id: "root-1",
  type: NODE_ROOT_TYPE,
  parent: null,
  content: {
    title: "Page initiale",
    background: { type: "default" },
  },
};

function createAppValue(): AppType {
  return {
    nodes: {},
    setNodes: () => undefined,
    getNode: () => null,
    getChildren: () => ({}),
    mode: "edit",
    setMode: () => undefined,
    breakpoint: "desktop",
    setBreakpoint: () => undefined,
    fileManagerConfig: { filemanagerUrl: "https://fm.test/filemanager" },
    themeIcons: [],
    themeNodeOverrides: {},
    themeVars: {},
    pageBuilderApiBaseUrl: null,
  };
}

function renderSettings(onChange = vi.fn()) {
  const builder: NodeBuilderValues<NodeRootType> = {
    node: rootNode,
    drag: { ref: () => undefined, handleRef: () => undefined },
    onSelect: () => undefined,
    onDelete: () => undefined,
    onDuplicate: () => undefined,
    onChange,
    getChildren: () => ({}),
    isSelected: () => true,
  };

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <AppContext.Provider value={createAppValue()}>
        <NodeBuilderContext.Provider value={builder}>{children}</NodeBuilderContext.Provider>
      </AppContext.Provider>
    );
  }

  return { onChange, ...render(<Settings />, { wrapper: Wrapper }) };
}

describe("NodeRoot Settings", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("affiche le titre de la page dans l'onglet général", () => {
    renderSettings();
    expect(screen.getByDisplayValue("Page initiale")).toBeInTheDocument();
    expect(screen.getByText("Titre de la page")).toBeInTheDocument();
  });

  it("persiste le titre modifié", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderSettings(onChange);

    const input = screen.getByDisplayValue("Page initiale");
    await user.clear(input);
    await user.type(input, "Nouveau titre");
    await vi.advanceTimersByTimeAsync(500);

    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls.at(-1)?.[0] as NodeRootType;
    expect(lastCall.content.title).toBe("Nouveau titre");
  });

  it("affiche les réglages d'arrière-plan dans l'onglet dédié", async () => {
    const user = userEvent.setup();
    renderSettings();

    await user.click(screen.getByRole("tab", { name: "Arrière-plan" }));
    expect(screen.getByText("Type d'arrière-plan")).toBeInTheDocument();
  });
});
