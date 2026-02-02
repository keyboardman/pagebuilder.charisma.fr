import React, { type FC } from "react";
import { type NodeViewProps } from "../NodeConfigurationType";
import { useNodeContext } from "../../services/providers/NodeContext";
import type { NodeTextType } from "./index";

const View: FC<NodeViewProps> = () => {
  const { node } = useNodeContext();
  const textNode = node as NodeTextType;
  const tag = textNode.content?.tag ?? "div";
  const html = textNode.content?.html ?? "";

  return (
    <div
      data-ce-id={node.id}
      data-ce-type={node.type}
      className={node?.attributes?.className ?? ""}
      style={node?.attributes?.style ?? {}}
      id={node?.attributes?.id ?? ""}
    >
      {React.createElement(
        tag,
        {
          dangerouslySetInnerHTML: { __html: html }
        }
      )}
    </div>
  );
}

export default View;
