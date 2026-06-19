import React, { type CSSProperties, type FC } from "react";
import { type NodeViewProps } from "../NodeConfigurationType";
import { useNodeContext } from "../../services/providers/NodeContext";
import { APP_MODE, useAppContext } from "../../services/providers/AppContext";
import { useOptionalNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import Form from "../../components/form";
import type { NodeTextIconType } from "./index";
import { styleForView } from "../../utils/styleHelper";
import { cn } from "@/editeur/lib/utils";
import { NodeTextIconMedia } from "./icon";
import {
  resolveNodeTextIconSource,
  resolveIconSizeVariant,
  resolveNodeTextIconTag,
  resolveNodeTextIconContainerStyle,
  resolveNodeTextIconTextStyle,
  resolveNodeTextIconIconMediaStyle,
  nodeTextIconBodyClassName,
  toAlignItems,
  toJustifyContent,
} from "./shared";

const View: FC<NodeViewProps> = () => {
  const { node } = useNodeContext();
  const { mode } = useAppContext();
  const builder = useOptionalNodeBuilderContext();
  const textNode = node as NodeTextIconType;
  const tag = resolveNodeTextIconTag(textNode.content?.tag);
  const textBodyClassName = nodeTextIconBodyClassName(tag);
  const html = textNode.content?.html ?? "";
  const icon = textNode.content?.icon ?? "none";
  const iconSource = resolveNodeTextIconSource(textNode.content ?? {});
  const iconPosition = textNode.content?.iconPosition ?? "before";
  const iconSizeVariant = resolveIconSizeVariant(textNode.content ?? {});
  const linkUrl = textNode.content?.linkUrl ?? "";
  const horizontalAlign = textNode.content?.horizontalAlign ?? "left";
  const verticalAlign = textNode.content?.verticalAlign ?? "middle";
  const isInlineEditing = mode === APP_MODE.EDIT && builder?.isSelected();

  const containerStyle: CSSProperties = {
    display: "flex",
    justifyContent: toJustifyContent(horizontalAlign),
    alignItems: toAlignItems(verticalAlign),
    gap: "0.5rem",
    ...styleForView(resolveNodeTextIconContainerStyle(textNode)),
  };
  const textStyle = styleForView(resolveNodeTextIconTextStyle(textNode));
  const iconMediaStyle = styleForView(resolveNodeTextIconIconMediaStyle(textNode));

  const iconElement = (
    <NodeTextIconMedia
      iconSource={iconSource}
      presetIcon={icon}
      themeIconClass={textNode.content?.themeIconClass}
      themeIconUrl={textNode.content?.themeIconUrl}
      iconImageUrl={textNode.content?.iconImageUrl}
      iconSizeVariant={iconSizeVariant}
      style={iconMediaStyle}
    />
  );

  const textElement =
    isInlineEditing && builder ? (
      <Form.InputEditor
        value={html}
        tagName={tag}
        onBlur={(value) =>
          builder.onChange({
            ...node,
            content: { ...node.content, html: value },
          })
        }
        className={textBodyClassName}
        style={textStyle}
      />
    ) : (
      React.createElement(tag, {
        className: textBodyClassName,
        style: textStyle,
        dangerouslySetInnerHTML: { __html: html },
      })
    );

  const linkedText =
    linkUrl && !isInlineEditing ? (
      <a href={linkUrl} className="ce-text-icon__link" target="_blank">
        {textElement}
      </a>
    ) : (
      textElement
    );

  const linkedIcon =
    linkUrl && !isInlineEditing ? (
      <a href={linkUrl} className="ce-text-icon__link" target="_blank">
        {iconElement}
      </a>
    ) : (
      iconElement
    );

  return (
    <div
      className={cn("ce-text-icon", node?.attributes?.className ?? "")}
      id={node?.attributes?.id ?? undefined}
      style={containerStyle}
      data-ce-id={node.id}
      data-ce-type={node.type}
    >
      {iconPosition === "before" && linkedIcon}
      {linkedText}
      {iconPosition === "after" && linkedIcon}
    </div>
  );
};

export default View;
