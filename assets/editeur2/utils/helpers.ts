import { customAlphabet } from "nanoid";
import { defaultParentProps, type ParentProps } from "../types/NodeType";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz", 12);

import type { NodeID, NodeType } from "../types/NodeType";

export const generateNodeId = (): NodeID => {
  return nanoid();
};

export function makeParentProps(props: Partial<ParentProps>): ParentProps {
  return { ...defaultParentProps, ...props };
}

export function nodeOrdering(
  nodes: NodeType[],
  parentId: NodeID | null,
  zone: string,
): NodeType[] {
  
  const updateMap = new Map(nodes.map((u, i) => [u.id, i]));

  const updated = nodes.map((n) =>
    updateMap.has(n.id)
      ? { ...n, parent: { id: parentId, zone, order: updateMap.get(n.id)! } }
      : n,
  );

  const sorted = [...updated].sort((a, b) => a.parent.order - b.parent.order);

  return sorted;
}

export function extractUrl(value: string): string | null {
  const match = value.match(/url\(\s*(['"]?)(.*?)\1\s*\)/i);
  return match ? match[2] : null;
}