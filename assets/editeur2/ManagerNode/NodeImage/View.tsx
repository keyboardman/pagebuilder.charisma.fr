import { type FC } from "react";
import { useNodeContext } from "../../services/providers/NodeContext";
import { type NodeEditProps, type NodeViewProps } from "../NodeConfigurationType";
import type { NodeImageType } from ".";

const View: FC<NodeViewProps|NodeEditProps> = () => {
    const { node } = useNodeContext() as { node: NodeImageType };
    return (
        <img
            data-ce-id={node.id}
            data-ce-type={node.type}
            className="w-full"
            {...node?.attributes}
            src={node.content?.src ?? "https://placehold.net/3-800x600.png"}
            alt={node.content.alt ?? "..."}
        />
    );
}

export default View;
