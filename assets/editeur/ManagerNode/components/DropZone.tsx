import { useDroppable } from "@dnd-kit/react";
import type { PropsWithChildren } from "react";
import type { ParentProps } from "../../types/NodeType";
import shortid from "shortid";
import { useRef } from "react";
import { defaultCollisionDetection } from "@dnd-kit/collision";

type DropZoneProps = PropsWithChildren & {
  parent: ParentProps;
};

export default function DropZone({ parent }: DropZoneProps) {
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
  const isHover = isDropTarget ? "p-10 bg-primary/20 border-2 border-dashed border-primary" : "p-5 bg-gray-50/20 border-dotted border border-gray-200";
  return (
    <div
      ref={ref}
      className={`${isHover} bg-diagonal-blue m-1 duration-300 ease-in-out`}
    />
  );
}
