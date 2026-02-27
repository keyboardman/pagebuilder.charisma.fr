import { useSyncExternalStore } from "react";

/** Format CSS pour @font-face : opentype (.otf), truetype (.ttf), woff, woff2 */
export type FontFormat = "opentype" | "truetype" | "woff" | "woff2";

export type RegisterFontInput = {
  name: string;
  href: string;
  fontFamily: string;
  /** Format du fichier (opentype pour .otf, truetype pour .ttf, woff, woff2). Inféré depuis l'URL si absent. */
  format?: FontFormat;
  fontSizes?: string[];
};

type RegisteredFont = {
  name: string;
  href: string;
  fontFamily: string;
  format?: FontFormat;
  fontSizes?: string[];
};

type TypographyState = {
  fonts: RegisteredFont[];
  fontSizes: string[];
};

const DEFAULT_FONTS: RegisteredFont[] = [
  { name: "Sans (par défaut)", fontFamily: "var(--font-sans)", href: "builtin:font-sans" },
  { name: "Serif (par défaut)", fontFamily: "var(--font-serif)", href: "builtin:font-serif" },
  { name: "Mono (par défaut)", fontFamily: "var(--font-mono)", href: "builtin:font-mono" },
  { name: "Arial, Helvetica", fontFamily: "Arial, Helvetica, sans-serif", href: "builtin:arial" },
  { name: "Times New Roman", fontFamily: "Times, Times New Roman, serif", href: "builtin:times" },
  { name: "Georgia", fontFamily: "Georgia, serif", href: "builtin:georgia" },
  { name: "Verdana", fontFamily: "Verdana, sans-serif", href: "builtin:verdana" },
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

let state: TypographyState = {
  fonts: [...DEFAULT_FONTS],
  fontSizes: [...DEFAULT_FONT_SIZES],
};

const listeners = new Set<() => void>();
// Track loaded stylesheets per document to avoid duplicates
const loadedStylesheetsByDoc = new WeakMap<Document, Set<string>>();
const loadedFontFacesByDoc = new WeakMap<Document, Set<string>>();
const preconnectAddedByDoc = new WeakMap<Document, boolean>();
// registerFont peut être appelé avant que l'iframe soit montée.
// Dans ce cas, l'injection est rejouée via syncRegisteredFontsToDocument(doc) dès que BuilderProvider fournit l'iframe.

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

  // Vérifier si les preconnect ont déjà été ajoutés pour ce document
  if (preconnectAddedByDoc.get(doc)) {
    return;
  }

  // Vérifier si les balises existent déjà dans le DOM
  const existingPreconnect1 = doc.querySelector('link[rel="preconnect"][href="https://fonts.googleapis.com"]');
  const existingPreconnect2 = doc.querySelector('link[rel="preconnect"][href="https://fonts.gstatic.com"]');
  
  if (existingPreconnect1 && existingPreconnect2) {
    preconnectAddedByDoc.set(doc, true);
    return;
  }
  
  // Ajouter preconnect pour fonts.googleapis.com
  if (!existingPreconnect1) {
    const preconnect1 = doc.createElement("link");
    preconnect1.rel = "preconnect";
    preconnect1.href = "https://fonts.googleapis.com";
    doc.head.insertBefore(preconnect1, doc.head.firstChild);
  }

  // Ajouter preconnect pour fonts.gstatic.com avec crossorigin
  if (!existingPreconnect2) {
    const preconnect2 = doc.createElement("link");
    preconnect2.rel = "preconnect";
    preconnect2.href = "https://fonts.gstatic.com";
    preconnect2.crossOrigin = "anonymous";
    doc.head.insertBefore(preconnect2, doc.head.firstChild);
  }

  preconnectAddedByDoc.set(doc, true);
};

/** Normalise les espaces : &nbsp; et U+00A0 → espace normal (CSS exige un espace pour font-family). */
const normalizeFontFamilySpaces = (s: string) =>
  s.replace(/\u00A0/g, " ").replace(/&nbsp;/g, " ");

