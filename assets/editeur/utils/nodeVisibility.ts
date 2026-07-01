import type { NodeID, NodeType, NodesType } from "../types/NodeType";

/**
 * Un nœud est effectivement masqué si lui-même ou un ancêtre possède `hidden: true`.
 */
export function isNodeEffectivelyHidden(nodeId: NodeID, nodes: NodesType): boolean {
  const visited = new Set<NodeID>();
  let currentId: NodeID | null = nodeId;

  while (currentId) {
    if (visited.has(currentId)) {
      return false;
    }
    visited.add(currentId);

    const node: NodeType | undefined = nodes[currentId];
    if (!node) {
      return false;
    }

    if (node.hidden === true) {
      return true;
    }

    currentId = node.parent?.id ?? null;
  }

  return false;
}
