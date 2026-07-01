import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import BackgroundSettings from "./BackgroundSettings";

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
import { AppContext, type AppType } from "../../../services/providers/AppContext";
import {
  NodeBuilderContext,
  type NodeBuilderValues,
} from "../../../services/providers/NodeBuilderContext";
import type { FileItem } from "../../../ManagerAsset/types";

vi.mock("../../../ManagerAsset/FileManagerIframePicker", () => ({
  FileManagerIframePicker: ({
    open,
    onSelectFile,
    type,
  }: {
    open: boolean;
    onSelectFile: (file: FileItem) => void;
    type: string;
  }) =>
    open ? (
      <button
        type="button"
        data-testid={`pick-${type}`}
        onClick={() => onSelectFile({ url: `/media/sample.${type === "video" ? "mp4" : "jpg"}` } as FileItem)}
      >
        Choisir
      </button>
    ) : null,
}));

function createRootNode(content: NodeRootType["content"]): NodeRootType {
  return {
    id: "root-1",
    type: NODE_ROOT_TYPE,
    parent: null,
    content,
  };
}

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

function renderBackgroundSettings(
  node: NodeRootType,
  onChange = vi.fn()
) {
  const builder: NodeBuilderValues<NodeRootType> = {
    node,
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

  return { onChange, ...render(<BackgroundSettings />, { wrapper: Wrapper }) };
}

function getBackgroundTypeSelect() {
  const label = screen.getByText("Type d'arrière-plan");
  const group = label.parentElement;
  if (!group) throw new Error("Groupe type d'arrière-plan introuvable");
  return within(group).getByRole("combobox");
}

function getSelectByLabel(labelText: string) {
  const label = screen.getByText(labelText);
  const group = label.parentElement;
  if (!group) throw new Error(`Select ${labelText} introuvable`);
  return within(group).getByRole("combobox");
}

describe("BackgroundSettings", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.stubGlobal("location", {
      ...window.location,
      origin: "https://pagebuilder.test",
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("bascule vers un arrière-plan couleur", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderBackgroundSettings(
      createRootNode({ title: "", background: { type: "default" } }),
      onChange
    );

    await user.selectOptions(getBackgroundTypeSelect(), "color");
    await vi.advanceTimersByTimeAsync(500);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.objectContaining({
          background: { type: "color", color: "" },
        }),
      })
    );
  });

  it("met à jour la couleur", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderBackgroundSettings(
      createRootNode({ title: "", background: { type: "color", color: "#ffffff" } }),
      onChange
    );

    const colorInput = screen.getByPlaceholderText("ex: #ffffff, var(--background)");
    await user.clear(colorInput);
    await user.type(colorInput, "#112233");
    await vi.advanceTimersByTimeAsync(500);

    const lastCall = onChange.mock.calls.at(-1)?.[0] as NodeRootType;
    expect(lastCall.content.background).toEqual({ type: "color", color: "#112233" });
  });

  it("affiche et met à jour les champs image", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderBackgroundSettings(
      createRootNode({
        title: "",
        background: {
          type: "image",
          url: "",
          position: "center",
          size: "cover",
          repeat: "no-repeat",
        },
      }),
      onChange
    );

    const urlInput = screen.getByPlaceholderText("URL de l'image");
    await user.type(urlInput, "https://cdn.test/bg.jpg");
    await vi.advanceTimersByTimeAsync(500);

    const lastCall = onChange.mock.calls.at(-1)?.[0] as NodeRootType;
    expect(lastCall.content.background).toEqual(
      expect.objectContaining({
        type: "image",
        url: "https://cdn.test/bg.jpg",
      })
    );
  });

  it("met à jour position, taille et repeat d'une image", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderBackgroundSettings(
      createRootNode({
        title: "",
        background: {
          type: "image",
          url: "https://cdn.test/bg.jpg",
          position: "center",
          size: "cover",
          repeat: "no-repeat",
        },
      }),
      onChange
    );

    await user.selectOptions(getSelectByLabel("Position"), "top");
    await vi.advanceTimersByTimeAsync(500);
    expect(onChange.mock.calls.at(-1)?.[0].content.background).toEqual(
      expect.objectContaining({ position: "top" })
    );

    await user.selectOptions(getSelectByLabel("Taille"), "contain");
    await vi.advanceTimersByTimeAsync(500);
    expect(onChange.mock.calls.at(-1)?.[0].content.background).toEqual(
      expect.objectContaining({ size: "contain" })
    );

    await user.selectOptions(getSelectByLabel("Repeat"), "repeat-x");
    await vi.advanceTimersByTimeAsync(500);
    expect(onChange.mock.calls.at(-1)?.[0].content.background).toEqual(
      expect.objectContaining({ repeat: "repeat-x" })
    );
  });

  it("met à jour object fit et object position d'une vidéo", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderBackgroundSettings(
      createRootNode({
        title: "",
        background: {
          type: "video",
          url: "https://cdn.test/bg.mp4",
          objectFit: "cover",
          objectPosition: "center",
        },
      }),
      onChange
    );

    await user.selectOptions(getSelectByLabel("Object fit"), "contain");
    await vi.advanceTimersByTimeAsync(500);
    expect(onChange.mock.calls.at(-1)?.[0].content.background).toEqual(
      expect.objectContaining({ objectFit: "contain" })
    );

    await user.selectOptions(getSelectByLabel("Object position"), "bottom");
    await vi.advanceTimersByTimeAsync(500);
    expect(onChange.mock.calls.at(-1)?.[0].content.background).toEqual(
      expect.objectContaining({ objectPosition: "bottom" })
    );
  });

  it("sélectionne une image via le file manager", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderBackgroundSettings(
      createRootNode({
        title: "",
        background: {
          type: "image",
          url: "",
          position: "center",
          size: "cover",
          repeat: "no-repeat",
        },
      }),
      onChange
    );

    await user.click(screen.getByTitle("Choisir une image"));
    await user.click(screen.getByTestId("pick-image"));

    const lastCall = onChange.mock.calls.at(-1)?.[0] as NodeRootType;
    expect(lastCall.content.background).toEqual(
      expect.objectContaining({
        type: "image",
        url: "https://pagebuilder.test/media/sample.jpg",
      })
    );
  });

  it("affiche et met à jour les champs vidéo", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderBackgroundSettings(
      createRootNode({
        title: "",
        background: {
          type: "video",
          url: "",
          objectFit: "cover",
          objectPosition: "center",
        },
      }),
      onChange
    );

    const urlInput = screen.getByPlaceholderText("URL de la vidéo");
    await user.type(urlInput, "/media/loop.mp4");
    await vi.advanceTimersByTimeAsync(500);

    const lastCall = onChange.mock.calls.at(-1)?.[0] as NodeRootType;
    expect(lastCall.content.background).toEqual(
      expect.objectContaining({
        type: "video",
        url: "/media/loop.mp4",
      })
    );
  });

  it("sélectionne une vidéo et un poster via le file manager", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderBackgroundSettings(
      createRootNode({
        title: "",
        background: {
          type: "video",
          url: "",
          objectFit: "cover",
          objectPosition: "center",
        },
      }),
      onChange
    );

    await user.click(screen.getByTitle("Choisir une vidéo"));
    await user.click(screen.getByTestId("pick-video"));

    let lastCall = onChange.mock.calls.at(-1)?.[0] as NodeRootType;
    expect(lastCall.content.background).toEqual(
      expect.objectContaining({
        type: "video",
        url: "https://pagebuilder.test/media/sample.mp4",
      })
    );

    await user.click(screen.getByTitle("Choisir une image poster"));
    await user.click(screen.getByTestId("pick-image"));

    lastCall = onChange.mock.calls.at(-1)?.[0] as NodeRootType;
    expect(lastCall.content.background).toEqual(
      expect.objectContaining({
        type: "video",
        poster: "https://pagebuilder.test/media/sample.jpg",
      })
    );
  });
});