const sanitizeFontFamilyName = (fontFamily: string) => {
  const normalized = normalizeFontFamilySpaces(fontFamily);
  const primary = normalized.split(",")[0]?.trim() ?? normalized;
  return primary.replace(/^['"]|['"]$/g, "");
};

/** Infère le format CSS à partir de l'extension du fichier. */
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

const ensureStylesheetInjected = (doc: Document, href: string) => {
  if (href.startsWith("builtin:")) {
    return;
  }
  
  if (!doc.head) {
    return;
  }
  
  // Ajouter les preconnect pour Google Fonts si nécessaire
  if (isGoogleFontsUrl(href)) {
    ensureGoogleFontsPreconnect(doc);
  }
  
  // Get or create the set for this document
  let loadedForDoc = loadedStylesheetsByDoc.get(doc);
  if (!loadedForDoc) {
    loadedForDoc = new Set<string>();
    loadedStylesheetsByDoc.set(doc, loadedForDoc);
  }
  
  // Check if already loaded for this document
  if (loadedForDoc.has(href)) {
    return;
  }
  
  // Check if link already exists in DOM
  const existing = doc.querySelector(`link[rel="stylesheet"][href="${href}"]`);
  if (existing) {
    loadedForDoc.add(href);
    return;
  }
  
  const link = doc.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  
  link.onload = () => {
    // Link loaded successfully
  };
  
  link.onerror = (error) => {
    console.error("[Typography] ❌ Failed to load stylesheet:", href, error);
  };
  
  try {
    doc.head.appendChild(link);
    loadedForDoc.add(href);
    
  } catch (error) {
    console.error("[Typography] ❌ Error appending link to head:", error);
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
    console.error("[Typography] ❌ Document head is not available!");
    return;
  }

  // Get or create the set for this document
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
  const fontFaceRule = `@font-face { font-family: "${primaryFamily}"; src: url("${href}") format("${fontFormat}"); font-display: swap; }`;
  style.appendChild(doc.createTextNode(fontFaceRule));

  try {
    doc.head.appendChild(style);
    loadedForDoc.add(key);
  } catch (error) {
    console.error("[Typography] ❌ Error appending style to head:", error);
  }
};

export const syncRegisteredFontsToDocument = (doc: Document) => {
  if (!doc.head) {
    console.error("[Typography] ❌ Cannot sync: document head is not available!");
    return;
  }
  
  // Vérifier s'il y a des Google Fonts à synchroniser pour ajouter les preconnect
  const hasGoogleFonts = state.fonts.some(font => 
    !font.href.startsWith("builtin:") && isGoogleFontsUrl(font.href)
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

export const registerFont = (font: RegisterFontInput): RegisteredFont => {
  const { name, href, format, fontSizes } = font;
  const fontFamily = normalizeFontFamilySpaces(font.fontFamily);

  if (!name || !href || !fontFamily) {
    console.error("[Typography] ❌ registerFont validation failed: missing name, href, or fontFamily");
    throw new Error("registerFont requires name, href, and fontFamily");
  }

  const existing = state.fonts.find(
    (item) => item.name === name || item.href === href || item.fontFamily === fontFamily
  );

  if (!existing) {
    state = {
      ...state,
      fonts: [...state.fonts, { name, href, fontFamily, format, fontSizes }],
    };
  }

  // En mode builder : injecter dans l'iframe. En mode view (pas d'iframe) : injecter dans le document courant.
  const iframeDoc = getIframeDocumentFromGlobalContext();
  const doc = iframeDoc ?? (typeof document !== "undefined" ? document : null);
  if (doc?.head) {
    if (isStylesheetUrl(href)) {
      ensureStylesheetInjected(doc, href);
    } else {
      ensureFontFaceInjected(doc, href, fontFamily, format);
    }
  }

  if (fontSizes?.length) {
    addFontSizes(fontSizes);
  }
  rebuildSnapshot();
  notify();
  
  const result = existing ?? { name, href, fontFamily, fontSizes };
  return result;
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

// Fonction utilitaire pour forcer la synchronisation des polices : iframe en mode builder, document courant en mode view.
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
  getFontOptions,
  getFontSizeOptions,
  useTypographyOptions,
  syncRegisteredFontsToDocument,
  forceSyncToIframe,
};
