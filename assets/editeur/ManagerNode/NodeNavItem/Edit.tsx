import { type FC } from "react";
import { type NodeEditProps } from "../NodeConfigurationType";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import type { NodeNavItemType, NodeNavItemKind } from "./index";
import { styleForView } from "../../utils/styleHelper";
import TagNameEditable from "../NodeButton/components/TagNameEditable";
import { cn } from "@/editeur/lib/utils";

const Edit: FC<NodeEditProps> = () => {
  const { node: itemNode, onChange } = useNodeBuilderContext();
  const node = itemNode as NodeNavItemType;
  const c = itemNode.content ?? {};

  const style = styleForView(node?.attributes?.style ?? {});
  const commonProps = {
    "data-ce-id": node.id,
    "data-ce-type": node.type,
    id: node?.attributes?.id,
    className: cn("ce-nav-item", node?.attributes?.className ?? ""),
    style,
  };

  const updateContent = (patch: Partial<NodeNavItemType["content"]>) => onChange({ ...node, content: { ...node.content, ...patch } });
  const preventLinkNavigation = (e: React.MouseEvent) => e.preventDefault();

  const href = c.href ?? "";
  const target = c.target ?? "_self";
  const label = c.label ?? "";
  return (
    <TagNameEditable
      tagName="a"
      label={label}
      onChange={(value) => updateContent({ label: value })}
      href={href || "#"}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      onClick={preventLinkNavigation}
      {...commonProps}
    />
  );

};

export default Edit;
