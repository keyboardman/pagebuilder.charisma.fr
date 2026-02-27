import { createContext, type ReactNode, useContext } from "react";
import { type NodeType, type NodesType } from "../../types/NodeType";

export interface NodeContextValues<T extends NodeType = NodeType> {
    node: T;
    index: number;
    getChildren: (nodeId: string, area?: string) => NodesType;
}

export interface NodeContextProps<T extends NodeType = NodeType> {
  node: T; // Replace 'any' with the actual NodeType if available
  index: number;
  children: ReactNode;
}

export const NodeContext = createContext<NodeContextValues | null>(null);

export const useNodeContext = <T extends NodeType = NodeType>(): NodeContextValues<T> => {
  const context = useContext(NodeContext) as NodeContextValues<T> | null;
  if (!context) {
    throw new Error("useNodeContext must be used within a NodeProvider");
  }
  return context;
};
