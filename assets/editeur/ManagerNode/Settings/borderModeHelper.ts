import type { CSSProperties } from "react";

export type BorderMode = "unified" | "per-side";
export type BorderSide = "top" | "right" | "bottom" | "left";

type BorderParts = {
    width: string;
    style: string;
    color: string;
};

const SIDES: BorderSide[] = ["top", "right", "bottom", "left"];
const SIDE_KEYS: Record<BorderSide, keyof CSSProperties> = {
    top: "borderTop",
    right: "borderRight",
    bottom: "borderBottom",
    left: "borderLeft",
};

function toStr(value: unknown): string {
    if (value == null) {
        return "";
    }
    return String(value).trim();
}

function sideValues(style: CSSProperties | undefined): string[] {
    return SIDES.map((side) => toStr(style?.[SIDE_KEYS[side]]));
}

function buildShorthandFromSides(values: [string, string, string, string]): string {
    const [top, right, bottom, left] = values;

    if (top === right && right === bottom && bottom === left) {
        return top;
    }
    if (top === bottom && right === left) {
        return `${top} ${right}`.trim();
    }
    if (right === left) {
        return `${top} ${right} ${bottom}`.trim();
    }
    return `${top} ${right} ${bottom} ${left}`.trim();
}

export function buildUnifiedBorder(parts: BorderParts): string {
    return [parts.width, parts.style, parts.color].filter((part) => part !== "").join(" ").trim();
}

export function getUnifiedBorder(style: CSSProperties | undefined): string {
    const shorthand = toStr(style?.border);
    if (shorthand) {
        return shorthand;
    }
    const width = toStr(style?.borderWidth);
    const borderStyle = toStr(style?.borderStyle);
    const color = toStr(style?.borderColor);
    return buildUnifiedBorder({ width, style: borderStyle, color });
}

export function parseUnifiedBorder(value: string): BorderParts {
    const tokens = value.trim().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) {
        return { width: "", style: "", color: "" };
    }
    if (tokens.length === 1) {
        return { width: tokens[0], style: "", color: "" };
    }
    if (tokens.length === 2) {
        return { width: tokens[0], style: tokens[1], color: "" };
    }
    return {
        width: tokens[0],
        style: tokens[1],
        color: tokens.slice(2).join(" "),
    };
}

export function getUnifiedBorderParts(style: CSSProperties | undefined): BorderParts {
    const shorthand = toStr(style?.border);
    if (shorthand) {
        return parseUnifiedBorder(shorthand);
    }

    const width = toStr(style?.borderWidth);
    const borderStyle = toStr(style?.borderStyle);
    const color = toStr(style?.borderColor);
    if (width || borderStyle || color) {
        return { width, style: borderStyle, color };
    }

    const values = sideValues(style);
    if (!values.every((value) => value !== "")) {
        return { width: "", style: "", color: "" };
    }

    const partsBySide = values.map((value) => parseUnifiedBorder(value));
    return {
        width: buildShorthandFromSides(partsBySide.map((parts) => parts.width) as [string, string, string, string]),
        style: buildShorthandFromSides(partsBySide.map((parts) => parts.style) as [string, string, string, string]),
        color: buildShorthandFromSides(partsBySide.map((parts) => parts.color) as [string, string, string, string]),
    };
}

export function detectBorderMode(style: CSSProperties | undefined): BorderMode {
    if (toStr(style?.border)) {
        return "unified";
    }
    if (toStr(style?.borderWidth) || toStr(style?.borderStyle) || toStr(style?.borderColor)) {
        return "unified";
    }

    const values = sideValues(style);
    const defined = values.filter((value) => value !== "");

    if (defined.length === 0) {
        return "unified";
    }
    if (defined.length < 4) {
        return "per-side";
    }

    const first = defined[0];
    if (values.every((value) => value === first)) {
        return "unified";
    }
    return "per-side";
}

export function getPerSideBorderValue(style: CSSProperties | undefined, side: BorderSide): string {
    return toStr(style?.[SIDE_KEYS[side]]);
}

export function applyUnifiedBorderValue(style: CSSProperties | undefined, value: string): CSSProperties {
    const next: CSSProperties = { ...(style ?? {}) };

    delete next.borderTop;
    delete next.borderRight;
    delete next.borderBottom;
    delete next.borderLeft;
    delete next.borderWidth;
    delete next.borderStyle;
    delete next.borderColor;

    if (value.trim() === "") {
        delete next.border;
    } else {
        next.border = value;
    }

    return next;
}

export function applyPerSideBorderValue(
    style: CSSProperties | undefined,
    side: BorderSide,
    value: string,
): CSSProperties {
    const next: CSSProperties = { ...(style ?? {}) };
    const key = SIDE_KEYS[side];

    delete next.border;
    delete next.borderWidth;
    delete next.borderStyle;
    delete next.borderColor;

    if (value.trim() === "") {
        delete next[key];
    } else {
        (next as Record<string, string>)[key as string] = value;
    }

    return next;
}

export function expandUnifiedBorderToPerSide(style: CSSProperties | undefined): CSSProperties {
    const value = getUnifiedBorder(style);
    const next: CSSProperties = { ...(style ?? {}) };

    delete next.border;
    delete next.borderWidth;
    delete next.borderStyle;
    delete next.borderColor;

    if (value) {
        for (const side of SIDES) {
            const key = SIDE_KEYS[side];
            (next as Record<string, string>)[key as string] = value;
        }
    }

    return next;
}

export function collapsePerSideToUnified(style: CSSProperties | undefined): CSSProperties {
    const values = sideValues(style);

    if (values.some((value) => value === "")) {
        return { ...(style ?? {}) };
    }

    const first = values[0];
    if (values.every((value) => value === first)) {
        return applyUnifiedBorderValue(style, first);
    }

    const partsBySide = values.map((value) => parseUnifiedBorder(value));
    const next: CSSProperties = { ...(style ?? {}) };

    delete next.border;
    delete next.borderTop;
    delete next.borderRight;
    delete next.borderBottom;
    delete next.borderLeft;

    const widthShorthand = buildShorthandFromSides(
        partsBySide.map((parts) => parts.width) as [string, string, string, string],
    );
    const styleShorthand = buildShorthandFromSides(
        partsBySide.map((parts) => parts.style) as [string, string, string, string],
    );
    const colorShorthand = buildShorthandFromSides(
        partsBySide.map((parts) => parts.color) as [string, string, string, string],
    );

    if (widthShorthand.trim()) {
        next.borderWidth = widthShorthand;
    } else {
        delete next.borderWidth;
    }
    if (styleShorthand.trim()) {
        next.borderStyle = styleShorthand;
    } else {
        delete next.borderStyle;
    }
    if (colorShorthand.trim()) {
        next.borderColor = colorShorthand;
    } else {
        delete next.borderColor;
    }

    return next;
}

