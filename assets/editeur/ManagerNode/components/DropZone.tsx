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
  const isHover = isDropTarget ? "p-5 border-2 border-dashed border-primary bg-blue-900/20" : "p-1 border-none bg-transparent";

  return (
    <div
      ref={ref}
      className={`${isHover} m-1 duration-300 ease-in-out`}
    />
  );
}
