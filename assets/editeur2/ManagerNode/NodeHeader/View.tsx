import React, { type FC } from "react";
import { type NodeViewProps } from "../NodeConfigurationType";
import { useNodeContext } from "../../services/providers/NodeContext";
import type { NodeHeaderType } from "./index";
import { cn } from "@editeur/lib/utils";
import { styleForView } from "../../utils/styleHelper";

const View: FC<NodeViewProps> = () => {
  const { node } = useNodeContext();
  const headerNode = node as NodeHeaderType;
  const tag = headerNode.content?.tag ?? "h1";
  const text = headerNode.content?.html ?? "";
  const className = cn(tag, node?.attributes?.className || "");

  return React.createElement(
    tag,
    {
      "data-ce-id": node.id,
      "data-ce-type": node.type,
      className,
      style: styleForView(node?.attributes?.style ?? {}),
      id: node?.attributes?.id ?? "",
    },
    text
  );
}

export default View;

