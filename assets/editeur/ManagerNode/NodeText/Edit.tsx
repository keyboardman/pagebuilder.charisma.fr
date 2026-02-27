import React, { type FC } from "react";
import { type NodeEditProps } from "../NodeConfigurationType";
import Form from "../../components/form";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import type { NodeTextType } from "./index";
import cn from "classnames";
import { styleForView } from "../../utils/styleHelper";

const Edit: FC<NodeEditProps> = () => {
  const { node, onChange, isSelected } = useNodeBuilderContext();
  const textNode = node as NodeTextType;
  const tag = textNode.content?.tag ?? "div";
  const html = textNode.content?.html ?? "";

  const viewStyle = styleForView(node?.attributes?.style ?? {});

  return isSelected() ? (
    <Form.InputEditor
      data-ce-id={node.id}
      data-ce-type={node.type}
      value={html}
      onBlur={value => onChange({
        ...node,
        content: { ...node.content, html: value },
      })}

      tagName={tag}
      id={node?.attributes?.id ?? ""}
      className={cn(node?.attributes?.className || "")}
      style={viewStyle}
    />
  ) : (
    React.createElement(tag, {
      "data-ce-id": node.id,
      "data-ce-type": node.type,
      id: node?.attributes?.id ?? undefined,
      className: node?.attributes?.className ?? undefined,
      style: viewStyle,
      dangerouslySetInnerHTML: { __html: html },
    })
  )
}

export default Edit;
