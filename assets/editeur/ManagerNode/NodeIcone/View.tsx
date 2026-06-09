import { type CSSProperties, type FC } from "react";
import { type NodeViewProps } from "../NodeConfigurationType";
import { useNodeContext } from "../../services/providers/NodeContext";
import type { NodeIconeType } from "./index";
import { styleForView } from "../../utils/styleHelper";
import { cn } from "@/editeur/lib/utils";
import { NodeTextIconMedia } from "../NodeTextIcon/icon";
import {
  resolveNodeTextIconSource,
  toAlignItems,
  toJustifyContent,
} from "../NodeTextIcon/shared";
import {
  resolveNodeIconeContainerStyle,
  resolveNodeIconeIconMediaStyle,
  resolveNodeIconeIconSize,
} from "./shared";

const View: FC<NodeViewProps> = () => {
  const { node } = useNodeContext();
  const iconeNode = node as NodeIconeType;
  const icon = iconeNode.content?.icon ?? "star";
  const iconSource = resolveNodeTextIconSource(iconeNode.content ?? {});
  const { iconSizeVariant, customSizeStyle } = resolveNodeIconeIconSize(iconeNode.content);
  const linkUrl = iconeNode.content?.linkUrl ?? "";
  const horizontalAlign = iconeNode.content?.horizontalAlign ?? "left";
  const verticalAlign = iconeNode.content?.verticalAlign ?? "middle";
  const containerStyle: CSSProperties = {
    display: "flex",
    justifyContent: toJustifyContent(horizontalAlign),
    alignItems: toAlignItems(verticalAlign),
    ...styleForView(resolveNodeIconeContainerStyle(iconeNode)),
  };
  const iconMediaStyle = styleForView({
    ...resolveNodeIconeIconMediaStyle(iconeNode),
    ...customSizeStyle,
  });

  const iconElement = (
    <NodeTextIconMedia
      iconSource={iconSource}
      presetIcon={icon}
      themeIconClass={iconeNode.content?.themeIconClass}
      themeIconUrl={iconeNode.content?.themeIconUrl}
      iconImageUrl={iconeNode.content?.iconImageUrl}
      iconSizeVariant={iconSizeVariant}
      style={iconMediaStyle}
    />
  );

  const linkedIcon = linkUrl ? (
    <a href={linkUrl} className="ce-icone__link" target="_blank" rel="noopener noreferrer">
      {iconElement}
    </a>
  ) : (
    iconElement
  );

  return (
    <div
      className={cn("ce-icone", node?.attributes?.className ?? "")}
      id={node?.attributes?.id ?? undefined}
      style={containerStyle}
      data-ce-id={node.id}
      data-ce-type={node.type}
    >
      {linkedIcon}
    </div>
  );
};

export default View;
