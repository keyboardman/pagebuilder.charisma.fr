import type React from 'react';
import type { BodyConfig, ButtonConfig, ButtonColorOnly, ButtonSizeConfig, ThemeConfigJson, ThemeVar } from './types';

/**
 * Interprète darken(color, amount%) et lighten(color, amount%) côté client pour l'aperçu.
 * Retourne une couleur CSS utilisable (rgb() ou hex). Passe-through pour les autres valeurs.
 */
export function resolveColorValue(value: string): string {
  if (typeof value !== 'string' || !value.trim()) return value;
  const trimmed = value.trim();

  const darkenMatch = trimmed.match(/^darken\s*\(\s*(.+?)\s*,\s*(\d+(?:\.\d+)?)\s*%?\s*\)\s*$/i);
  if (darkenMatch) {
    const [, colorArg, amountStr] = darkenMatch;
    const amount = Math.min(100, Math.max(0, parseFloat(amountStr) || 0));
    return applyLightnessChange(colorArg.trim(), -amount);
  }

  const lightenMatch = trimmed.match(/^lighten\s*\(\s*(.+?)\s*,\s*(\d+(?:\.\d+)?)\s*%?\s*\)\s*$/i);
  if (lightenMatch) {
    const [, colorArg, amountStr] = lightenMatch;
    const amount = Math.min(100, Math.max(0, parseFloat(amountStr) || 0));
    return applyLightnessChange(colorArg.trim(), amount);
  }

  return value;
}

export function parseColorToRgb(cssColor: string): { r: number; g: number; b: number } | null {
  if (typeof document === 'undefined') return null;
  const el = document.createElement('div');
  el.style.color = cssColor;
  el.style.position = 'absolute';
  el.style.visibility = 'hidden';
  document.body.appendChild(el);
  const computed = window.getComputedStyle(el).color;
  document.body.removeChild(el);
  const m = computed.match(/rgb(?:a)?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (m) return { r: parseInt(m[1], 10), g: parseInt(m[2], 10), b: parseInt(m[3], 10) };
  return null;
}

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      default:
        h = ((r - g) / d + 4) / 6;
    }
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;
  let r: number;
  let g: number;
  let b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

function applyLightnessChange(cssColor: string, deltaPercent: number): string {
  const rgb = parseColorToRgb(cssColor);
  if (!rgb) return cssColor;
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const newL = Math.min(100, Math.max(0, hsl.l + deltaPercent));
  const out = hslToRgb(hsl.h, hsl.s, newL);
  return `rgb(${out.r}, ${out.g}, ${out.b})`;
}

export const TAILWIND_DEFAULT_VARS: Record<string, string> = {
  '--color-primary': '#570df8',
  '--color-link': '#3b82f6',
  '--color-info': '#0ea5e9',
  '--color-success': '#22c55e',
  '--color-warning': '#eab308',
  '--color-danger': '#ef4444',
  '--color-light': '#f5f5f5',
  '--color-dark': '#1f2937',
  '--color-black': '#000000',
  '--color-white': '#ffffff',
  '--font-size-base': '16px',
};

export function buildInitialVars(initial: Record<string, string> | null | undefined): ThemeVar[] {
  const source =
    initial && Object.keys(initial).length > 0 ? initial : TAILWIND_DEFAULT_VARS;

  return Object.entries(source).map(([name, value], index) => ({
    id: index + 1,
    name,
    value: String(value ?? ''),
  }));
}

export function normalizeVarNameForSubmit(raw: string): string {
  let name = raw.trim();
  if (!name) return '';
  if (!name.startsWith('--')) {
    name = '--' + name.replace(/^(-)*/, '');
  }
  return name;
}

export const BODY_DEFAULTS: BodyConfig = {
  fontFamily: '',
  fontSize: 'var(--font-size-base)',
  fontWeight: '400',
  lineHeight: '',
  color: 'var(--color-primary)',
  margin: '0',
  padding: '0',
};

export const HEADING_AND_P_BLOCKS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'] as const;

