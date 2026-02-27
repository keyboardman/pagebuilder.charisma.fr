import React, { type FC } from "react";
import { type NodeEditProps } from "../NodeConfigurationType";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import type { NodeButtonType } from "./index";
import TagNameEditable from "./components/TagNameEditable";
import { styleForView } from "../../utils/styleHelper";

const Edit: FC<NodeEditProps> = () => {
  const { node, onChange } = useNodeBuilderContext();
  const buttonNode = node as NodeButtonType;
  const buttonType = buttonNode.content?.buttonType ?? "button";
  const label = buttonNode.content?.label ?? "";
  const href = buttonNode.content?.href ?? "";
  const target = buttonNode.content?.target ?? "_self";
  const style = styleForView(node?.attributes?.style ?? {});

  const className = node?.attributes?.className ?? "";
  const commonProps = {
    "data-ce-id": node.id,
    "data-ce-type": node.type,
    id: node?.attributes?.id ?? undefined,
    className,
    style,
  };

  const updateLabel = (value: string) =>
    onChange({
      ...node,
      content: { ...node.content, label: value },
    });

  const preventLinkNavigation = (e: React.MouseEvent) => e.preventDefault();

  if (buttonType === "link") {
    return <TagNameEditable tagName="a" label={label} onChange={updateLabel} {...commonProps} href={href || "#"} target={target} rel={target === "_blank" ? "noopener noreferrer" : undefined} onClick={preventLinkNavigation} />;
  }

  return (
    <TagNameEditable tagName="button" label={label} onChange={updateLabel} {...commonProps} type={buttonType === "submit" ? "submit" : "button"} />
  );
};

export default Edit;
