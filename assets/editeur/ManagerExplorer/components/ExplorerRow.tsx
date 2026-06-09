import { useRef } from "react";
import { ChevronDown, ChevronRight, GripVertical } from "lucide-react";
import { useDraggable } from "@dnd-kit/react";
import type { NodeType } from "../../types/NodeType";
import {
  getNodeDisplayLabel,
  getNodeTypeLabel,
  hasCustomNodeLabel,
} from "../utils/explorerTree";
import { cn } from "@/editeur/lib/utils";

export type ExplorerRowProps = {
  node: NodeType;
  depth: number;
  isExpandable: boolean;
  isExpanded: boolean;
  isActive: boolean;
  isDraggable: boolean;
  onToggleExpand: (event: React.MouseEvent) => void;
  onSelect: () => void;
};

export default function ExplorerRow({
  node,
  depth,
  isExpandable,
  isExpanded,
  isActive,
  isDraggable,
  onToggleExpand,
  onSelect,
}: ExplorerRowProps) {
  const dragId = useRef(`explorer-node-${node.id}`).current;
  const { ref: dragRef, handleRef } = useDraggable({
    id: dragId,
    type: "move-node",
    feedback: "clone",
    data: { id: node.id, parent: node.parent, action: "move-node" },
    disabled: !isDraggable,
  });

  return (
    <div
      ref={isDraggable ? dragRef : undefined}
      data-explorer-node-id={node.id}
      className={cn(
        "flex min-h-8 items-center gap-1 rounded-md px-1 text-sm transition-colors hover:bg-accent/60",
        isActive && "bg-accent text-accent-foreground",
        isDraggable && "cursor-pointer"
      )}
      style={{ paddingLeft: `${depth * 12 + 4}px` }}
      onClick={onSelect}
    >
      <button
        type="button"
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-sm text-muted-foreground hover:text-foreground",
          !isExpandable && "invisible"
        )}
        onClick={onToggleExpand}
        aria-label={isExpanded ? "Replier" : "Déplier"}
      >
        {isExpanded ? (
          <ChevronDown className="h-3.5 w-3.5" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5" />
        )}
      </button>
      {isDraggable ? (
        <button
          type="button"
          ref={handleRef}
          className="flex h-5 w-5 shrink-0 cursor-grab items-center justify-center rounded-sm text-muted-foreground hover:text-foreground active:cursor-grabbing"
          onClick={(event) => event.stopPropagation()}
          aria-label="Déplacer le composant"
        >
          <GripVertical className="h-3.5 w-3.5" />
        </button>
      ) : (
        <span className="h-5 w-5 shrink-0" aria-hidden />
      )}
      <span className="flex items-baseline gap-1 whitespace-nowrap">
        <span className="font-medium">{getNodeDisplayLabel(node)}</span>
        {hasCustomNodeLabel(node) ? (
          <span className="text-xs text-muted-foreground">
            ({getNodeTypeLabel(node)})
          </span>
        ) : null}
      </span>
    </div>
  );
}
