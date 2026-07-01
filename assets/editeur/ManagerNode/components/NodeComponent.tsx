import { useState, type ReactNode } from "react";
import { useNodeContext } from "../../services/providers/NodeContext";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import NodeRegistry, { isKnownNode } from "./NodeRegistry";
import { APP_MODE } from "../../services/providers/AppContext";
import { NODE_ROOT_TYPE } from "../NodeRoot";
import { useAppContext } from "../../services/providers/AppContext";
import { isNodeEffectivelyHidden } from "../../utils/nodeVisibility";
import DropZone from "./DropZone";
import NodeMenu from "./NodeMenu";
import { cn } from "@/editeur/lib/utils";

function EmptySettings() {
  return false;
}

function NodeBuilderComponent({ children }: { children: ReactNode }) {
  const { node, index } = useNodeContext();
  const { drag, isSelected, onSelect } = useNodeBuilderContext();
  const [hovered, setHovered] = useState(false);

  const isRootNode = node.type === NODE_ROOT_TYPE;
  const selected = isSelected();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect();
  };

  return (
    <>
      {!isRootNode && <DropZone parent={{ ...node.parent, order: index }} />}
      <div
        ref={drag.ref}
        data-ce-id={node.id}
        className={cn(
          "relative cursor-pointer overflow-visible rounded-sm border transition-colors",
          selected ? "border-primary/60" : "border-border/50",
          hovered && !selected && "border-primary/40"
        )}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={handleClick}
      >
        <div>{children}</div>
        {selected ? <NodeMenu /> : null}
      </div>
    </>
  );
}

function NodeComponent() {
  const { mode, nodes } = useAppContext();
  const { node } = useNodeContext();

  if (!node) return <EmptySettings />;

  if (!isKnownNode(node)) {
    return <EmptySettings />;
  }

  const effectivelyHidden = isNodeEffectivelyHidden(node.id, nodes);

  if (effectivelyHidden) {
    return null;
  }

  const Component = NodeRegistry[node.type].view;

  return mode === APP_MODE.EDIT ? (
    <NodeBuilderComponent>
      <Component />
    </NodeBuilderComponent>
  ) : (
    <Component />
  );
}

export default NodeComponent;
