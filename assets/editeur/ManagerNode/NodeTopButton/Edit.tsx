import { type FC } from "react";
import { IoArrowUpOutline } from "react-icons/io5";
import { type NodeEditProps } from "../NodeConfigurationType";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import type { NodeTopButtonType } from "./index";
import { styleForView } from "../../utils/styleHelper";
import { cn } from "@/editeur/lib/utils";

const Edit: FC<NodeEditProps> = () => {
  const { node } = useNodeBuilderContext();
  const topButtonNode = node as NodeTopButtonType;
  const style = styleForView(node?.attributes?.style ?? {});

  return (
    <button
      type="button"
      data-ce-id={node.id}
      data-ce-type={node.type}
      id={node?.attributes?.id ?? undefined}
      className={cn("ce-top-button", node?.attributes?.className ?? "")}
      style={style}
      onClick={(e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      aria-label={topButtonNode.content?.ariaLabel ?? "Retour en haut"}
    >
      <IoArrowUpOutline size={20} color={topButtonNode.content?.iconColor ?? "#ffffff"} />
    </button>
  );
};

export default Edit;
