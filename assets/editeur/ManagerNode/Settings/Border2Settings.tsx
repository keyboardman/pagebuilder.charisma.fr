import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link2, Unlink } from "lucide-react";
import Form from "../../components/form";
import { Button } from "@/editeur/components/ui/button";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { useThemeStylePlaceholder } from "../../services/themeStyleHints";
import type { ThemeAwareStyleSettingsProps } from "./types";
import { SettingsSectionTitle } from "./SettingsSectionTitle";
import {
    applyPerSideBorderValue,
    applyUnifiedBorderValue,
    detectBorderMode,
    expandUnifiedBorderToPerSide,
    getPerSideBorderValue,
    parseUnifiedBorder,
    getUnifiedBorderParts,
    type BorderMode,
    type BorderSide,
} from "./borderModeHelper";

export type Border2SettingsProps = ThemeAwareStyleSettingsProps;

const SIDES: { side: BorderSide; label: string }[] = [
    { side: "top", label: "top" },
    { side: "right", label: "right" },
    { side: "bottom", label: "bottom" },
    { side: "left", label: "left" },
];

function updateUnifiedBorderPart(
    style: CSSProperties | undefined,
    field: "width" | "style" | "color",
    value: string,
): CSSProperties {
    const nextParts = getUnifiedBorderParts(style);
    nextParts[field] = value;
    const nextValue = [nextParts.width, nextParts.style, nextParts.color]
        .filter((part) => part.trim() !== "")
        .join(" ")
        .trim();
    return applyUnifiedBorderValue(style, nextValue);
}

function updatePerSideBorderPart(
    style: CSSProperties | undefined,
    side: BorderSide,
    field: "width" | "style" | "color",
    value: string,
): CSSProperties {
    const current = parseUnifiedBorder(getPerSideBorderValue(style, side));
    current[field] = value;
    const nextValue = [current.width, current.style, current.color]
        .filter((part) => part.trim() !== "")
        .join(" ")
        .trim();
    return applyPerSideBorderValue(style, side, nextValue);
}

