import React, { type CSSProperties, type FC } from "react";
import { type NodeViewProps } from "../NodeConfigurationType";
import { useNodeContext } from "../../services/providers/NodeContext";
import type { NodeTextIconType } from "./index";
import { styleForView } from "../../utils/styleHelper";
import { cn } from "@/editeur/lib/utils";
import { NodeTextIconMedia } from "./icon";
import {
  resolveNodeTextIconSource,
  resolveIconSizeVariant,
  resolveNodeTextIconTag,
  nodeTextIconBodyClassName,
  toAlignItems,
  toJustifyContent,
} from "./shared";

const View: FC<NodeViewProps> = () => {
  const { node } = useNodeContext();
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
  const contentStyle = styleForView(node?.attributes?.style ?? {});

  const containerStyle: CSSProperties = {
    display: "flex",
    justifyContent: toJustifyContent(horizontalAlign),
    alignItems: toAlignItems(verticalAlign),
    gap: "0.5rem",
    ...contentStyle,
  };

  const textElement = React.createElement(tag, {
    className: textBodyClassName,
    dangerouslySetInnerHTML: { __html: html },
  });

  const iconElement = (
    <NodeTextIconMedia
      iconSource={iconSource}
      presetIcon={icon}
      themeIconClass={textNode.content?.themeIconClass}
      themeIconUrl={textNode.content?.themeIconUrl}
      iconImageUrl={textNode.content?.iconImageUrl}
      iconSizeVariant={iconSizeVariant}
      style={{ flexShrink: 0 }}
    />
  );

  const linkedText = linkUrl ? (
    <a href={linkUrl} className="ce-text-icon__link">
      {textElement}
    </a>
  ) : (
    textElement
  );

  return (
    <div
      className={cn("ce-text-icon", node?.attributes?.className ?? "")}
      id={node?.attributes?.id ?? undefined}
      style={containerStyle}
      data-ce-id={node.id}
      data-ce-type={node.type}
    >
      {iconPosition === "before" && iconElement}
      {linkedText}
      {iconPosition === "after" && iconElement}
    </div>
  );
};

export default View;
