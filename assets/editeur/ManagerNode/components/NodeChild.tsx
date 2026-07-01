import type { NodeType } from "../../types/NodeType";
import NodeProvider from "../../services/providers/NodeProvider";
import NodeBuilderProvider from "../../services/providers/NodeBuilderProvider";
import { APP_MODE, useAppContext } from "../../services/providers/AppContext";
import { useNodeContext } from "../../services/providers/NodeContext";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { type ReactNode } from "react";
import { isNodeEffectivelyHidden } from "../../utils/nodeVisibility";
import DropZone from "./DropZone";
import NodeRegistry, { isKnownNode } from "./NodeRegistry";
import { cn } from "@/editeur/lib/utils";

function NodeChildBuilder({ children }: { children: ReactNode }) {
  const { node, index } = useNodeContext();
  const { drag, isSelected, onSelect } = useNodeBuilderContext();
  const selected = isSelected();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect();
  };

  return (
    <>
      <DropZone parent={{ ...node.parent, order: index }} />
      <div
        ref={drag.ref}
        className={cn(
          "relative cursor-pointer rounded-sm",
          selected && "outline outline-1 outline-primary/60 outline-offset-1"
        )}
        onClick={handleClick}
      >
        {children}
      </div>
    </>
  );
}

function NodeChildComponent() {
  const { mode, nodes } = useAppContext();
  const { node } = useNodeContext();

  if (!node || !isKnownNode(node)) {
    return null;
  }

  const effectivelyHidden = isNodeEffectivelyHidden(node.id, nodes);

  if (effectivelyHidden) {
    return null;
  }

  const Component = NodeRegistry[node.type].view;

  return mode === APP_MODE.EDIT ? (
    <NodeChildBuilder>
      <Component />
    </NodeChildBuilder>
  ) : (
    <Component />
  );
}

export default function NodeChild({ node, index }: { node: NodeType; index: number }) {
  const { mode } = useAppContext();
  return (
    <NodeProvider node={node} index={index}>
      {mode === APP_MODE.EDIT ? (
        <NodeBuilderProvider>
          <NodeChildComponent />
        </NodeBuilderProvider>
      ) : (
        <NodeChildComponent />
      )}
    </NodeProvider>
  );
}
