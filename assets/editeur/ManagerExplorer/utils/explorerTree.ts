import { NODE_ROOT_TYPE } from "../../ManagerNode/NodeRoot";
import type { NodeID, NodesType, NodeType } from "../../types/NodeType";
export { getNodeDisplayLabel, getNodeTypeLabel, hasCustomNodeLabel } from "../../utils/nodeLabel";

export type ChildZoneGroup = {
  zone: string;
  children: NodeType[];
};

export function findRootNode(nodes: NodesType): NodeType | null {
  return Object.values(nodes).find((n) => n.type === NODE_ROOT_TYPE) ?? null;
}

export function getChildZoneGroups(nodes: NodesType, parentId: NodeID): ChildZoneGroup[] {
  const children = Object.values(nodes)
    .filter((n) => n.parent?.id === parentId)
    .sort((a, b) => {
      const zoneCmp = a.parent.zone.localeCompare(b.parent.zone);
      if (zoneCmp !== 0) {
        return zoneCmp;
      }
      return a.parent.order - b.parent.order;
    });

  if (children.length === 0) {
    return [];
  }

  const zones = [...new Set(children.map((c) => c.parent.zone))];
  return zones.map((zone) => ({
    zone,
    children: children.filter((c) => c.parent.zone === zone),
  }));
}

export function hasChildren(nodes: NodesType, parentId: NodeID): boolean {
  return Object.values(nodes).some((n) => n.parent?.id === parentId);
}

export function getAncestorIds(nodes: NodesType, nodeId: NodeID): NodeID[] {
  const ancestors: NodeID[] = [];
  let current = nodes[nodeId];
  while (current?.parent?.id) {
    ancestors.unshift(current.parent.id);
    current = nodes[current.parent.id];
  }
  return ancestors;
}
