import { useEffect, useRef, useState } from "react";
import { Link2, Unlink } from "lucide-react";
import Form from "../../components/form";
import { Button } from "@/editeur/components/ui/button";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { useThemeStylePlaceholder } from "../../services/themeStyleHints";
import type { ThemeAwareStyleSettingsProps } from "./types";
import { SettingsSectionTitle } from "./SettingsSectionTitle";
import {
    applyPerSideValue,
    applyUnifiedValue,
    collapsePerSideToUnified,
    detectSpacingMode,
    expandUnifiedToPerSide,
    getPerSideValue,
    getUnifiedValue,
    type SpacingMode,
    type SpacingProperty,
    type SpacingSide,
} from "./spacingModeHelper";

const SIDES: { side: SpacingSide; label: string }[] = [
    { side: "top", label: "top" },
    { side: "bottom", label: "bottom" },
    { side: "left", label: "left" },
    { side: "right", label: "right" },
];

export type SpacingProperty2SettingsProps = ThemeAwareStyleSettingsProps & {
    property: SpacingProperty;
    title: string;
};

export function SpacingProperty2Settings({
    property,
    title,
    style,
    onChange,
    themeOverrideSelector,
}: SpacingProperty2SettingsProps) {
    const { node } = useNodeBuilderContext();
    const previousNodeId = useRef(node.id);
    const [mode, setMode] = useState<SpacingMode>(() => detectSpacingMode(style, property));

    useEffect(() => {
        if (previousNodeId.current === node.id) {
            return;
        }
        previousNodeId.current = node.id;
        setMode(detectSpacingMode(style, property));
    }, [node.id, property, style]);

    const unifiedPlaceholder = useThemeStylePlaceholder(themeOverrideSelector, property);
    const topPlaceholder = useThemeStylePlaceholder(themeOverrideSelector, `${property}-top`);
    const bottomPlaceholder = useThemeStylePlaceholder(themeOverrideSelector, `${property}-bottom`);
    const leftPlaceholder = useThemeStylePlaceholder(themeOverrideSelector, `${property}-left`);
    const rightPlaceholder = useThemeStylePlaceholder(themeOverrideSelector, `${property}-right`);

    const toggleMode = () => {
        if (mode === "unified") {
            onChange(expandUnifiedToPerSide(style, property));
            setMode("per-side");
            return;
        }

        const collapsed = collapsePerSideToUnified(style, property);
        if (collapsed !== style) {
            onChange(collapsed);
        }
        setMode("unified");
    };

    const unifiedValue = getUnifiedValue(style, property);

    return (
        <div className="flex flex-col gap-1 mb-2 mt-1">
            <div className="flex items-center gap-1">
                <SettingsSectionTitle className="flex-1">{title}</SettingsSectionTitle>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0 text-muted-foreground"
                    onClick={toggleMode}
                    title={mode === "unified" ? "Réglage par côté" : "Valeur unique pour tous les côtés"}
                    aria-label={mode === "unified" ? "Réglage par côté" : "Valeur unique pour tous les côtés"}
                >
                    {mode === "unified" ? <Link2 size={14} /> : <Unlink size={14} />}
                </Button>
            </div>

            {mode === "unified" ? (
                <Form.Group className="mb-0">
                    <Form.Label text="tous les côtés" className="text-foreground" />
                    <Form.Input
                        type="text"
                        value={unifiedValue}
                        onChange={(value) => onChange(applyUnifiedValue(style, property, value))}
                        placeholder={unifiedPlaceholder}
                        className="h-7 text-sm"
                    />
                </Form.Group>
            ) : (
                <>
                    <div className="grid grid-cols-2 gap-1">
                        {SIDES.slice(0, 2).map(({ side, label }) => (
                            <Form.Group key={side} className="mb-0">
                                <Form.Label text={label} className="text-foreground" />
                                <Form.Input
                                    type="text"
                                    value={getPerSideValue(style, property, side)}
                                    onChange={(value) => onChange(applyPerSideValue(style, property, side, value))}
                                    placeholder={
                                        side === "top"
                                            ? topPlaceholder
                                            : side === "bottom"
                                              ? bottomPlaceholder
                                              : side === "left"
                                                ? leftPlaceholder
                                                : rightPlaceholder
                                    }
                                    className="h-7 text-sm"
                                />
                            </Form.Group>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                        {SIDES.slice(2).map(({ side, label }) => (
                            <Form.Group key={side} className="mb-0">
                                <Form.Label text={label} className="text-foreground" />
                                <Form.Input
                                    type="text"
                                    value={getPerSideValue(style, property, side)}
                                    onChange={(value) => onChange(applyPerSideValue(style, property, side, value))}
                                    placeholder={
                                        side === "top"
                                            ? topPlaceholder
                                            : side === "bottom"
                                              ? bottomPlaceholder
                                              : side === "left"
                                                ? leftPlaceholder
                                                : rightPlaceholder
                                    }
                                    className="h-7 text-sm"
                                />
                            </Form.Group>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
