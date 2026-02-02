import { createContext, type ReactNode, useContext } from "react";
import { type NodesType, type NodeType } from "../../types/NodeType";

export interface NodeBuilderProps {
    children: ReactNode;
}

export interface NodeBuilderValues<T extends NodeType = NodeType> {
  node: T; // Replace 'any' with the actual NodeType if available
  drag: {
    ref: (element: HTMLElement | null) => void;
    handleRef: (element: HTMLElement | null) => void;
  };
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onChange: (updatedNode: T) => void;
  getChildren: (nodeId: string, area?: string) => NodesType;
  isSelected: () => boolean;
}


export const NodeBuilderContext = createContext<NodeBuilderValues | null>(null);

export const useNodeBuilderContext = <T extends NodeType = NodeType>(): NodeBuilderValues<T> => {
  const context = useContext(NodeBuilderContext) as NodeBuilderValues<T> | null;
  if (!context) {
    throw new Error("useNodeBuilderContext must be used within a NodeBuilderProvider");
  }
  return context;
};
