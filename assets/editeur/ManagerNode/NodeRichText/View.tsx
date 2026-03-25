import React, { type FC } from "react";
import { type NodeViewProps } from "../NodeConfigurationType";
import { useNodeContext } from "../../services/providers/NodeContext";
import type { NodeRichTextType } from "./index";
import { styleForView } from "../../utils/styleHelper";
import { cn } from "@/editeur/lib/utils";

const View: FC<NodeViewProps> = () => {
  const { node } = useNodeContext();
  const richTextNode = node as NodeRichTextType;
  const html = richTextNode.content?.html ?? "";

  return (
    <div
      data-ce-id={node.id}
      data-ce-type={node.type}
      id={node?.attributes?.id ?? ""}
      className={cn("ce-rich-text ce-rich-text-pg", node?.attributes?.className ?? "")}
      style={styleForView(node?.attributes?.style ?? {})}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default View;
