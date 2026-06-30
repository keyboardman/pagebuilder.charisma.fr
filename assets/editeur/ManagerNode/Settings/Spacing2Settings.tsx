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

export type Spacing2SettingsProps = ThemeAwareStyleSettingsProps;

const SIDES: { side: SpacingSide; label: string }[] = [
    { side: "top", label: "top" },
    { side: "bottom", label: "bottom" },
    { side: "left", label: "left" },
    { side: "right", label: "right" },
];

type SpacingSectionProps = {
    property: SpacingProperty;
    title: string;
    mode: SpacingMode;
    style: React.CSSProperties;
    onChange: (style: React.CSSProperties) => void;
    onToggleMode: () => void;
    unifiedPlaceholder?: string;
    sidePlaceholders: Record<SpacingSide, string | undefined>;
};

function SpacingSection({
    property,
    title,
    mode,
    style,
    onChange,
    onToggleMode,
    unifiedPlaceholder,
    sidePlaceholders,
}: SpacingSectionProps) {
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
                    onClick={onToggleMode}
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
                                    placeholder={sidePlaceholders[side]}
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
                                    placeholder={sidePlaceholders[side]}
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

export function Spacing2Settings({ style, onChange, themeOverrideSelector }: Spacing2SettingsProps) {
    const { node } = useNodeBuilderContext();
    const previousNodeId = useRef(node.id);

    const [marginMode, setMarginMode] = useState<SpacingMode>(() => detectSpacingMode(style, "margin"));
    const [paddingMode, setPaddingMode] = useState<SpacingMode>(() => detectSpacingMode(style, "padding"));

    useEffect(() => {
        if (previousNodeId.current === node.id) {
            return;
        }
        previousNodeId.current = node.id;
        setMarginMode(detectSpacingMode(style, "margin"));
        setPaddingMode(detectSpacingMode(style, "padding"));
    }, [node.id, style]);

    const marginUnifiedPlaceholder = useThemeStylePlaceholder(themeOverrideSelector, "margin");
    const paddingUnifiedPlaceholder = useThemeStylePlaceholder(themeOverrideSelector, "padding");
    const marginTopPlaceholder = useThemeStylePlaceholder(themeOverrideSelector, "margin-top");
    const marginBottomPlaceholder = useThemeStylePlaceholder(themeOverrideSelector, "margin-bottom");
    const marginLeftPlaceholder = useThemeStylePlaceholder(themeOverrideSelector, "margin-left");
    const marginRightPlaceholder = useThemeStylePlaceholder(themeOverrideSelector, "margin-right");
    const paddingTopPlaceholder = useThemeStylePlaceholder(themeOverrideSelector, "padding-top");
    const paddingBottomPlaceholder = useThemeStylePlaceholder(themeOverrideSelector, "padding-bottom");
    const paddingLeftPlaceholder = useThemeStylePlaceholder(themeOverrideSelector, "padding-left");
    const paddingRightPlaceholder = useThemeStylePlaceholder(themeOverrideSelector, "padding-right");

    const toggleMode = (property: SpacingProperty, currentMode: SpacingMode, setMode: (mode: SpacingMode) => void) => {
        if (currentMode === "unified") {
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

    return (
        <>
            <SpacingSection
                property="margin"
                title="Margin"
                mode={marginMode}
                style={style}
                onChange={onChange}
                onToggleMode={() => toggleMode("margin", marginMode, setMarginMode)}
                unifiedPlaceholder={marginUnifiedPlaceholder}
                sidePlaceholders={{
                    top: marginTopPlaceholder,
                    right: marginRightPlaceholder,
                    bottom: marginBottomPlaceholder,
                    left: marginLeftPlaceholder,
                }}
            />
            <SpacingSection
                property="padding"
                title="Padding"
                mode={paddingMode}
                style={style}
                onChange={onChange}
                onToggleMode={() => toggleMode("padding", paddingMode, setPaddingMode)}
                unifiedPlaceholder={paddingUnifiedPlaceholder}
                sidePlaceholders={{
                    top: paddingTopPlaceholder,
                    right: paddingRightPlaceholder,
                    bottom: paddingBottomPlaceholder,
                    left: paddingLeftPlaceholder,
                }}
            />
        </>
    );
}
