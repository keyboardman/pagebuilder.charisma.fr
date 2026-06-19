import React, { type FC } from "react";
import { type NodeViewProps } from "../NodeConfigurationType";
import { useNodeContext } from "../../services/providers/NodeContext";
import { APP_MODE, useAppContext } from "../../services/providers/AppContext";
import { useOptionalNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import Form from "../../components/form";
import type { NodeTextType } from "./index";
import { styleForView } from "../../utils/styleHelper";
import { cn } from "@/editeur/lib/utils";

const View: FC<NodeViewProps> = () => {
  const { node } = useNodeContext();
  const { mode } = useAppContext();
  const builder = useOptionalNodeBuilderContext();
  const textNode = node as NodeTextType;
  const tag = textNode.content?.tag ?? "div";
  const html = textNode.content?.html ?? "";
  const viewStyle = styleForView(node?.attributes?.style ?? {});
  const className = cn("ce-text", node?.attributes?.className ?? "");
  const isInlineEditing = mode === APP_MODE.EDIT && builder?.isSelected();

  if (isInlineEditing && builder) {
    return (
      <Form.InputEditor
        data-ce-id={node.id}
        data-ce-type={node.type}
        value={html}
        onBlur={(value) =>
          builder.onChange({
            ...node,
            content: { ...node.content, html: value },
          })
        }
        tagName={tag}
        id={node?.attributes?.id ?? undefined}
        className={className}
        style={viewStyle}
      />
    );
  }

  return React.createElement(tag, {
    dangerouslySetInnerHTML: { __html: html },
    className,
    id: node?.attributes?.id ?? null,
    style: viewStyle,
    "data-ce-id": node.id,
    "data-ce-type": node.type,
  });
};

export default View;
