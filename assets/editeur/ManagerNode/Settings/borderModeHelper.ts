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
const SIDE_WIDTH_KEYS: Record<BorderSide, keyof CSSProperties> = {
    top: "borderTopWidth",
    right: "borderRightWidth",
    bottom: "borderBottomWidth",
    left: "borderLeftWidth",
};
const SIDE_STYLE_KEYS: Record<BorderSide, keyof CSSProperties> = {
    top: "borderTopStyle",
    right: "borderRightStyle",
    bottom: "borderBottomStyle",
    left: "borderLeftStyle",
};
const SIDE_COLOR_KEYS: Record<BorderSide, keyof CSSProperties> = {
    top: "borderTopColor",
    right: "borderRightColor",
    bottom: "borderBottomColor",
    left: "borderLeftColor",
};

const BORDER_STYLES = new Set([
    "none", "hidden", "dotted", "dashed", "solid", "double", "groove", "ridge", "inset", "outset",
]);
const BORDER_WIDTH_KEYWORDS = new Set(["thin", "medium", "thick"]);

function isBorderWidthToken(token: string): boolean {
    if (BORDER_WIDTH_KEYWORDS.has(token.toLowerCase())) {
        return true;
    }
    return /^-?\d*\.?\d+(px|em|rem|%|vh|vw|ch|ex|cm|mm|in|pt|pc)?$/i.test(token);
}

function isBorderStyleToken(token: string): boolean {
    return BORDER_STYLES.has(token.toLowerCase());
}

function classifySingleBorderToken(token: string): BorderParts {
    if (isBorderStyleToken(token)) {
        return { width: "", style: token, color: "" };
    }
    if (isBorderWidthToken(token)) {
        return { width: token, style: "", color: "" };
    }
    return { width: "", style: "", color: token };
}

function toStr(value: unknown): string {
    if (value == null) {
        return "";
    }
    return String(value).trim();
}

function sideValues(style: CSSProperties | undefined): string[] {
    return SIDES.map((side) => toStr(style?.[SIDE_KEYS[side]]));
}

function getSideLonghandValues(
    style: CSSProperties | undefined,
    keys: Record<BorderSide, keyof CSSProperties>,
): [string, string, string, string] {
    return SIDES.map((side) => toStr(style?.[keys[side]])) as [string, string, string, string];
}

function hasAnySideLonghand(style: CSSProperties | undefined): boolean {
    return SIDES.some(
        (side) =>
            toStr(style?.[SIDE_WIDTH_KEYS[side]]) !== ""
            || toStr(style?.[SIDE_STYLE_KEYS[side]]) !== ""
            || toStr(style?.[SIDE_COLOR_KEYS[side]]) !== "",
    );
}

function clearAllBorderProperties(next: CSSProperties): void {
    delete next.border;
    delete next.borderWidth;
    delete next.borderStyle;
    delete next.borderColor;
    for (const side of SIDES) {
        delete next[SIDE_KEYS[side]];
        delete next[SIDE_WIDTH_KEYS[side]];
        delete next[SIDE_STYLE_KEYS[side]];
        delete next[SIDE_COLOR_KEYS[side]];
    }
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

function aggregateLonghandValues(values: [string, string, string, string]): string {
    const defined = values.filter((value) => value !== "");
    if (defined.length === 0) {
        return "";
    }
    if (defined.every((value) => value === defined[0])) {
        return defined[0];
    }
    if (values.every((value) => value !== "")) {
        return buildShorthandFromSides(values);
    }
    return "";
}

function readSideLonghandParts(style: CSSProperties | undefined): BorderParts | null {
    if (!hasAnySideLonghand(style)) {
        return null;
    }

    return {
        width: aggregateLonghandValues(getSideLonghandValues(style, SIDE_WIDTH_KEYS)),
        style: aggregateLonghandValues(getSideLonghandValues(style, SIDE_STYLE_KEYS)),
        color: aggregateLonghandValues(getSideLonghandValues(style, SIDE_COLOR_KEYS)),
    };
}

function sidesHaveDifferentLonghands(style: CSSProperties | undefined): boolean {
    for (const keys of [SIDE_WIDTH_KEYS, SIDE_STYLE_KEYS, SIDE_COLOR_KEYS]) {
        const values = getSideLonghandValues(style, keys);
        const defined = values.filter((value) => value !== "");
        if (defined.length === 0) {
            continue;
        }
        if (new Set(defined).size > 1) {
            return true;
        }
        if (defined.length < 4) {
            return true;
        }
    }
    return false;
}

function migrateSideShorthandsToLonghands(style: CSSProperties | undefined): CSSProperties {
    const next: CSSProperties = { ...(style ?? {}) };
    clearAllBorderProperties(next);

    for (const side of SIDES) {
        const sideParts = parseUnifiedBorder(toStr(style?.[SIDE_KEYS[side]]));
        setOrDeleteLonghand(next, SIDE_WIDTH_KEYS[side], sideParts.width);
        setOrDeleteLonghand(next, SIDE_STYLE_KEYS[side], sideParts.style);
        setOrDeleteLonghand(next, SIDE_COLOR_KEYS[side], sideParts.color);
    }

    return next;
}

export function buildUnifiedBorder(parts: BorderParts): string {
    return [parts.width, parts.style, parts.color].filter((part) => part !== "").join(" ").trim();
}

export function getUnifiedBorder(style: CSSProperties | undefined): string {
    const shorthand = toStr(style?.border);
    if (shorthand) {
        return shorthand;
    }
    const parts = getUnifiedBorderParts(style);
    return buildUnifiedBorder(parts);
}

export function parseUnifiedBorder(value: string): BorderParts {
    const tokens = value.trim().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) {
        return { width: "", style: "", color: "" };
    }
    if (tokens.length === 1) {
        return classifySingleBorderToken(tokens[0]);
    }
    if (tokens.length === 2) {
        const [a, b] = tokens;
        if (isBorderWidthToken(a) && isBorderStyleToken(b)) {
            return { width: a, style: b, color: "" };
        }
        if (isBorderStyleToken(a) && isBorderWidthToken(b)) {
            return { width: b, style: a, color: "" };
        }
        if (isBorderWidthToken(a)) {
            return { width: a, style: "", color: b };
        }
        if (isBorderWidthToken(b)) {
            return { width: b, style: "", color: a };
        }
        if (isBorderStyleToken(a)) {
            return { width: "", style: a, color: b };
        }
        if (isBorderStyleToken(b)) {
            return { width: "", style: b, color: a };
        }
        return { width: a, style: b, color: "" };
    }
    return {
        width: tokens[0],
        style: tokens[1],
        color: tokens.slice(2).join(" "),
    };
}

