import { useRef } from "react";
import { useDroppable } from "@dnd-kit/react";
import { defaultCollisionDetection } from "@dnd-kit/collision";
import shortid from "shortid";
import type { ParentProps } from "../../types/NodeType";
import { cn } from "@/editeur/lib/utils";

type ExplorerDropZoneProps = {
  parent: ParentProps;
  depth: number;
};

export default function ExplorerDropZone({ parent, depth }: ExplorerDropZoneProps) {
  const dropZoneId = useRef(shortid.generate()).current;

  const { ref, isDropTarget } = useDroppable({
    id: `explorer-drop-${dropZoneId}`,
    data: {
      id: parent.id ?? "root",
      zone: parent.zone,
      order: parent.order,
    },
    accept: ["move-node"],
    collisionDetector: defaultCollisionDetection,
    collisionPriority: 3,
  });

  return (
    <div
      ref={ref}
      className={cn(
        "mx-1 rounded-sm transition-all duration-150",
        isDropTarget ? "my-0.5 h-2 bg-primary/50" : "h-1 hover:h-1.5 hover:bg-muted/80"
      )}
      style={{ marginLeft: `${depth * 12 + 4}px` }}
      aria-hidden
    />
  );
}