export const BUTTON_BASE_KEYS = [
  'background',
  'color',
  'border-width',
  'border-color',
  'border-radius',
  'padding',
  'margin',
  'font-size',
  'font-family',
  'font-weight',
  'line-height',
] as const;

export const BUTTON_SIZE_KEYS = ['padding', 'font-size', 'line-height'] as const;

export const BUTTON_BASE_DEFAULTS: ButtonConfig = {
  background: 'var(--color-primary)',
  color: '#fff',
  borderWidth: '1px',
  borderColor: 'transparent',
  borderRadius: '0.375rem',
  padding: '0.5rem 1rem',
  margin: '0',
  fontSize: '1rem',
  fontFamily: '',
  fontWeight: '400',
  lineHeight: '1.5',
};

export const BUTTON_SIZE_DEFAULTS: ButtonSizeConfig = {
  padding: '0.25rem 0.5rem',
  fontSize: '0.875rem',
  lineHeight: '1.25',
};

export const BUTTON_VARIANT_KEYS = [
  'ch_btn',
  'ch_btn_primary',
  'ch_btn_info',
  'ch_btn_warning',
  'ch_btn_success',
  'ch_btn_danger',
] as const;

export const BUTTON_VARIANT_LABELS: Record<(typeof BUTTON_VARIANT_KEYS)[number], string> = {
  ch_btn: 'Default',
  ch_btn_primary: 'Primary',
  ch_btn_info: 'Info',
  ch_btn_warning: 'Warning',
  ch_btn_success: 'Success',
  ch_btn_danger: 'Danger',
};

export const BUTTON_VARIANT_COLOR_KEYS = ['background', 'color', 'border-color'] as const;

export const BUTTON_COLOR_ONLY_DEFAULTS: ButtonColorOnly = {
  background: '',
  color: '',
  borderColor: '',
};

export const BLOCK_KEY_TO_CAMEL: Record<string, string> = {
  'font-family': 'fontFamily',
  'font-size': 'fontSize',
  'font-weight': 'fontWeight',
  'line-height': 'lineHeight',
  color: 'color',
  margin: 'margin',
  padding: 'padding',
  background: 'background',
  'border-width': 'borderWidth',
  'border-color': 'borderColor',
  'border-radius': 'borderRadius',
};

export function defaultBlocks(): Record<string, BodyConfig> {
  return Object.fromEntries(
    HEADING_AND_P_BLOCKS.map((block) => [block, { ...BODY_DEFAULTS }])
  );
}

export function blockToCamelCase(block: Record<string, string> | null | undefined): Partial<BodyConfig> {
  if (!block || typeof block !== 'object') return {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(block)) {
    const key = BLOCK_KEY_TO_CAMEL[k] ?? k;
    out[key] = String(v ?? '');
  }
  return out as Partial<BodyConfig>;
}

export function rawToButtonConfig(raw: Record<string, string> | null | undefined): ButtonConfig {
  if (!raw || typeof raw !== 'object') return { ...BUTTON_BASE_DEFAULTS };
  const out: Record<string, string> = { ...BUTTON_BASE_DEFAULTS };
  for (const [k, v] of Object.entries(raw)) {
    const key = BLOCK_KEY_TO_CAMEL[k] ?? k;
    if (key in out) out[key] = String(v ?? '');
  }
  return out as ButtonConfig;
}

export function rawToButtonSizeConfig(raw: Record<string, string> | null | undefined): ButtonSizeConfig {
  if (!raw || typeof raw !== 'object') return { ...BUTTON_SIZE_DEFAULTS };
  const out: Record<string, string> = { ...BUTTON_SIZE_DEFAULTS };
  for (const [k, v] of Object.entries(raw)) {
    const key = BLOCK_KEY_TO_CAMEL[k] ?? k;
    if (key in out) out[key] = String(v ?? '');
  }
  return out as ButtonSizeConfig;
}

