import type { CSSProperties } from "react";

const GRADIENT_PATTERN = /linear-gradient|radial-gradient|conic-gradient|repeating-linear-gradient|repeating-radial-gradient/i;

/**
 * Prépare un style pour l'affichage en vue : si backgroundImage est défini
 * et n'est pas un gradient, enveloppe la valeur dans url().
 */
export function styleForView(style: CSSProperties | undefined): CSSProperties {
  if (!style) return {};
  const bg = style.backgroundImage;
  if (typeof bg !== "string" || bg.trim() === "") return { ...style };
  if (GRADIENT_PATTERN.test(bg)) return { ...style };
  if (bg.startsWith("url(")) return { ...style };
  return { ...style, backgroundImage: `url(${bg})` };
}
