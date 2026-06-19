import type { NodeType } from "@editeur/types/NodeType";

export function createTestNode(overrides: Partial<NodeType> = {}): NodeType {
  return {
    id: "test-node-1",
    type: "node-text",
    parent: { id: null, order: 0, zone: "main" },
    ...overrides,
  };
}
