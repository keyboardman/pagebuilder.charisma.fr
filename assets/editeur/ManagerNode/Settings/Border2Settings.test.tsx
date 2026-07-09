import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React, { useState, type CSSProperties, type ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Border2Settings } from "./Border2Settings";
import { AppContext, type AppType } from "../../services/providers/AppContext";
import {
    NodeBuilderContext,
    type NodeBuilderValues,
} from "../../services/providers/NodeBuilderContext";
import { defaultParentProps, type NodeType } from "../../types/NodeType";

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
        fileManagerConfig: null,
        themeIcons: [],
        themeNodeOverrides: {},
        themeVars: {},
        pageBuilderApiBaseUrl: null,
    };
}

function renderBorderSettings(initialStyle: CSSProperties, onChange = vi.fn()) {
    const builder: NodeBuilderValues<NodeType> = {
        node: {
            id: "node-1",
            type: "node-text",
            parent: defaultParentProps,
            content: { text: "demo" },
        },
        drag: { ref: () => undefined, handleRef: () => undefined },
        onSelect: () => undefined,
        onDelete: () => undefined,
        onDuplicate: () => undefined,
        onChange: () => undefined,
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

    function Harness() {
        const [currentStyle, setCurrentStyle] = useState<CSSProperties>(initialStyle);
        return (
            <Border2Settings
                style={currentStyle}
                onChange={(nextStyle) => {
                    setCurrentStyle(nextStyle);
                    onChange(nextStyle);
                }}
            />
        );
    }

    return {
        onChange,
        ...render(<Harness />, { wrapper: Wrapper }),
    };
}

function getInputByLabel(labelText: string) {
    const label = screen.getByText(labelText);
    const group = label.parentElement;
    if (!group) {
        throw new Error(`Champ introuvable pour ${labelText}`);
    }
    return within(group).getByRole("textbox");
}

describe("Border2Settings", () => {
    beforeEach(() => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("permet une saisie uniquement sur border-bottom en mode par cote", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        renderBorderSettings({ border: "1px solid #000" }, onChange);

        await user.click(screen.getByRole("button", { name: "Réglage par côté" }));
        const bottomInput = getInputByLabel("bottom-width");
        await user.clear(bottomInput);
        await user.type(bottomInput, "2px");
        await vi.advanceTimersByTimeAsync(500);

        expect(onChange).toHaveBeenCalled();
        const lastCall = onChange.mock.calls.at(-1)?.[0] as CSSProperties;
        expect(lastCall.borderBottomWidth).toBe("2px");
        expect(lastCall.borderBottomStyle).toBe("solid");
        expect(lastCall.borderBottomColor).toBe("#000");
        expect(lastCall.borderBottom).toBeUndefined();
        expect(lastCall.border).toBeUndefined();
    });

    it("affiche les 4 groupes de champs en mode par cote", async () => {
        const user = userEvent.setup();
        renderBorderSettings({ border: "1px solid #000" });

        await user.click(screen.getByRole("button", { name: "Réglage par côté" }));

        expect(screen.getByText("top-width")).toBeTruthy();
        expect(screen.getByText("top-style")).toBeTruthy();
        expect(screen.getByText("top-color")).toBeTruthy();

        expect(screen.getByText("right-width")).toBeTruthy();
        expect(screen.getByText("right-style")).toBeTruthy();
        expect(screen.getByText("right-color")).toBeTruthy();

        expect(screen.getByText("bottom-width")).toBeTruthy();
        expect(screen.getByText("bottom-style")).toBeTruthy();
        expect(screen.getByText("bottom-color")).toBeTruthy();

        expect(screen.getByText("left-width")).toBeTruthy();
        expect(screen.getByText("left-style")).toBeTruthy();
        expect(screen.getByText("left-color")).toBeTruthy();
    });

    it("met a jour la bordure globale en mode unifie", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        renderBorderSettings({}, onChange);

        expect(screen.queryByText("border (aperçu)")).toBeNull();

        const widthInput = getInputByLabel("border-width");
        await user.type(widthInput, "1px");
        await vi.advanceTimersByTimeAsync(500);

        const styleLabel = screen.getByText("border-style");
        const styleGroup = styleLabel.parentElement;
        if (!styleGroup) {
            throw new Error("Select border-style introuvable");
        }
        const styleSelect = within(styleGroup).getByRole("combobox");
        await user.selectOptions(styleSelect, "solid");
        await vi.advanceTimersByTimeAsync(500);

        const colorInput = getInputByLabel("border-color");
        await user.type(colorInput, "#000000");
        await vi.advanceTimersByTimeAsync(500);

        const lastCall = onChange.mock.calls.at(-1)?.[0] as CSSProperties;
        expect(lastCall.borderTopColor).toBe("#000000");
        expect(lastCall.borderRightColor).toBe("#000000");
        expect(lastCall.borderBottomColor).toBe("#000000");
        expect(lastCall.borderLeftColor).toBe("#000000");
        expect(lastCall.borderTopWidth).toBe("1px");
        expect(lastCall.borderTopStyle).toBe("solid");
        expect(lastCall.border).toBeUndefined();
        expect(lastCall.borderColor).toBeUndefined();
        expect(lastCall.borderTop).toBeUndefined();
        expect(lastCall.borderBottom).toBeUndefined();
    });

    it("ne remplit pas border-width quand seule border-color est saisie", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        renderBorderSettings({}, onChange);

        const colorInput = getInputByLabel("border-color");
        await user.type(colorInput, "blue");
        await vi.advanceTimersByTimeAsync(500);

        const lastCall = onChange.mock.calls.at(-1)?.[0] as CSSProperties;
        expect(lastCall.borderTopColor).toBe("blue");
        expect(lastCall.borderRightColor).toBe("blue");
        expect(lastCall.borderBottomColor).toBe("blue");
        expect(lastCall.borderLeftColor).toBe("blue");
        expect(lastCall.borderTopWidth).toBeUndefined();
        expect(lastCall.borderWidth).toBeUndefined();
        expect(lastCall.border).toBeUndefined();

        expect(getInputByLabel("border-width")).toHaveValue("");
        expect(getInputByLabel("border-color")).toHaveValue("blue");
    });

    it("ne remplit pas border-width quand seul border-style est selectionne", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        renderBorderSettings({}, onChange);

        const styleLabel = screen.getByText("border-style");
        const styleGroup = styleLabel.parentElement;
        if (!styleGroup) {
            throw new Error("Select border-style introuvable");
        }
        const styleSelect = within(styleGroup).getByRole("combobox");
        await user.selectOptions(styleSelect, "solid");
        await vi.advanceTimersByTimeAsync(500);

        const lastCall = onChange.mock.calls.at(-1)?.[0] as CSSProperties;
        expect(lastCall.borderTopStyle).toBe("solid");
        expect(lastCall.borderTopWidth).toBeUndefined();
        expect(lastCall.borderWidth).toBeUndefined();

        expect(getInputByLabel("border-width")).toHaveValue("");
    });
});

