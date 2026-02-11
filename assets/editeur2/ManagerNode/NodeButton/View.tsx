import React, { type FC } from "react";
import { type NodeViewProps } from "../NodeConfigurationType";
import { useNodeContext } from "../../services/providers/NodeContext";
import type { NodeButtonType } from "./index";
import { styleForView } from "../../utils/styleHelper";

const View: FC<NodeViewProps> = () => {
  const { node } = useNodeContext();
  const buttonNode = node as NodeButtonType;
  const buttonType = buttonNode.content?.buttonType ?? "button";
  const label = buttonNode.content?.label ?? "";
  const href = buttonNode.content?.href ?? "";
  const target = buttonNode.content?.target ?? "_self";
  const style = styleForView(node?.attributes?.style ?? {});

  const commonProps = {
    "data-ce-id": node.id,
    "data-ce-type": node.type,
    id: node?.attributes?.id ?? undefined,
    className: node?.attributes?.className ?? "",
    style,
  };

  if (buttonType === "link") {
    return (
      <a href={href || "#"} target={target} rel={target === "_blank" ? "noopener noreferrer" : undefined} {...commonProps}>
        {label}
      </a>
    );
  }

  return (
    <button type={buttonType === "submit" ? "submit" : "button"} {...commonProps}>
      {label}
    </button>
  );
};

export default View;
