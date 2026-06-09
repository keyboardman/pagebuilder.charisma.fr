import type { CSSProperties } from "react";
import type { NodeIconeSizeMode, NodeIconeSizeVariant, NodeIconeType } from "./index";
import { resolveIconSizeVariant } from "../NodeTextIcon/shared";

export function resolveNodeIconeContainerStyle(
  node: Pick<NodeIconeType, "content" | "attributes">,
): CSSProperties {
  if (node.content?.container?.style !== undefined) {
    return node.content.container.style;
  }
  return node.attributes?.style ?? {};
}

export function resolveNodeIconeIconMediaStyle(node: Pick<NodeIconeType, "content">): CSSProperties {
  return node.content?.iconMedia?.style ?? {};
}

export function resolveIconSizeMode(content: {
  iconSizeMode?: NodeIconeSizeMode;
  iconWidth?: number;
}): NodeIconeSizeMode {
  const explicit = content?.iconSizeMode;
  if (explicit === "preset" || explicit === "custom") {
    return explicit;
  }
  const w = Number(content?.iconWidth);
  if (Number.isFinite(w) && w > 0) {
    return "custom";
  }
  return "preset";
}

export function resolveIconWidth(content: { iconWidth?: number }): number {
  const n = Number(content?.iconWidth);
  if (Number.isFinite(n) && n > 0) {
    return n;
  }
  return 24;
}

export function resolveNodeIconeIconSize(content: NodeIconeType["content"]): {
  iconSizeVariant: NodeIconeSizeVariant;
  customSizeStyle: CSSProperties;
} {
  const mode = resolveIconSizeMode(content ?? {});
  if (mode === "custom") {
    const w = resolveIconWidth(content ?? {});
    return {
      iconSizeVariant: "default",
      customSizeStyle: { width: w, height: w },
    };
  }
  return {
    iconSizeVariant: resolveIconSizeVariant(content ?? {}),
    customSizeStyle: {},
  };
}
