import React, { type FC } from "react";
import { type NodeEditProps } from "../NodeConfigurationType";
import Form from "../../components/form";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import type { NodeHtmlType } from "./index";
import { styleForView } from "../../utils/styleHelper";

const Edit: FC<NodeEditProps> = () => {
  const { node, onChange, isSelected } = useNodeBuilderContext();
  const htmlNode = node as NodeHtmlType;
  const html = htmlNode.content?.html ?? "";

  const viewStyle = styleForView(node?.attributes?.style ?? {});
  const className = node?.attributes?.className ?? "";
  const id = node?.attributes?.id ?? "";

  const handleChange = (value: string) =>
    onChange({
      ...node,
      content: { ...node.content, html: value ?? "" },
    });

  if (!isSelected()) {
    return (
      <div
        data-ce-id={node.id}
        data-ce-type={node.type}
        id={id || undefined}
        className={className || undefined}
        style={viewStyle}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <div
      data-ce-id={node.id}
      data-ce-type={node.type}
      id={id || undefined}
      className={className || undefined}
      style={viewStyle}
    >
      <Form.Textarea
        className="w-full h-32 font-mono text-xs"
        value={html}
        onChange={(value: any) => handleChange(value as string)}
        placeholder="<div>Mon HTML personnalisé</div>"
      />
      <div
        className="mt-2 border-t pt-2"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};

export default Edit;

