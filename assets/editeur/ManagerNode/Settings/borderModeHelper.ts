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
    return {
        width: toStr(style?.borderWidth),
        style: toStr(style?.borderStyle),
        color: toStr(style?.borderColor),
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

