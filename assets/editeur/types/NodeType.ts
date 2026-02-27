export type NodeID = string;

export type NodesType = Record<NodeID, NodeType>

interface NodeAttributes extends React.HTMLAttributes<HTMLDivElement> {
  id?: string;
  className?: string;
  style?: React.CSSProperties | { [key: string]: string | number };
  options?: Record<string, string|number|boolean|null>
}

export interface ParentProps {
  id: NodeID | null;
  order: number;
  zone: string;
}

export const defaultParentProps: ParentProps = {
  id: null,
  order: 0,
  zone: "main",
};

export interface NodeType {
  id: NodeID;
  type: string;
  parent: ParentProps;
  attributes?: NodeAttributes;
  isDroppable?: boolean;
  content?: Record<string, any>;

}