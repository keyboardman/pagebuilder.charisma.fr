import { useAppContext } from "../services/providers/AppContext";
import { useBuilderContext } from "../services/providers/BuilderContext";
import { type ParentProps } from "../types/NodeType";
import nodeHelper from "../utils/nodeHelper";
import { canPlaceUnderParent } from "../utils/formDnd";

import type {DragDropEvents} from '@dnd-kit/abstract';
import {DragDropManager} from '@dnd-kit/dom';
import type { Draggable, Droppable} from '@dnd-kit/dom';

type Events = DragDropEvents<Draggable, Droppable, DragDropManager>;
type DragEndHandler = Events['dragend'];

export default function useDnd() {
  const { nodes } = useAppContext();
  const { updateNodes } = useBuilderContext();

  function onDragOver() {}

  function onDragStart() {}

  const onDragEnd:DragEndHandler = (event, _manager ) => {
    const { operation: { source, target, canceled }} = event;

    // Si l'opération est annulée ou pas de target valide, on ne fait rien
    if (canceled || !target) {
      console.log("Drag annulé - pas de drop valide");
      return;
    }

    const data = source?.data;

    if (data?.id === target.id) {
      console.log("Drag annulé - même cible");
      return;
    }

    const targetData = target?.data;
    const parentId = targetData?.id !== "root" ? targetData?.id : null;
    const parentNode = parentId ? nodes[parentId] : null;

    if (data && data?.action === "add") {
      const addedType = data.type as string;
      if (parentNode?.type === "node-nav" && addedType !== "node-nav-item") {
        return;
      }
      if (addedType === "node-nav-item" && (!parentNode || parentNode.type !== "node-nav")) {
        return;
      }
      if (!canPlaceUnderParent(nodes, addedType, parentId)) {
        return;
      }

      const _node = nodeHelper.createNode(
        addedType,
        parentId,
        targetData?.zone ?? "main",
        targetData?.order ?? 0
      );

      updateNodes(
        nodeHelper.addNode(nodes, _node)
      );

    }

    if (data && data?.action === "move-node") {
      const _target = {
        id: parentId,
        zone: targetData?.zone ?? "main",
        order: targetData?.order ?? 0,
      } as ParentProps;

      const movingNode = nodes[data.id];
      if (movingNode?.type === "node-nav-item") {
        if (!parentNode || parentNode.type !== "node-nav") {
          return;
        }
      } else if (parentNode?.type === "node-nav") {
        return;
      }
      if (!canPlaceUnderParent(nodes, movingNode.type, parentId)) {
        return;
      }

      updateNodes(
        nodeHelper.moveNode(nodes, data.id, data?.parent as ParentProps, _target)
      );

    }
  }

  return { onDragStart, onDragEnd, onDragOver };
}
