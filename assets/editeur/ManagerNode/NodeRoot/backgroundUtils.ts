import type { CSSProperties } from "react";
import type { NodeRootBackground } from "./index";

export function toAbsoluteUrl(url: string): string {
  if (typeof window === "undefined" || !url) return url;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const path = url.startsWith("/") ? url : `/${url}`;
  return `${window.location.origin}${path}`;
}

export function resolveNodeRootBackground(
  background?: NodeRootBackground
): NodeRootBackground {
  if (!background || background.type === "default") {
    return { type: "default" };
  }
  return background;
}

export function hasCustomNodeRootBackground(
  background?: NodeRootBackground
): boolean {
  const resolved = resolveNodeRootBackground(background);
  switch (resolved.type) {
    case "color":
      return Boolean(resolved.color?.trim());
    case "image":
      return Boolean(resolved.url?.trim());
    case "video":
      return Boolean(resolved.url?.trim());
    default:
      return false;
  }
}

export function getNodeRootWrapperStyle(
  background?: NodeRootBackground
): CSSProperties {
  const resolved = resolveNodeRootBackground(background);

  switch (resolved.type) {
    case "color":
      return resolved.color ? { backgroundColor: resolved.color } : {};
    case "image": {
      if (!resolved.url?.trim()) {
        return resolved.color ? { backgroundColor: resolved.color } : {};
      }
      const style: CSSProperties = {
        backgroundImage: `url(${toAbsoluteUrl(resolved.url.trim())})`,
        backgroundPosition: resolved.position ?? "center",
        backgroundSize: resolved.size ?? "cover",
        backgroundRepeat: resolved.repeat ?? "no-repeat",
      };
      if (resolved.color?.trim()) {
        style.backgroundColor = resolved.color;
      }
      return style;
    }
    case "video":
      return resolved.color?.trim() ? { backgroundColor: resolved.color } : {};
    default:
      return {};
  }
}

export const DEFAULT_NODE_ROOT_BACKGROUND: NodeRootBackground = { type: "default" };