export function Border2Settings({ style, onChange, themeOverrideSelector }: Border2SettingsProps) {
    const { node } = useNodeBuilderContext();
    const previousNodeId = useRef(node.id);

    const [mode, setMode] = useState<BorderMode>(() => detectBorderMode(style));

    useEffect(() => {
        if (previousNodeId.current === node.id) {
            return;
        }
        previousNodeId.current = node.id;
        setMode(detectBorderMode(style));
    }, [node.id, style]);

    const borderColorPlaceholder = useThemeStylePlaceholder(themeOverrideSelector, "border-color");
    const borderWidthPlaceholder = useThemeStylePlaceholder(themeOverrideSelector, "border-width");
    const borderStyleLabel = useThemeStylePlaceholder(themeOverrideSelector, "border-style") ?? "...";
    const borderRadiusPlaceholder = useThemeStylePlaceholder(themeOverrideSelector, "border-radius");
    const borderTopPlaceholder = useThemeStylePlaceholder(themeOverrideSelector, "border-top");
    const borderRightPlaceholder = useThemeStylePlaceholder(themeOverrideSelector, "border-right");
    const borderBottomPlaceholder = useThemeStylePlaceholder(themeOverrideSelector, "border-bottom");
    const borderLeftPlaceholder = useThemeStylePlaceholder(themeOverrideSelector, "border-left");
    const borderTopWidthPlaceholder = useThemeStylePlaceholder(themeOverrideSelector, "border-top-width");
    const borderRightWidthPlaceholder = useThemeStylePlaceholder(themeOverrideSelector, "border-right-width");
    const borderBottomWidthPlaceholder = useThemeStylePlaceholder(themeOverrideSelector, "border-bottom-width");
    const borderLeftWidthPlaceholder = useThemeStylePlaceholder(themeOverrideSelector, "border-left-width");
    const borderTopStyleLabel = useThemeStylePlaceholder(themeOverrideSelector, "border-top-style") ?? borderStyleLabel;
    const borderRightStyleLabel = useThemeStylePlaceholder(themeOverrideSelector, "border-right-style") ?? borderStyleLabel;
    const borderBottomStyleLabel = useThemeStylePlaceholder(themeOverrideSelector, "border-bottom-style") ?? borderStyleLabel;
    const borderLeftStyleLabel = useThemeStylePlaceholder(themeOverrideSelector, "border-left-style") ?? borderStyleLabel;
    const borderTopColorPlaceholder = useThemeStylePlaceholder(themeOverrideSelector, "border-top-color");
    const borderRightColorPlaceholder = useThemeStylePlaceholder(themeOverrideSelector, "border-right-color");
    const borderBottomColorPlaceholder = useThemeStylePlaceholder(themeOverrideSelector, "border-bottom-color");
    const borderLeftColorPlaceholder = useThemeStylePlaceholder(themeOverrideSelector, "border-left-color");

    const unifiedParts = getUnifiedBorderParts(style);

    const toggleMode = () => {
        if (mode === "unified") {
            onChange(expandUnifiedBorderToPerSide(style));
            setMode("per-side");
            return;
        }
        setMode("unified");
    };

    return (
        <div className="flex flex-col gap-1 mb-2 mt-1">
            <div className="flex items-center gap-1">
                <SettingsSectionTitle className="flex-1">Border</SettingsSectionTitle>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-6 shrink-0 px-2 text-xs gap-1 text-foreground"
                    onClick={toggleMode}
                    title={mode === "unified" ? "Réglage par côté" : "Valeur unique pour tous les côtés"}
                    aria-label={mode === "unified" ? "Réglage par côté" : "Valeur unique pour tous les côtés"}
                >
                    {mode === "unified" ? <Link2 size={12} /> : <Unlink size={12} />}
                    <span>{mode === "unified" ? "Tous côtés" : "Par côté"}</span>
                </Button>
            </div>

            {mode === "unified" ? (
                <>
                    <div className="flex flex-1">
                        <Form.Group className="mb-0">
                            <Form.Label text="border-color" className="text-foreground" />
                            <Form.InputColor
                                type="text"
                                value={unifiedParts.color}
                                onChange={(value) => onChange(updateUnifiedBorderPart(style, "color", value))}
                                placeholder={borderColorPlaceholder}
                                className="h-7 text-sm"
                            />
                        </Form.Group>
                        <Form.Group className="mb-0">
                            <Form.Label text="border-width" className="text-foreground" />
                            <Form.Input
                                type="text"
                                value={unifiedParts.width}
                                onChange={(value) => onChange(updateUnifiedBorderPart(style, "width", value))}
                                placeholder={borderWidthPlaceholder}
                                className="h-7 text-sm"
                            />
                        </Form.Group>
                    </div>
                    <div className="flex flex-1">
                        <Form.Group className="mb-0">
                            <Form.Label text="border-style" className="text-foreground" />
                            <Form.Select
                                options={[
                                    { label: borderStyleLabel, value: "" },
                                    { label: "solid", value: "solid" },
                                    { label: "dashed", value: "dashed" },
                                    { label: "dotted", value: "dotted" },
                                    { label: "double", value: "double" },
                                ]}
                                value={unifiedParts.style}
                                onChange={(value) => onChange(updateUnifiedBorderPart(style, "style", value))}
                                className="h-7 text-sm"
                            />
                        </Form.Group>
                    </div>
                </>
            ) : (
                <>
                    {SIDES.map(({ side, label }) => {
                        const sideParts = parseUnifiedBorder(getPerSideBorderValue(style, side));
                        const widthPlaceholder =
                            side === "top"
                                ? borderTopWidthPlaceholder ?? borderTopPlaceholder
                                : side === "right"
                                    ? borderRightWidthPlaceholder ?? borderRightPlaceholder
                                    : side === "bottom"
                                        ? borderBottomWidthPlaceholder ?? borderBottomPlaceholder
                                        : borderLeftWidthPlaceholder ?? borderLeftPlaceholder;
                        const styleHint =
                            side === "top"
                                ? borderTopStyleLabel
                                : side === "right"
                                    ? borderRightStyleLabel
                                    : side === "bottom"
                                        ? borderBottomStyleLabel
                                        : borderLeftStyleLabel;
                        const colorPlaceholder =
                            side === "top"
                                ? borderTopColorPlaceholder ?? borderTopPlaceholder
                                : side === "right"
                                    ? borderRightColorPlaceholder ?? borderRightPlaceholder
                                    : side === "bottom"
                                        ? borderBottomColorPlaceholder ?? borderBottomPlaceholder
                                        : borderLeftColorPlaceholder ?? borderLeftPlaceholder;

                        return (
                            <div key={side} className="grid grid-cols-3 gap-1">
                                <Form.Group className="mb-0">
                                    <Form.Label text={`${label}-width`} className="text-foreground" />
                                    <Form.Input
                                        type="text"
                                        value={sideParts.width}
                                        onChange={(value) => onChange(updatePerSideBorderPart(style, side, "width", value))}
                                        placeholder={widthPlaceholder}
                                        className="h-7 text-sm"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-0">
                                    <Form.Label text={`${label}-style`} className="text-foreground" />
                                    <Form.Select
                                        options={[
                                            { label: styleHint, value: "" },
                                            { label: "solid", value: "solid" },
                                            { label: "dashed", value: "dashed" },
                                            { label: "dotted", value: "dotted" },
                                            { label: "double", value: "double" },
                                        ]}
                                        value={sideParts.style}
                                        onChange={(value) => onChange(updatePerSideBorderPart(style, side, "style", value))}
                                        className="h-7 text-sm"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-0">
                                    <Form.Label text={`${label}-color`} className="text-foreground" />
                                    <Form.InputColor
                                        type="text"
                                        value={sideParts.color}
                                        onChange={(value) => onChange(updatePerSideBorderPart(style, side, "color", value))}
                                        placeholder={colorPlaceholder}
                                        className="h-7 text-sm"
                                    />
                                </Form.Group>
                            </div>
                        );
                    })}
                </>
            )}

            <div className="flex flex-1">
                <Form.Group className="mb-0">
                    <Form.Label text="border-radius" className="text-foreground" />
                    <Form.Input
                        type="text"
                        value={style?.borderRadius?.toString() ?? ""}
                        onChange={(value) => onChange({ ...style, borderRadius: value })}
                        placeholder={borderRadiusPlaceholder}
                        className="h-7 text-sm"
                    />
                </Form.Group>
            </div>
        </div>
    );
}
