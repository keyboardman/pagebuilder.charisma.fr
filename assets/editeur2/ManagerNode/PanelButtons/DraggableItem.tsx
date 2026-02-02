import React from "react";
import { useDraggable } from "@dnd-kit/react";

type DraggableItemProps = {
  id: string;
  children: React.ReactNode;
  data?: object | null | undefined;
};

function DraggableItem({ id, data, children }: DraggableItemProps) {
  const { ref, handleRef } = useDraggable({
    id,
    type: "add-block",
    feedback: "clone",
    data: data ?? {},
  });

  const child = React.Children.only(children) as React.ReactElement<{ ref?: React.Ref<unknown> }>;
  return (
    <div ref={ref} className="cursor-grab active:cursor-grabbing" style={{ touchAction: "none" }}>
      {child && React.isValidElement(child)
        ? React.cloneElement(child, { ref: handleRef } as Record<string, unknown>)
        : children}
    </div>
  );
}

export default DraggableItem;
