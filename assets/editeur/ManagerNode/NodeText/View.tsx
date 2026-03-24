import React, { type FC } from "react";
import { type NodeViewProps } from "../NodeConfigurationType";
import { useNodeContext } from "../../services/providers/NodeContext";
import type { NodeTextType } from "./index";
import { styleForView } from "../../utils/styleHelper";
import { cn } from "@/editeur/lib/utils";

const View: FC<NodeViewProps> = () => {
  const { node } = useNodeContext();
  const textNode = node as NodeTextType;
  const tag = textNode.content?.tag ?? "div";
  const html = textNode.content?.html ?? "";

  return React.createElement(
    tag,
    {
      dangerouslySetInnerHTML: { __html: html },
      className: cn("ce-text", node?.attributes?.className ?? ""),
      id: node?.attributes?.id ?? null,
      style: styleForView(node?.attributes?.style ?? {}),
      "data-ce-id": node.id,
      "data-ce-type": node.type,

    }
  )
}

export default View;
