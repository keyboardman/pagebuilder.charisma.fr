import { type FC, type MouseEvent } from "react";
import { type NodeViewProps } from "../NodeConfigurationType";
import { useNodeContext } from "../../services/providers/NodeContext";
import { APP_MODE, useAppContext } from "../../services/providers/AppContext";
import { useOptionalNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import TagNameEditable from "../NodeButton/components/TagNameEditable";
import { cn } from "@/editeur/lib/utils";
import type { NodeNavItemType } from "./index";
import { styleForView } from "../../utils/styleHelper";

const View: FC<NodeViewProps> = () => {
  const { node: itemNode } = useNodeContext();
  const { mode } = useAppContext();
  const builder = useOptionalNodeBuilderContext();
  const node = itemNode as NodeNavItemType;
  const isInlineEditing = mode === APP_MODE.EDIT && builder?.isSelected();

  const style = styleForView(node?.attributes?.style ?? {});
  const commonProps = {
    "data-ce-id": node.id,
    "data-ce-type": node.type,
    id: node?.attributes?.id,
    className: cn("ce-nav-item", node?.attributes?.className ?? ""),
    style,
  };

  const c = itemNode.content ?? {};
  const href = c.href ?? "";
  const target = c.target ?? "_self";
  const label = c.label ?? "";

  if (isInlineEditing && builder) {
    return (
      <TagNameEditable
        tagName="a"
        label={label}
        onChange={(value) =>
          builder.onChange({
            ...node,
            content: { ...node.content, label: value },
          })
        }
        href={href || "#"}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
        onClick={(e: MouseEvent) => e.preventDefault()}
        {...commonProps}
      />
    );
  }

  return (
    <a
      href={href || "#"}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      {...commonProps}
    >
      {label}
    </a>
  );
};

export default View;
