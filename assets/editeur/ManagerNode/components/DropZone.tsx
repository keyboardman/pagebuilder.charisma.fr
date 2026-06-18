import { useDroppable } from "@dnd-kit/react";
import type { PropsWithChildren } from "react";
import type { ParentProps } from "../../types/NodeType";
import shortid from "shortid";
import { useRef } from "react";
import { defaultCollisionDetection } from "@dnd-kit/collision";

type DropZoneProps = PropsWithChildren & {
  parent: ParentProps;
  /**
   * When there are no nodes in the container, the dropzone should be visible
   * and fill the available space so users understand where they can drop.
   */
  isEmptyZone?: boolean;
  /** Grow to fill remaining space in a flex row/column (e.g. NodeNav horizontal). */
  fillRemaining?: boolean;
};

export default function DropZone({
  parent,
  isEmptyZone = false,
  fillRemaining = false,
}: DropZoneProps) {
  //const dropZoneId = `${parent?.id ?? 'root' }-${parent.zone}-${parent.order}`;
  const dropZoneId = useRef(shortid.generate()).current;

  const droppable = useDroppable({
    id: dropZoneId,
    data: parent,
    accept: ["add-block", "move-node"],
    collisionDetector: defaultCollisionDetection,
    collisionPriority: 2, // Higher priority
  });

  const { ref, isDropTarget } = droppable;
  const expandClass = fillRemaining ? "flex-1 min-w-0 min-h-[2.5rem] basis-0" : "";
  const hoverClass = `p-5 border-2 border-dashed border-primary bg-blue-900/20 ${expandClass}`.trim();
  const idleEmptyClass =
    // Full/obvious drop area when the container has no children.
    "p-5 border-2 border-dashed border-primary bg-blue-900/10 flex-1 w-full basis-full min-h-[2.5rem]";
  const idleClass = fillRemaining
    ? `${expandClass} p-1 border-none bg-transparent`
    : "p-1 border-none bg-transparent";

  const dropzoneClass = isDropTarget ? hoverClass : (isEmptyZone ? idleEmptyClass : idleClass);
  const marginClass = isEmptyZone || fillRemaining ? "m-0" : "m-1";

  return (
    <div
      ref={ref}
      className={`${dropzoneClass} ${marginClass} duration-300 ease-in-out`}
    />
  );
}
