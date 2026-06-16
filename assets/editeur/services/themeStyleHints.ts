import { useMemo } from "react";
import { stringCssToMap } from "../../components/ThemeFormComponent/utils";
import { useAppContext } from "./providers/AppContext";

export type ThemeNodeOverrides = Record<string, Record<string, string>>;
export type ThemeVars = Record<string, string>;

export function normalizeThemeNodeOverrides(raw: unknown): ThemeNodeOverrides {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
        return {};
    }

    const out: ThemeNodeOverrides = {};
    for (const [selector, value] of Object.entries(raw as Record<string, unknown>)) {
        if (typeof value === "string") {
            const map = stringCssToMap(value);
            if (Object.keys(map).length > 0) {
                out[selector] = map;
            }
            continue;
        }
        if (!value || typeof value !== "object" || Array.isArray(value)) {
            continue;
        }
        const props: Record<string, string> = {};
        for (const [prop, propValue] of Object.entries(value as Record<string, unknown>)) {
            if (typeof propValue === "string" && propValue.trim() !== "") {
                props[prop.trim().toLowerCase()] = propValue.trim();
            }
        }
        if (Object.keys(props).length > 0) {
            out[selector] = props;
        }
    }
    return out;
}

export function normalizeThemeVars(raw: unknown): ThemeVars {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
        return {};
    }

    const out: ThemeVars = {};
    for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
        if (typeof value !== "string" || value.trim() === "") {
            continue;
        }
        const name = key.startsWith("--") ? key : `--${key}`;
        out[name] = value.trim();
    }
    return out;
}

const VAR_CALL_REGEX = /var\(\s*(--[^,)]+)\s*(?:,\s*([^)]+))?\s*\)/;

export function resolveThemeCssValue(
    value: string,
    vars: ThemeVars,
    depth = 0
): string | null {
    if (depth > 8) {
        return null;
    }

    const trimmed = value.trim();
    if (!trimmed) {
        return null;
    }

    const wholeVar = trimmed.match(/^var\(\s*(--[^,)]+)\s*(?:,\s*([^)]+))?\s*\)$/);
    if (wholeVar) {
        const varName = wholeVar[1].trim();
        const fallback = wholeVar[2]?.trim();
        const resolved = vars[varName];
        if (resolved) {
            return resolveThemeCssValue(resolved, vars, depth + 1);
        }
        if (fallback) {
            return resolveThemeCssValue(fallback, vars, depth + 1);
        }
        return null;
    }

    if (!trimmed.includes("var(")) {
        return trimmed;
    }

    let result = trimmed;
    for (let i = depth; i < 8; i++) {
        const next = result.replace(VAR_CALL_REGEX, (match, varName: string, fallback?: string) => {
            const resolved = vars[varName.trim()];
            if (resolved) {
                return resolved;
            }
            if (fallback) {
                return fallback.trim();
            }
            return match;
        });
        if (next === result) {
            break;
        }
        result = next;
    }

    return result.includes("var(") ? null : result;
}

export function getThemeStylePlaceholder(
    overrides: ThemeNodeOverrides,
    vars: ThemeVars,
    selector: string | undefined,
    cssProperty: string,
    fallback?: string
): string | undefined {
    if (!selector) {
        return fallback;
    }

    const raw = overrides[selector]?.[cssProperty.trim().toLowerCase()];
    if (!raw) {
        return fallback;
    }

    const resolved = resolveThemeCssValue(raw, vars);
    return resolved ?? fallback;
}

export function useThemeStylePlaceholder(
    themeOverrideSelector: string | undefined,
    cssProperty: string,
    fallback?: string
): string | undefined {
    const { themeNodeOverrides, themeVars } = useAppContext();

    return useMemo(
        () =>
            getThemeStylePlaceholder(
                themeNodeOverrides,
                themeVars,
                themeOverrideSelector,
                cssProperty,
                fallback
            ),
        [themeNodeOverrides, themeVars, themeOverrideSelector, cssProperty, fallback]
    );
}
