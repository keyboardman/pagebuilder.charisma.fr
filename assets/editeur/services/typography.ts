import { useSyncExternalStore } from "react";

/** Format CSS pour @font-face : opentype (.otf), truetype (.ttf), woff, woff2 */
export type FontFormat = "opentype" | "truetype" | "woff" | "woff2";

export type FontTier = "builtin" | "theme" | "page";

export type RegisterFontInput = {
  name: string;
  href: string;
  fontFamily: string;
  /** Format du fichier (opentype pour .otf, truetype pour .ttf, woff, woff2). Inféré depuis l'URL si absent. */
  format?: FontFormat;
  fontSizes?: string[];
  tier?: FontTier;
};

type RegisteredFont = {
  name: string;
  href: string;
  fontFamily: string;
  format?: FontFormat;
  fontSizes?: string[];
  tier: FontTier;
};

type TypographyState = {
  fonts: RegisteredFont[];
  fontSizes: string[];
};

const DEFAULT_FONTS: RegisteredFont[] = [
  { name: "Sans (par défaut)", fontFamily: "var(--font-sans)", href: "builtin:font-sans", tier: "builtin" },
  { name: "Serif (par défaut)", fontFamily: "var(--font-serif)", href: "builtin:font-serif", tier: "builtin" },
  { name: "Mono (par défaut)", fontFamily: "var(--font-mono)", href: "builtin:font-mono", tier: "builtin" },
  { name: "Arial, Helvetica", fontFamily: "Arial, Helvetica, sans-serif", href: "builtin:arial", tier: "builtin" },
  { name: "Times New Roman", fontFamily: "Times, Times New Roman, serif", href: "builtin:times", tier: "builtin" },
  { name: "Georgia", fontFamily: "Georgia, serif", href: "builtin:georgia", tier: "builtin" },
  { name: "Verdana", fontFamily: "Verdana, sans-serif", href: "builtin:verdana", tier: "builtin" },
];

const DEFAULT_FONT_SIZES: string[] = [
  "0.75rem",
  "0.875rem",
  "1rem",
  "1.125rem",
  "1.25rem",
  "1.5rem",
  "1.875rem",
  "2.25rem",
  "3rem",
];

