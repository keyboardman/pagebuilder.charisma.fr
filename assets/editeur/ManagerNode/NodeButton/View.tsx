import React, { type FC } from "react";
import { type NodeViewProps } from "../NodeConfigurationType";
import { useNodeContext } from "../../services/providers/NodeContext";
import { APP_MODE, useAppContext } from "../../services/providers/AppContext";
import type { NodeButtonType } from "./index";
import { sanitizeButtonLabelHtml } from "./shared";
import { styleForView } from "../../utils/styleHelper";
import { cn } from "@/editeur/lib/utils";

const View: FC<NodeViewProps> = () => {
  const { node } = useNodeContext();
  const { mode } = useAppContext();
  const buttonNode = node as NodeButtonType;
  const buttonType = buttonNode.content?.buttonType ?? "button";
  const labelHtml = sanitizeButtonLabelHtml(buttonNode.content?.label ?? "");
  const href = buttonNode.content?.href ?? "";
  const target = buttonNode.content?.target ?? "_self";
  const style = styleForView(node?.attributes?.style ?? {});
  const isEdit = mode === APP_MODE.EDIT;

  const preventEditInteraction = (e: React.MouseEvent) => {
    if (isEdit) {
      e.preventDefault();
    }
  };

  const commonProps = {
    "data-ce-id": node.id,
    "data-ce-type": node.type,
    id: node?.attributes?.id ?? undefined,
    className: cn(`ce-button ce-button-${buttonNode.content?.size ?? "medium"} ce-button-${buttonNode.content?.variant ?? "default"}`, node?.attributes?.className ?? ""),
    style,
    onClick: preventEditInteraction,
    dangerouslySetInnerHTML: { __html: labelHtml },
  };

  if (buttonType === "link") {
    return (
      <a href={href || "#"} target={target} rel={target === "_blank" ? "noopener noreferrer" : undefined} {...commonProps} />
    );
  }

  return (
    <button type={buttonType === "submit" ? "submit" : "button"} {...commonProps} />
  );
};

export default View;
