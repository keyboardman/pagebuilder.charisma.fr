import { useAppContext } from "../services/providers/AppContext";
import { useBuilderContext } from "../services/providers/BuilderContext";
import { type ParentProps } from "../types/NodeType";
import nodeHelper from "../utils/nodeHelper";

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

    if (data && data?.action === "add") {

      const _node = nodeHelper.createNode(
        data.type,
        targetData?.id !== "root" ? targetData?.id : null,
        targetData?.zone,
        targetData?.order
      );

      updateNodes(
        nodeHelper.addNode(nodes, _node)
      );

    }

    if (data && data?.action === "move-node") {
      const _target = {
        id: targetData?.id !== "root" ? targetData?.id : null,
        zone: targetData?.zone,
        order: targetData?.order,
      } as ParentProps;

      updateNodes(
        nodeHelper.moveNode(nodes, data.id, data?.parent as ParentProps, _target)
      );

    }
  }

  return { onDragStart, onDragEnd, onDragOver };
}
