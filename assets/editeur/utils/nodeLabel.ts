import NodeRegistry, { isKnownNode } from "../ManagerNode/components/NodeRegistry";
import { NODE_NAV_ITEM_TYPE } from "../ManagerNode/NodeNavItem";
import { NODE_ROOT_TYPE } from "../ManagerNode/NodeRoot";
import type { NodeType } from "../types/NodeType";

function getNodeContentLabel(node: NodeType): string | null {
  if (node.type === NODE_NAV_ITEM_TYPE) {
    const label = node.content?.label;
    if (typeof label === "string" && label.trim().length > 0) {
      return label.trim();
    }
  }
  return null;
}

export function getNodeTypeLabel(node: NodeType): string {
  if (node.type === NODE_ROOT_TYPE) {
    return "Page";
  }
  if (isKnownNode(node)) {
    const label = NodeRegistry[node.type].button?.label;
    if (label) {
      return label;
    }
  }
  return node.type.replace(/^node-/, "");
}

export function hasCustomNodeLabel(node: NodeType): boolean {
  return Boolean(node.editorLabel?.trim());
}

export function getNodeDisplayLabel(node: NodeType): string {
  const custom = node.editorLabel?.trim();
  if (custom) {
    return custom;
  }
  const contentLabel = getNodeContentLabel(node);
  if (contentLabel) {
    return contentLabel;
  }
  return getNodeTypeLabel(node);
}
