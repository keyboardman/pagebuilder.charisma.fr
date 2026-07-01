import type { CSSProperties } from "react";

export type SpacingProperty = "margin" | "padding";
export type SpacingMode = "unified" | "per-side";
export type SpacingSide = "top" | "right" | "bottom" | "left";

const SIDES: SpacingSide[] = ["top", "right", "bottom", "left"];

const LONGHAND_KEYS: Record<SpacingProperty, Record<SpacingSide, keyof CSSProperties>> = {
    margin: {
        top: "marginTop",
        right: "marginRight",
        bottom: "marginBottom",
        left: "marginLeft",
    },
    padding: {
        top: "paddingTop",
        right: "paddingRight",
        bottom: "paddingBottom",
        left: "paddingLeft",
    },
};

function toStr(value: unknown): string {
    if (value == null) {
        return "";
    }
    return String(value).trim();
}

function longhandKeys(property: SpacingProperty): (keyof CSSProperties)[] {
    return SIDES.map((side) => LONGHAND_KEYS[property][side]);
}

/** Découpe une valeur shorthand CSS (margin/padding) en tokens, sans casser calc() etc. */
function tokenizeShorthand(value: string): string[] {
    const tokens: string[] = [];
    let current = "";
    let depth = 0;

    for (const char of value.trim()) {
        if (char === "(") {
            depth++;
        } else if (char === ")") {
            depth--;
        } else if (char === " " && depth === 0) {
            if (current) {
                tokens.push(current);
                current = "";
            }
            continue;
        }
        current += char;
    }

    if (current) {
        tokens.push(current);
    }

    return tokens;
}

/** Parse une shorthand margin/padding en valeurs top, right, bottom, left. */
export function parseShorthandSpacing(value: string): Record<SpacingSide, string> {
    const tokens = tokenizeShorthand(value);

    if (tokens.length === 0) {
        return { top: "", right: "", bottom: "", left: "" };
    }
    if (tokens.length === 1) {
        return { top: tokens[0], right: tokens[0], bottom: tokens[0], left: tokens[0] };
    }
    if (tokens.length === 2) {
        return { top: tokens[0], right: tokens[1], bottom: tokens[0], left: tokens[1] };
    }
    if (tokens.length === 3) {
        return { top: tokens[0], right: tokens[1], bottom: tokens[2], left: tokens[1] };
    }

    return { top: tokens[0], right: tokens[1], bottom: tokens[2], left: tokens[3] };
}

/** Construit la shorthand CSS minimale à partir des quatre côtés. */
export function buildShorthandSpacing(sides: Record<SpacingSide, string>): string {
    const { top, right, bottom, left } = sides;

    if (top === right && right === bottom && bottom === left) {
        return top;
    }
    if (top === bottom && right === left) {
        return `${top} ${right}`;
    }
    if (right === left) {
        return `${top} ${right} ${bottom}`;
    }
    return `${top} ${right} ${bottom} ${left}`;
}

function sideValues(style: CSSProperties | undefined, property: SpacingProperty): string[] {
    return SIDES.map((side) => toStr(style?.[LONGHAND_KEYS[property][side]]));
}

export function detectSpacingMode(style: CSSProperties | undefined, property: SpacingProperty): SpacingMode {
    if (toStr(style?.[property])) {
        return "unified";
    }

    const values = sideValues(style, property);
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

export function getUnifiedValue(style: CSSProperties | undefined, property: SpacingProperty): string {
    const shorthand = toStr(style?.[property]);
    if (shorthand) {
        return shorthand;
    }

    const values = sideValues(style, property);
    if (values.every((value) => value !== "")) {
        if (new Set(values).size === 1) {
            return values[0];
        }
        return buildShorthandSpacing({
            top: values[0],
            right: values[1],
            bottom: values[2],
            left: values[3],
        });
    }

    return "";
}

export function getPerSideValue(
    style: CSSProperties | undefined,
    property: SpacingProperty,
    side: SpacingSide,
): string {
    return toStr(style?.[LONGHAND_KEYS[property][side]]);
}

export function applyUnifiedValue(
    style: CSSProperties | undefined,
    property: SpacingProperty,
    value: string,
): CSSProperties {
    const next: CSSProperties = { ...(style ?? {}) };

    for (const key of longhandKeys(property)) {
        delete next[key];
    }

    if (value.trim() === "") {
        delete next[property];
    } else {
        next[property] = value;
    }

    return next;
}

export function applyPerSideValue(
    style: CSSProperties | undefined,
    property: SpacingProperty,
    side: SpacingSide,
    value: string,
): CSSProperties {
    const next: CSSProperties = { ...(style ?? {}) };
    const key = LONGHAND_KEYS[property][side];

    delete next[property];

    if (value.trim() === "") {
        delete next[key];
    } else {
        (next as Record<string, string>)[key as string] = value;
    }

    return next;
}

export function expandUnifiedToPerSide(
    style: CSSProperties | undefined,
    property: SpacingProperty,
): CSSProperties {
    const value = getUnifiedValue(style, property);
    const next: CSSProperties = { ...(style ?? {}) };

    delete next[property];

    if (value) {
        const parsed = parseShorthandSpacing(value);
        for (const side of SIDES) {
            const key = LONGHAND_KEYS[property][side];
            (next as Record<string, string>)[key as string] = parsed[side];
        }
    }

    return next;
}

export function collapsePerSideToUnified(
    style: CSSProperties | undefined,
    property: SpacingProperty,
): CSSProperties {
    const values = sideValues(style, property);

    if (values.some((value) => value === "")) {
        return { ...(style ?? {}) };
    }

    const first = values[0];
    if (!values.every((value) => value === first)) {
        return applyUnifiedValue(
            style,
            property,
            buildShorthandSpacing({
                top: values[0],
                right: values[1],
                bottom: values[2],
                left: values[3],
            }),
        );
    }

    return applyUnifiedValue(style, property, first);
}
