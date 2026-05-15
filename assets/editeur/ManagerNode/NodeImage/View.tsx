import { type FC } from "react";
import { useNodeContext } from "../../services/providers/NodeContext";
import { type NodeEditProps, type NodeViewProps } from "../NodeConfigurationType";
import type { NodeImageType } from ".";
import { styleForView } from "../../utils/styleHelper";
import { cn } from "@/editeur/lib/utils";

const View: FC<NodeViewProps|NodeEditProps> = () => {
    const { node } = useNodeContext() as { node: NodeImageType };
    const { style, ...restAttributes } = node?.attributes ?? {};

    const href = node.content?.href ?? "";
    const target = node.content?.target ?? "_self";
    const rel = target === "_blank" ? "noopener noreferrer" : undefined;

    if (href) {
        return (
            <a href={href} target={target} rel={rel}>
                <img src={node.content?.src ?? "https://placehold.net/3-800x600.png"} alt={node.content.alt ?? "..."} />
            </a>
        );
    }

    return (
        <img
            data-ce-id={node.id}
            data-ce-type={node.type}
            className={cn("ce-image", node?.attributes?.className ?? "")}
            {...restAttributes}
            style={styleForView(style)}
            src={node.content?.src ?? "https://placehold.net/3-800x600.png"}
            alt={node.content.alt ?? "..."} 
            loading="lazy"
        />
    );
}

export default View;
