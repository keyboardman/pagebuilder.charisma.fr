import type { CSSProperties } from "react";

const GRADIENT_PATTERN = /linear-gradient|radial-gradient|conic-gradient|repeating-linear-gradient|repeating-radial-gradient/i;

/**
 * Prépare un style pour l'affichage en vue : si backgroundImage est défini
 * et n'est pas un gradient, enveloppe la valeur dans url().
 * Ajoute les propriétés nécessaires pour line-clamp et text-overflow.
 */
export function styleForView(style: CSSProperties | undefined): CSSProperties {
  if (!style) return {};
  let out: CSSProperties = { ...style };

  const bg = out.backgroundImage;
  if (typeof bg === "string" && bg.trim() !== "" && !GRADIENT_PATTERN.test(bg) && !bg.startsWith("url(")) {
    out = { ...out, backgroundImage: `url(${bg})` };
  }

  const hasLineClamp = out.WebkitLineClamp != null && String(out.WebkitLineClamp).trim() !== "";
  if (hasLineClamp) {
    out = {
      ...out,
      display: "-webkit-box",
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
    };
  }

  const hasTextOverflow = out.textOverflow != null && String(out.textOverflow).trim() !== "";
  if (hasTextOverflow && out.overflow == null) {
    out = { ...out, overflow: "hidden" };
  }

  return out;
}
