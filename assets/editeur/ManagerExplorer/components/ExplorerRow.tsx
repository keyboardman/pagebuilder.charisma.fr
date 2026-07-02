import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronRight, Eye, EyeOff, GripVertical } from "lucide-react";
import { useDraggable } from "@dnd-kit/react";
import { Input } from "@/editeur/components/ui/input";
import type { NodeType } from "../../types/NodeType";
import { useBuilderContext } from "../../services/providers/BuilderContext";
import { useAppContext } from "../../services/providers/AppContext";
import { NODE_ROOT_TYPE } from "../../ManagerNode/NodeRoot";
import { isNodeEffectivelyHidden } from "../../utils/nodeVisibility";
import {
  getNodeDisplayLabel,
  getNodeTypeLabel,
  hasCustomNodeLabel,
} from "../utils/explorerTree";
import { cn } from "@/editeur/lib/utils";

function normalizeEditorLabel(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

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
  const { updateNode } = useBuilderContext();
  const { nodes } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [draftLabel, setDraftLabel] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const cancelledRef = useRef(false);
  const dragId = useRef(`explorer-node-${node.id}`).current;
  const { ref: dragRef, handleRef } = useDraggable({
    id: dragId,
    type: "move-node",
    feedback: "clone",
    data: { id: node.id, parent: node.parent, action: "move-node" },
    disabled: !isDraggable,
  });

  useEffect(() => {
    if (!isEditing) {
      return;
    }
    cancelledRef.current = false;
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [isEditing]);

  const startEditing = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    setDraftLabel(node.editorLabel ?? "");
    setIsEditing(true);
  };

  const commitEditing = () => {
    const nextLabel = normalizeEditorLabel(draftLabel);
    const currentLabel = normalizeEditorLabel(node.editorLabel ?? "");
    if (nextLabel !== currentLabel) {
      updateNode({ ...node, editorLabel: nextLabel });
    }
    setIsEditing(false);
  };

  const cancelEditing = () => {
    cancelledRef.current = true;
    setIsEditing(false);
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.stopPropagation();
    if (event.key === "Enter") {
      event.preventDefault();
      commitEditing();
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      cancelEditing();
    }
  };

  const handleInputBlur = () => {
    if (cancelledRef.current) {
      cancelledRef.current = false;
      return;
    }
    commitEditing();
  };

  const isRootNode = node.type === NODE_ROOT_TYPE;
  const effectivelyHidden = isNodeEffectivelyHidden(node.id, nodes);

  const handleToggleVisibility = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    updateNode({ ...node, hidden: !node.hidden });
  };

  return (
    <div
      ref={isDraggable ? dragRef : undefined}
      data-explorer-node-id={node.id}
      className={cn(
        "flex min-h-8 items-center gap-1 rounded-md px-1 text-sm transition-colors hover:bg-accent/60",
        isActive && "bg-accent text-accent-foreground",
        isDraggable && "cursor-pointer",
        effectivelyHidden && "opacity-50"
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
      <span
        className="flex min-w-0 flex-1 items-baseline gap-1 overflow-hidden"
        onDoubleClick={startEditing}
      >
        {isEditing ? (
          <Input
            ref={inputRef}
            type="text"
            value={draftLabel}
            placeholder={getNodeTypeLabel(node)}
            onChange={(event) => setDraftLabel(event.target.value)}
            onKeyDown={handleInputKeyDown}
            onBlur={handleInputBlur}
            onClick={(event) => event.stopPropagation()}
            onDoubleClick={(event) => event.stopPropagation()}
            className="h-6 min-w-[5rem] flex-1 px-1.5 text-sm font-medium"
            aria-label="Nom dans l'éditeur"
          />
        ) : (
          <>
            <span className="min-w-0 truncate font-medium">{getNodeDisplayLabel(node)}</span>
            {hasCustomNodeLabel(node) ? (
              <span className="text-xs text-muted-foreground">
                ({getNodeTypeLabel(node)})
              </span>
            ) : null}
          </>
        )}
      </span>
      {!isRootNode ? (
        <button
          type="button"
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm text-muted-foreground hover:text-foreground"
          onClick={handleToggleVisibility}
          aria-label={effectivelyHidden ? "Afficher le composant" : "Masquer le composant"}
        >
          {effectivelyHidden ? (
            <EyeOff className="h-3.5 w-3.5" />
          ) : (
            <Eye className="h-3.5 w-3.5" />
          )}
        </button>
      ) : null}
    </div>
  );
}
