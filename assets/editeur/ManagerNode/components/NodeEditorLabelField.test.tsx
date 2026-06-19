import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createTestNode } from "../../../test/nodeFixtures";
import { renderWithNodeBuilder } from "../../../test/renderWithNodeBuilder";

vi.mock("../NodeImage", () => ({
  NODE_IMAGE_TYPE: "node-image",
}));

vi.mock("../NodeVideo", () => ({
  NODE_VIDEO_TYPE: "node-video",
}));

vi.mock("../Settings", async () => {
  const { Base2Settings } = await import("../Settings/Base2Settings");
  return { Base2Settings };
});

vi.mock("../../utils/nodeLabel", () => ({
  getNodeTypeLabel: (node: { type: string }) => {
    if (node.type === "node-image") return "Image";
    if (node.type === "node-text") return "Text";
    return node.type.replace(/^node-/, "");
  },
}));

import NodeEditorLabelField from "./NodeEditorLabelField";

const NODE_IMAGE_TYPE = "node-image";

describe("NodeEditorLabelField", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("affiche le libellé de type comme placeholder", () => {
    const node = createTestNode({ type: NODE_IMAGE_TYPE });
    renderWithNodeBuilder(<NodeEditorLabelField />, node);

    expect(screen.getByPlaceholderText("Image")).toBeInTheDocument();
    expect(screen.getByText(/Type : Image/)).toBeInTheDocument();
  });

  it("met à jour editorLabel via onChange après debounce", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const node = createTestNode({ type: "node-text" });
    const onChange = vi.fn();
    renderWithNodeBuilder(<NodeEditorLabelField />, node, { onChange });

    await user.type(screen.getByPlaceholderText("Text"), "Bannière");

    await waitFor(() => {
      expect(onChange).toHaveBeenCalled();
    });

    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1]?.[0];
    expect(lastCall.editorLabel).toBe("Bannière");
  });

  it("efface editorLabel quand la saisie est vide", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const node = createTestNode({ type: "node-text", editorLabel: "Ancien" });
    const onChange = vi.fn();
    renderWithNodeBuilder(<NodeEditorLabelField />, node, { onChange });

    const input = screen.getByDisplayValue("Ancien");
    await user.clear(input);

    await waitFor(() => {
      expect(onChange).toHaveBeenCalled();
    });

    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1]?.[0];
    expect(lastCall.editorLabel).toBeUndefined();
  });

  it("affiche Base2Settings pour les nœuds image et vidéo", () => {
    const node = createTestNode({ type: NODE_IMAGE_TYPE });
    renderWithNodeBuilder(<NodeEditorLabelField />, node);

    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("Classe")).toBeInTheDocument();
  });
});
