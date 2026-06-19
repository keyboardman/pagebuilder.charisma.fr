import { type FC } from "react";
import { useNodeContext } from "../../services/providers/NodeContext";
import { type NodeEditProps, type NodeViewProps } from "../NodeConfigurationType";
import type { NodeImageType } from ".";
import { styleForView } from "../../utils/styleHelper";
import { cn } from "@/editeur/lib/utils";
import { useCanvasNavigation } from "../../hooks/useCanvasNavigation";

const View: FC<NodeViewProps | NodeEditProps> = () => {
  const { node } = useNodeContext() as { node: NodeImageType };
  const { style, ...restAttributes } = node?.attributes ?? {};
  const { preventLinkClick } = useCanvasNavigation();

  const href = node.content?.href ?? "";
  const target = node.content?.target ?? "_self";
  const rel = target === "_blank" ? "noopener noreferrer" : undefined;
  const src = node.content?.src ?? "https://placehold.net/3-800x600.png";
  const alt = node.content?.alt ?? "...";

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        data-ce-id={node.id}
        data-ce-type={node.type}
        className={cn("ce-image ce-image-link", node?.attributes?.className ?? "")}
        style={styleForView(style)}
        onClick={preventLinkClick}
      >
        <img src={src} alt={alt} loading="lazy" />
      </a>
    );
  }

  return (
    <img
      data-ce-id={node.id}
      data-ce-type={node.type}
      className={cn("ce-image", node?.attributes?.className ?? "")}
      {...restAttributes}
      style={styleForView(style)}
      src={src}
      alt={alt}
      loading="lazy"
    />
  );
};

export default View;
