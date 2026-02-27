import { type FC } from "react";
import { useNodeContext } from "../../services/providers/NodeContext";
import { type NodeEditProps, type NodeViewProps } from "../NodeConfigurationType";
import type { NodeImageType } from ".";
import { styleForView } from "../../utils/styleHelper";

const View: FC<NodeViewProps|NodeEditProps> = () => {
    const { node } = useNodeContext() as { node: NodeImageType };
    const { style, ...restAttributes } = node?.attributes ?? {};
    return (
        <img
            data-ce-id={node.id}
            data-ce-type={node.type}
            className="w-full"
            {...restAttributes}
            style={styleForView(style)}
            src={node.content?.src ?? "https://placehold.net/3-800x600.png"}
            alt={node.content.alt ?? "..."}
        />
    );
}

export default View;
