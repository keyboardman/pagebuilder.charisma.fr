import type { CSSProperties } from "react";
import { cn } from "@/editeur/lib/utils";
import type {
  NodeTextIconHorizontalAlign,
  NodeTextIconSizeVariant,
  NodeTextIconSource,
  NodeTextIconTag,
  NodeTextIconVerticalAlign,
} from "./index";

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

/** Style `background-image` sûr pour une URL d’icône (image / thème sans classe). */
export function ceIconBackgroundImageStyle(url: string): Pick<CSSProperties, "backgroundImage"> {
  const u = url.trim();
  if (!u) {
    return {};
  }
  return { backgroundImage: `url(${JSON.stringify(u)})` };
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