export function getUnifiedBorderParts(style: CSSProperties | undefined): BorderParts {
    const fromSideLonghands = readSideLonghandParts(style);
    if (fromSideLonghands) {
        return fromSideLonghands;
    }

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
    if (sidesHaveDifferentLonghands(style)) {
        return "per-side";
    }

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

export function getPerSideBorderParts(style: CSSProperties | undefined, side: BorderSide): BorderParts {
    const width = toStr(style?.[SIDE_WIDTH_KEYS[side]]);
    const borderStyle = toStr(style?.[SIDE_STYLE_KEYS[side]]);
    const color = toStr(style?.[SIDE_COLOR_KEYS[side]]);
    if (width || borderStyle || color) {
        return { width, style: borderStyle, color };
    }
    return parseUnifiedBorder(getPerSideBorderValue(style, side));
}

function setOrDeleteLonghand(next: CSSProperties, key: keyof CSSProperties, value: string): void {
    if (value.trim()) {
        (next as Record<string, string>)[key as string] = value;
    } else {
        delete next[key];
    }
}

export function applyUnifiedBorderParts(style: CSSProperties | undefined, parts: BorderParts): CSSProperties {
    const next: CSSProperties = { ...(style ?? {}) };
    clearAllBorderProperties(next);

    for (const side of SIDES) {
        setOrDeleteLonghand(next, SIDE_WIDTH_KEYS[side], parts.width);
        setOrDeleteLonghand(next, SIDE_STYLE_KEYS[side], parts.style);
        setOrDeleteLonghand(next, SIDE_COLOR_KEYS[side], parts.color);
    }

    return next;
}

export function applyPerSideBorderParts(
    style: CSSProperties | undefined,
    side: BorderSide,
    parts: BorderParts,
): CSSProperties {
    const next: CSSProperties = { ...(style ?? {}) };

    delete next.border;
    delete next.borderWidth;
    delete next.borderStyle;
    delete next.borderColor;
    delete next[SIDE_KEYS[side]];

    setOrDeleteLonghand(next, SIDE_WIDTH_KEYS[side], parts.width);
    setOrDeleteLonghand(next, SIDE_STYLE_KEYS[side], parts.style);
    setOrDeleteLonghand(next, SIDE_COLOR_KEYS[side], parts.color);

    return next;
}

export function applyUnifiedBorderValue(style: CSSProperties | undefined, value: string): CSSProperties {
    return applyUnifiedBorderParts(style, parseUnifiedBorder(value));
}

export function applyPerSideBorderValue(
    style: CSSProperties | undefined,
    side: BorderSide,
    value: string,
): CSSProperties {
    return applyPerSideBorderParts(style, side, parseUnifiedBorder(value));
}

export function expandUnifiedBorderToPerSide(style: CSSProperties | undefined): CSSProperties {
    const parts = getUnifiedBorderParts(style);
    return applyUnifiedBorderParts(style, parts);
}

export function collapsePerSideToUnified(style: CSSProperties | undefined): CSSProperties {
    const values = sideValues(style);
    if (values.some((value) => value !== "")) {
        return migrateSideShorthandsToLonghands(style);
    }

    if (hasAnySideLonghand(style)) {
        return { ...(style ?? {}) };
    }

    const parts = getUnifiedBorderParts(style);
    return applyUnifiedBorderParts(style, parts);
}
