import { useDraggable } from "@dnd-kit/react";

type DraggableItemProps = {
  id: string;
  children: React.ReactNode;
  data?: object | null | undefined;
};

function DraggableItem({ id, data, children }: DraggableItemProps) {
  const draggable = useDraggable({
    id,
    type: "add-block",
    feedback: "clone",
    data: data ?? {},
  });

  return <div ref={draggable.ref}>{children}</div>;
}

export default DraggableItem;
