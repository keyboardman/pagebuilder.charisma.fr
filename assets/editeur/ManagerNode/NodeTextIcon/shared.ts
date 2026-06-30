import type { CSSProperties } from "react";
import { cn } from "@/editeur/lib/utils";
import type {
  NodeTextIconHorizontalAlign,
  NodeTextIconSizeVariant,
  NodeTextIconSource,
  NodeTextIconTag,
  NodeTextIconType,
  NodeTextIconVerticalAlign,
} from "./index";

/** Styles du conteneur flex ; repli sur `attributes.style` pour les pages existantes. */
export function resolveNodeTextIconContainerStyle(
  node: Pick<NodeTextIconType, "content" | "attributes">,
): CSSProperties {
  if (node.content?.container?.style !== undefined) {
    return node.content.container.style;
  }
  return node.attributes?.style ?? {};
}

export function resolveNodeTextIconTextStyle(node: Pick<NodeTextIconType, "content">): CSSProperties {
  return node.content?.text?.style ?? {};
}

export function resolveNodeTextIconIconMediaStyle(node: Pick<NodeTextIconType, "content">): CSSProperties {
  return node.content?.iconMedia?.style ?? {};
}

export function resolveNodeTextIconTag(tag: unknown): NodeTextIconTag {
  if (tag === "div" || tag === "p") {
    return tag;
  }
  if (tag === "h1" || tag === "h2" || tag === "h3" || tag === "h4" || tag === "h5" || tag === "h6") {
    return tag;
  }
  return "div";
}

/** Classes sur le wrapper du HTML : `ce-text` pour div/p, `ce-header-{tag}` pour les titres. */
export function nodeTextIconBodyClassName(tag: NodeTextIconTag): string {
  if (tag === "div" || tag === "p") {
    return cn("ce-text", "ce-text-icon__text");
  }
  return cn(`ce-header-${tag}`, "ce-text-icon__text");
}

export function resolveNodeTextIconSource(content: {
  iconSource?: NodeTextIconSource;
  iconImageUrl?: string;
  themeIconId?: string;
  themeIconClass?: string;
}): NodeTextIconSource {
  const explicit = content?.iconSource;
  if (explicit === "image" || explicit === "theme" || explicit === "preset") {
    return explicit;
  }
  if (content?.iconImageUrl?.trim()) {
    return "image";
  }
  if (content?.themeIconId?.trim() || content?.themeIconClass?.trim()) {
    return "theme";
  }
  return "preset";
}

export function resolveIconSizeVariant(content: {
  iconSizeVariant?: NodeTextIconSizeVariant;
  iconSize?: number;
}): NodeTextIconSizeVariant {
  const v = content?.iconSizeVariant;
  if (v === "small" || v === "large" || v === "default") {
    return v;
  }
  const n = Number(content?.iconSize);
  if (Number.isFinite(n) && n <= 16) {
    return "small";
  }
  if (Number.isFinite(n) && n >= 32) {
    return "large";
  }
  return "default";
}

/** Classes pour `<i>` : toujours `ce-icon`, optionnellement `ce-icon-small` ou `ce-icon-large`. */
export function ceIconClassNames(variant: NodeTextIconSizeVariant): string {
  const parts: string[] = ["ce-icon"];
  if (variant === "small") {
    parts.push("ce-icon-small");
  }
  if (variant === "large") {
    parts.push("ce-icon-large");
  }
  return parts.join(" ");
}

/** Style `background-image` sûr pour une URL d’icône raster (PNG, JPG, …). */
export function ceIconBackgroundImageStyle(url: string): Pick<CSSProperties, "backgroundImage"> {
  const u = url.trim();
  if (!u) {
    return {};
  }
  return { backgroundImage: `url(${JSON.stringify(u)})` };
}

export function isSvgIconUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) {
    return false;
  }
  try {
    const path = new URL(trimmed, "http://localhost").pathname;
    return path.toLowerCase().endsWith(".svg");
  } catch {
    const path = trimmed.split("?")[0]?.split("#")[0] ?? "";
    return path.toLowerCase().endsWith(".svg");
  }
}

/** SVG : masque + currentColor pour suivre `style.color` (comme les icônes du thème). */
export function ceIconSvgMaskStyle(url: string): CSSProperties {
  const u = url.trim();
  if (!u) {
    return {};
  }
  const quoted = JSON.stringify(u);
  return {
    backgroundColor: "currentColor",
    backgroundImage: "none",
    WebkitMaskImage: `url(${quoted})`,
    maskImage: `url(${quoted})`,
    WebkitMaskSize: "contain",
    maskSize: "contain",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskPosition: "center",
  };
}

/** Choisit masque SVG ou background-image selon l’extension de l’URL. */
export function ceIconUrlStyle(url: string): CSSProperties {
  if (isSvgIconUrl(url)) {
    return ceIconSvgMaskStyle(url);
  }
  return ceIconBackgroundImageStyle(url);
}

/** Classe utilisable dans le DOM (sans `.`, caractères sûrs). */
export function sanitizeThemeIconClass(raw: string): string {
  return raw.replace(/^\.+/, "").replace(/[^a-zA-Z0-9_-]/g, "");
}

export function toJustifyContent(align: NodeTextIconHorizontalAlign): CSSProperties["justifyContent"] {
  if (align === "center") {
    return "center";
  }
  if (align === "right") {
    return "flex-end";
  }
  return "flex-start";
}

export function toAlignItems(align: NodeTextIconVerticalAlign): CSSProperties["alignItems"] {
  if (align === "top") {
    return "flex-start";
  }
  if (align === "bottom") {
    return "flex-end";
  }
  return "center";
}
