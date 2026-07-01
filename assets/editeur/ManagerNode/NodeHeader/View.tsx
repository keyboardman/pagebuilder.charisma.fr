import React, { type FC } from "react";
import { type NodeViewProps } from "../NodeConfigurationType";
import { useNodeContext } from "../../services/providers/NodeContext";
import { APP_MODE, useAppContext } from "../../services/providers/AppContext";
import { useOptionalNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import Form from "../../components/form";
import type { NodeHeaderType } from "./index";
import { cn } from "@/editeur/lib/utils";
import { styleForView } from "../../utils/styleHelper";

const View: FC<NodeViewProps> = () => {
  const { node } = useNodeContext();
  const { mode } = useAppContext();
  const builder = useOptionalNodeBuilderContext();
  const headerNode = node as NodeHeaderType;
  const tag = headerNode.content?.tag ?? "h1";
  const html = headerNode.content?.html ?? "";
  const viewStyle = styleForView(node?.attributes?.style ?? {});
  const className = cn("ce-header", `ce-header-${tag.toLowerCase()}`, node?.attributes?.className ?? "");
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
