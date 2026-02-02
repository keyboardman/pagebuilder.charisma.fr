import { type FC, useCallback, useRef } from "react";
import { type NodeBuilderProps, NodeBuilderContext } from "./NodeBuilderContext";
import shortid from "shortid";
import { useDraggable } from "@dnd-kit/react";
import { type NodeType } from "../../types/NodeType";
import { useBuilderContext } from "./BuilderContext";
import { useNodeContext } from "./NodeContext";

export const NodeBuilderProvider: FC<NodeBuilderProps> = ({ children }: NodeBuilderProps) => {

    const { node, getChildren } = useNodeContext();

    const { selected, setSelected, updateNode, removeNode, duplicateNode } = useBuilderContext();

    const dragId = useRef(shortid.generate());

    const { ref, handleRef } = useDraggable({
        id: dragId.current,
        feedback: "clone",
        type: "move-node",
        data: { id: node.id, parent: node?.parent, action: "move-node" },
    });

    const onSelect = () => {
        if (selected === node.id) {
            setSelected(null);
        } else {
            setSelected(node.id);
        }
    };

    const onChange =(node: NodeType) => {
        updateNode(node);
    };

    const onDelete = () => {
        removeNode(node);
    };

    const onDuplicate = () => {
        duplicateNode(node);
    };

    const isSelected = useCallback(() => {
        return node.id === selected
    }, [selected, node])

    return (
        <NodeBuilderContext.Provider 
            value={{ node, drag: { ref, handleRef }, isSelected, onSelect, onDelete, onDuplicate, onChange, getChildren }} 
        >{children}</NodeBuilderContext.Provider>
    );
};

export default NodeBuilderProvider;
