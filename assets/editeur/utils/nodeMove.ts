import type { NodeID, NodesType, ParentProps } from "../types/NodeType";
import nodeHelper from "./nodeHelper";
import { canPlaceUnderParent } from "./formDnd";

export function canMoveNodeToParent(
  nodes: NodesType,
  movingId: NodeID,
  targetParentId: NodeID | null
): boolean {
  if (movingId === targetParentId) {
    return false;
  }

  let id: NodeID | null = targetParentId;
  while (id) {
    if (id === movingId) {
      return false;
    }
    id = nodes[id]?.parent?.id ?? null;
  }

  return true;
}

export function tryMoveNode(
  nodes: NodesType,
  movingId: NodeID,
  source: ParentProps,
  target: ParentProps
): NodesType | null {
  const movingNode = nodes[movingId];
  if (!movingNode) {
    return null;
  }

  const targetParentId = target.id;
  const targetParentNode = targetParentId ? nodes[targetParentId] : null;

  if (!canMoveNodeToParent(nodes, movingId, targetParentId)) {
    return null;
  }

  if (movingNode.type === "node-nav-item") {
    if (!targetParentNode || targetParentNode.type !== "node-nav") {
      return null;
    }
  } else if (targetParentNode?.type === "node-nav") {
    return null;
  }

  if (!canPlaceUnderParent(nodes, movingNode.type, targetParentId)) {
    return null;
  }

  return nodeHelper.moveNode(nodes, movingId, source, target);
}
