import React, { type FC } from "react";
import { type NodeEditProps } from "../NodeConfigurationType";
import Form from "../../components/form";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import type { NodeHeaderType } from "./index";
import { cn } from "@editeur/lib/utils";

const Edit: FC<NodeEditProps> = () => {
  const { node, onChange, isSelected } = useNodeBuilderContext();
  const headerNode = node as NodeHeaderType;
  const tag = headerNode.content?.tag ?? "h1";
  const text = headerNode.content?.html ?? "";
  const className = cn(tag, node?.attributes?.className ||"");

  return isSelected() ? (
    <Form.InputEditor
      value={text}
      onBlur={value => onChange({
        ...node,
        content: { ...node.content, html: value },
      })}

      tagName={tag}

      data-ce-id={node.id}
      data-ce-type={node.type}
      className={className}
      style={node?.attributes?.style ?? {}}
      id={node?.attributes?.id ?? ""}
    />
  ) : React.createElement(tag,
    {
      "data-ce-id": node.id,
      "data-ce-type": node.type,

      className,
      style: node?.attributes?.style ?? {},
      id: node?.attributes?.id ?? "",
    }, text);
}

export default Edit;