const normalizeFontFamilyKey = (fontFamily: string) => {
  const normalized = fontFamily
    .replace(/\u00A0/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s*,\s*/g, ",")
    .trim();
  const primary = extractPrimaryFontFamily(normalized);
  return {
    normalized,
    primary: primary.replace(/^['"]|['"]$/g, ""),
  };
};

const extractPrimaryFontFamily = (fontFamily: string): string => {
  let quote: "'" | '"' | null = null;
  for (let i = 0; i < fontFamily.length; i += 1) {
    const char = fontFamily[i];
    if ((char === "'" || char === '"') && (i === 0 || fontFamily[i - 1] !== "\\")) {
      quote = quote === char ? null : quote ?? char;
      continue;
    }
    if (char === "," && quote === null) {
      return fontFamily.slice(0, i).trim();
    }
  }
  return fontFamily.trim();
};

const protectedFontFamilies = new Set<string>();
const protectedPrimaryFontFamilies = new Set<string>();

DEFAULT_FONTS.forEach((font) => {
  const key = normalizeFontFamilyKey(font.fontFamily);
  protectedFontFamilies.add(key.normalized);
  protectedPrimaryFontFamilies.add(key.primary);
});

let state: TypographyState = {
  fonts: [...DEFAULT_FONTS],
  fontSizes: [...DEFAULT_FONT_SIZES],
};

const listeners = new Set<() => void>();
const loadedStylesheetsByDoc = new WeakMap<Document, Set<string>>();
const loadedFontFacesByDoc = new WeakMap<Document, Set<string>>();
const preconnectAddedByDoc = new WeakMap<Document, boolean>();

const notify = () => listeners.forEach((listener) => listener());

const isStylesheetUrl = (href: string) => {
  return href.endsWith(".css") || href.includes("fonts.googleapis.com");
};

const isGoogleFontsUrl = (href: string) => {
  return href.includes("fonts.googleapis.com");
};

const ensureGoogleFontsPreconnect = (doc: Document) => {
  if (!doc.head) {
    return;
  }

  if (preconnectAddedByDoc.get(doc)) {
    return;
  }

  const existingPreconnect1 = doc.querySelector('link[rel="preconnect"][href="https://fonts.googleapis.com"]');
  const existingPreconnect2 = doc.querySelector('link[rel="preconnect"][href="https://fonts.gstatic.com"]');

  if (existingPreconnect1 && existingPreconnect2) {
    preconnectAddedByDoc.set(doc, true);
    return;
  }

  if (!existingPreconnect1) {
    const preconnect1 = doc.createElement("link");
    preconnect1.rel = "preconnect";
    preconnect1.href = "https://fonts.googleapis.com";
    doc.head.insertBefore(preconnect1, doc.head.firstChild);
  }

  if (!existingPreconnect2) {
    const preconnect2 = doc.createElement("link");
    preconnect2.rel = "preconnect";
    preconnect2.href = "https://fonts.gstatic.com";
    preconnect2.crossOrigin = "anonymous";
    doc.head.insertBefore(preconnect2, doc.head.firstChild);
  }

  preconnectAddedByDoc.set(doc, true);
};

export const normalizeFontFamilySpaces = (s: string) =>
  s.replace(/\u00A0/g, " ").replace(/&nbsp;/g, " ");

const sanitizeFontFamilyName = (fontFamily: string) => {
  const normalized = normalizeFontFamilySpaces(fontFamily);
  const primary = extractPrimaryFontFamily(normalized);
  return primary.replace(/^['"]|['"]$/g, "");
};

const inferFormatFromHref = (href: string): FontFormat => {
  const ext = href.split(".").pop()?.toLowerCase()?.split("?")[0] ?? "";
  switch (ext) {
    case "otf":
      return "opentype";
    case "ttf":
      return "truetype";
    case "woff":
      return "woff";
    case "woff2":
      return "woff2";
    default:
      return "woff2";
  }
};

const getIframeDocumentFromGlobalContext = (): Document | null => {
  const context = (window as any).__CharismaPageBuilderContext;
  const iframeRef = context?.iframeRef as React.RefObject<HTMLIFrameElement | null> | undefined;
  return iframeRef?.current?.contentDocument ?? null;
};

const getTargetDocument = (): Document | null => {
  const iframeDoc = getIframeDocumentFromGlobalContext();
  return iframeDoc ?? (typeof document !== "undefined" ? document : null);
};

const ensureStylesheetInjected = (doc: Document, href: string) => {
  if (href.startsWith("builtin:")) {
    return;
  }

  if (!doc.head) {
    return;
  }

  if (isGoogleFontsUrl(href)) {
    ensureGoogleFontsPreconnect(doc);
  }

  let loadedForDoc = loadedStylesheetsByDoc.get(doc);
  if (!loadedForDoc) {
    loadedForDoc = new Set<string>();
    loadedStylesheetsByDoc.set(doc, loadedForDoc);
  }

  if (loadedForDoc.has(href)) {
    return;
  }

  const existing = doc.querySelector(`link[rel="stylesheet"][href="${href}"]`);
  if (existing) {
    loadedForDoc.add(href);
    return;
  }

  const link = doc.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  link.setAttribute("data-charisma-font", href);

  link.onerror = (error) => {
    console.error("[Typography] Failed to load stylesheet:", href, error);
  };

  try {
    doc.head.appendChild(link);
    loadedForDoc.add(href);
  } catch (error) {
    console.error("[Typography] Error appending link to head:", error);
  }
};

const ensureFontFaceInjected = (
  doc: Document,
  href: string,
  fontFamily: string,
  format?: FontFormat
) => {
  if (href.startsWith("builtin:")) {
    return;
  }

  if (!doc.head) {
    return;
  }

  let loadedForDoc = loadedFontFacesByDoc.get(doc);
  if (!loadedForDoc) {
    loadedForDoc = new Set<string>();
    loadedFontFacesByDoc.set(doc, loadedForDoc);
  }

  const key = `${fontFamily}|${href}`;
  if (loadedForDoc.has(key)) {
    return;
  }

  const primaryFamily = sanitizeFontFamilyName(fontFamily);
  const fontFormat = format ?? inferFormatFromHref(href);

  const style = doc.createElement("style");
  style.type = "text/css";
  style.setAttribute("data-charisma-font", href);
  const fontFaceRule = `@font-face { font-family: "${primaryFamily}"; src: url("${href}") format("${fontFormat}"); font-display: swap; }`;
  style.appendChild(doc.createTextNode(fontFaceRule));

  try {
    doc.head.appendChild(style);
    loadedForDoc.add(key);
  } catch (error) {
    console.error("[Typography] Error appending style to head:", error);
  }
};

const removeFontFromDocument = (doc: Document, href: string, fontFamily: string) => {
  if (!doc.head || href.startsWith("builtin:")) return;

  doc.querySelectorAll(`link[data-charisma-font="${href}"]`).forEach((el) => el.remove());
  doc.querySelectorAll(`style[data-charisma-font="${href}"]`).forEach((el) => el.remove());

  const loadedStyles = loadedStylesheetsByDoc.get(doc);
  loadedStyles?.delete(href);

  const key = `${fontFamily}|${href}`;
  const loadedFaces = loadedFontFacesByDoc.get(doc);
  loadedFaces?.delete(key);
};

const injectFontIntoDocument = (
  href: string,
  fontFamily: string,
  format?: FontFormat
) => {
  const doc = getTargetDocument();
  if (!doc?.head) return;

  if (isStylesheetUrl(href)) {
    ensureStylesheetInjected(doc, href);
  } else {
    ensureFontFaceInjected(doc, href, fontFamily, format);
  }
};

/** Charge une police dans le document courant (UI builder) pour aperçu dans ManagerFont. */
export const loadFontForPreview = (font: {
  href: string;
  fontFamily: string;
  format?: FontFormat;
}): void => {
  if (typeof document === "undefined" || !document.head || font.href.startsWith("builtin:")) {
    return;
  }

  const href = font.href;
  const fontFamily = normalizeFontFamilySpaces(font.fontFamily);

  if (isStylesheetUrl(href)) {
    ensureStylesheetInjected(document, href);
  } else {
    ensureFontFaceInjected(document, href, fontFamily, font.format);
  }
};

export const syncRegisteredFontsToDocument = (doc: Document) => {
  if (!doc.head) {
    return;
  }

  const hasGoogleFonts = state.fonts.some(
    (font) => !font.href.startsWith("builtin:") && isGoogleFontsUrl(font.href)
  );
  if (hasGoogleFonts) {
    ensureGoogleFontsPreconnect(doc);
  }

  state.fonts.forEach((font) => {
    if (font.href.startsWith("builtin:")) return;
    if (isStylesheetUrl(font.href)) {
      ensureStylesheetInjected(doc, font.href);
    } else {
      ensureFontFaceInjected(doc, font.href, font.fontFamily, font.format);
    }
  });
};

const addFontSizes = (fontSizes?: string[]) => {
  if (!fontSizes?.length) return;
  const merged = new Set([...state.fontSizes, ...fontSizes]);
  state = { ...state, fontSizes: Array.from(merged) };
  rebuildSnapshot();
};

const upsertFont = (font: RegisterFontInput, tier: FontTier): RegisteredFont => {
  const { name, href, format, fontSizes } = font;
  const fontFamily = normalizeFontFamilySpaces(font.fontFamily);

  if (!name || !href || !fontFamily) {
    throw new Error("registerFont requires name, href, and fontFamily");
  }

  const existing = state.fonts.find(
    (item) => item.href === href || item.fontFamily === fontFamily
  );

  if (!existing) {
    state = {
      ...state,
      fonts: [...state.fonts, { name, href, fontFamily, format, fontSizes, tier }],
    };
  } else if (existing.tier === "page" && tier !== "page") {
    const fonts = state.fonts.map((item) =>
      item.href === href || item.fontFamily === fontFamily
        ? { ...item, tier, name, href, fontFamily, format, fontSizes }
        : item
    );
    state = { ...state, fonts };
  }

  injectFontIntoDocument(href, fontFamily, format);

  if (fontSizes?.length) {
    addFontSizes(fontSizes);
  }
  rebuildSnapshot();
  notify();

  return existing ?? { name, href, fontFamily, format, fontSizes, tier };
};

export const registerFont = (font: RegisterFontInput): RegisteredFont => {
  return upsertFont(font, font.tier ?? "page");
};

export const registerThemeFont = (font: RegisterFontInput): RegisteredFont => {
  const key = normalizeFontFamilyKey(font.fontFamily);
  protectedFontFamilies.add(key.normalized);
  protectedPrimaryFontFamilies.add(key.primary);
  return upsertFont(font, "theme");
};

export const registerPageFont = (font: RegisterFontInput): RegisteredFont => {
  return upsertFont(font, "page");
};

export const markThemeFontFamilies = (families: string[]): void => {
  families.forEach((family) => {
    if (family.trim()) {
      const key = normalizeFontFamilyKey(family);
      protectedFontFamilies.add(key.normalized);
      protectedPrimaryFontFamilies.add(key.primary);
    }
  });
};

export const isProtectedFontFamily = (fontFamily: string): boolean => {
  const key = normalizeFontFamilyKey(fontFamily);
  return protectedFontFamilies.has(key.normalized) || protectedPrimaryFontFamilies.has(key.primary);
};

export const unregisterPageFont = (fontFamily: string, href?: string): void => {
  const normalized = normalizeFontFamilySpaces(fontFamily);
  const target = state.fonts.find(
    (font) =>
      font.tier === "page" &&
      (font.fontFamily === normalized || (href && font.href === href))
  );

  if (!target) return;

  state = {
    ...state,
    fonts: state.fonts.filter((font) => font !== target),
  };

  const doc = getTargetDocument();
  if (doc) {
    removeFontFromDocument(doc, target.href, target.fontFamily);
  }

  rebuildSnapshot();
  notify();
};

export const getFontOptions = () =>
  state.fonts.map((font) => ({
    label: font.name,
    value: font.fontFamily,
  }));

export const getFontSizeOptions = () => [...state.fontSizes];

export const subscribeTypography = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

let cachedSnapshot = {
  fontOptions: getFontOptions(),
  fontSizeOptions: getFontSizeOptions(),
};

const rebuildSnapshot = () => {
  cachedSnapshot = {
    fontOptions: getFontOptions(),
    fontSizeOptions: getFontSizeOptions(),
  };
};

const snapshot = () => cachedSnapshot;

export const useTypographyOptions = () => useSyncExternalStore(subscribeTypography, snapshot, snapshot);

export const forceSyncToIframe = () => {
  const iframeDoc = getIframeDocumentFromGlobalContext();
  const doc = iframeDoc ?? (typeof document !== "undefined" ? document : null);
  if (doc?.head) {
    syncRegisteredFontsToDocument(doc);
    return true;
  }
  return false;
};

export default {
  registerFont,
  registerThemeFont,
  registerPageFont,
  unregisterPageFont,
  loadFontForPreview,
  getFontOptions,
  getFontSizeOptions,
  useTypographyOptions,
  syncRegisteredFontsToDocument,
  forceSyncToIframe,
};
