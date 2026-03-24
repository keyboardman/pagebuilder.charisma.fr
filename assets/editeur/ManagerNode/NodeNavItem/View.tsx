import { type FC } from "react";
import { type NodeViewProps } from "../NodeConfigurationType";
import { useNodeContext } from "../../services/providers/NodeContext";
import { cn } from "@/editeur/lib/utils";
import type { NodeNavItemType, NodeNavItemKind } from "./index";
import { styleForView } from "../../utils/styleHelper";

const View: FC<NodeViewProps> = () => {
  const { node: itemNode } = useNodeContext();
  const node = itemNode as NodeNavItemType;
  
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
