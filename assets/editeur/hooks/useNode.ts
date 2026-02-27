import { useBuilderContext } from "../services/providers/BuilderContext";
import { useDraggable } from "@dnd-kit/react";
import type { NodeID, NodeType } from "../types/NodeType";
import { useRef } from "react";
import shortid from "shortid";
import { useAppContext } from "../services/providers/AppContext";

export default function useNode(id: NodeID) {
  const { getNode, getChildren } = useAppContext();
  const { setSelected, selected, updateNode, removeNode  } = useBuilderContext();

  const node = getNode(id) as NodeType;

  if (!node) throw new Error(`Node with id ${id} not found`);

  const dragId = useRef(shortid.generate());

  const { ref, handleRef } = useDraggable({
    id: dragId.current,
    feedback: "clone",
    type: "move-node",
    data: { id, parent: node?.parent, action: "move-node" },
  });

  const onSelect = () => {
    if (selected === id) {
      setSelected(null);
    } else {
      setSelected(id);
    }
  };

  const onChange = (node: NodeType) => {
    updateNode(node);
  };

  const onDelete = () => {
    removeNode(node);
  }

  const getNodeChildren = (area: string): Record<NodeID, NodeType> => {
    return getChildren(id, area);
  }

  return { node, drag: { ref, handleRef }, onSelect, onDelete, onChange, getChildren: getNodeChildren };
}