export function rawToButtonColorOnly(raw: Record<string, string> | null | undefined): ButtonColorOnly {
  if (!raw || typeof raw !== 'object') return { ...BUTTON_COLOR_ONLY_DEFAULTS };
  const out: Record<string, string> = { ...BUTTON_COLOR_ONLY_DEFAULTS };
  for (const [k, v] of Object.entries(raw)) {
    const key = BLOCK_KEY_TO_CAMEL[k] ?? k;
    if (key in out) out[key] = String(v ?? '');
  }
  return out as ButtonColorOnly;
}

export function buttonConfigToStyle(b: ButtonConfig): React.CSSProperties {
  const s: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
  if (b.background) s.background = resolveColorValue(b.background);
  if (b.color) s.color = resolveColorValue(b.color);
  s.borderWidth = b.borderWidth?.trim() || '1px';
  s.borderStyle = 'solid';
  s.borderColor = resolveColorValue(b.borderColor?.trim() || 'currentColor');
  if (b.borderRadius) s.borderRadius = b.borderRadius;
  if (b.padding) s.padding = b.padding;
  if (b.margin) s.margin = b.margin;
  if (b.fontSize) s.fontSize = b.fontSize;
  if (b.fontWeight) s.fontWeight = b.fontWeight;
  if (b.lineHeight) s.lineHeight = b.lineHeight;
  if (b.fontFamily) s.fontFamily = b.fontFamily.includes(',') ? b.fontFamily : `"${b.fontFamily}", sans-serif`;
  return s;
}

export function mergeButtonWithSize(base: ButtonConfig, size: ButtonSizeConfig): React.CSSProperties {
  return {
    ...buttonConfigToStyle(base),
    ...(size.padding && { padding: size.padding }),
    ...(size.fontSize && { fontSize: size.fontSize }),
    ...(size.lineHeight && { lineHeight: size.lineHeight }),
  };
}

/** Style d'une variante (Primary, Info, etc.) : base Default + uniquement background, color, border-color. */
export function getVariantButtonStyle(base: ButtonConfig, variant: ButtonConfig): React.CSSProperties {
  const baseStyle = buttonConfigToStyle(base);
  const overrides: React.CSSProperties = {};
  if (variant.background) overrides.background = resolveColorValue(variant.background);
  if (variant.color) overrides.color = resolveColorValue(variant.color);
  if (variant.borderColor?.trim()) overrides.borderColor = resolveColorValue(variant.borderColor.trim());
  return { ...baseStyle, ...overrides };
}

/** Style hover ou disabled : style de base (Default ou variante) + uniquement les 3 couleurs. */
export function getStateButtonStyle(
  baseStyle: React.CSSProperties,
  stateColors: ButtonColorOnly
): React.CSSProperties {
  const overrides: React.CSSProperties = {};
  if (stateColors.background) overrides.background = resolveColorValue(stateColors.background);
  if (stateColors.color) overrides.color = resolveColorValue(stateColors.color);
  if (stateColors.borderColor?.trim()) overrides.borderColor = resolveColorValue(stateColors.borderColor.trim());
  return { ...baseStyle, ...overrides };
}

export function configToSelectedFontValues(config: ThemeConfigJson | null | undefined, fonts: { id: number; name: string }[]): string[] {
  const ids = config?.fonts;
  if (!Array.isArray(ids) || ids.length === 0) return [];
  return ids
    .map((id) => {
      const f = fonts.find((font) => font.id === Number(id));
      return f ? `${f.id}|${f.name}` : null;
    })
    .filter((v): v is string => v !== null);
}

export function blockToStyle(block: BodyConfig): React.CSSProperties {
  const style: React.CSSProperties = {};
  if (block.fontFamily) style.fontFamily = block.fontFamily.includes(',') ? block.fontFamily : `"${block.fontFamily}", sans-serif`;
  if (block.fontSize) style.fontSize = block.fontSize;
  if (block.fontWeight) style.fontWeight = block.fontWeight;
  if (block.lineHeight) style.lineHeight = block.lineHeight;
  if (block.color) style.color = resolveColorValue(block.color);
  if (block.margin) style.margin = block.margin;
  if (block.padding) style.padding = block.padding;
  return style;
}
