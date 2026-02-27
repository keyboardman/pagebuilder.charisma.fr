import { DragOverlay } from "@dnd-kit/react";
import { useAppContext } from "../services/providers/AppContext";
import NodeRegistry from "../ManagerNode/components/NodeRegistry";
import { NodeProvider } from "../services/providers/NodeProvider";
import type { NodeType } from "../types/NodeType";
import NodeComponentButton from "../ManagerNode/PanelButtons/NodeComponentButton";

type DragData = {
  action?: "add" | "move-node";
  type?: string;
  id?: string;
};

type CustomDragOverlayProps = {
  activeId: string | null;
  activeData: DragData | null;
};

export default function CustomDragOverlay({ activeId, activeData }: CustomDragOverlayProps) {
  const { getNode } = useAppContext();

  if (!activeId || !activeData) {
    return null;
  }

  // Pour les boutons depuis la sidebar, afficher le bouton
  if (activeData.action === "add" && activeData.type) {
    const registry = NodeRegistry[activeData.type];
    if (registry && registry.button) {
      return (
        <DragOverlay>
          <div className="pointer-events-none">
            <NodeComponentButton 
              label={registry.button.label} 
              icon={<registry.button.icon />} 
            />
          </div>
        </DragOverlay>
      );
    }
  }

  // Pour les nodes existants déplacés, afficher le composant View avec limitation de taille
  let nodeToRender: NodeType | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let Component: React.ComponentType<any> | null = null;

  if (activeData.action === "move-node" && activeData.id) {
    const node = getNode(activeData.id);
    if (node) {
      nodeToRender = node;
      const registry = NodeRegistry[node.type];
      if (registry && registry.view) {
        Component = registry.view;
      }
    }
  }

  if (!nodeToRender || !Component) {
    return null;
  }

  return (
    <DragOverlay>
      <div
        className="pointer-events-none max-w-[150px] max-h-[150px] flex items-center justify-center overflow-hidden [&_img]:max-w-[150px] [&_img]:max-h-[150px] [&_img]:w-auto [&_img]:h-auto [&_img]:object-contain [&_img]:block [&_video]:max-w-[150px] [&_video]:max-h-[150px] [&_video]:w-auto [&_video]:h-auto [&_video]:object-contain"
      >
        <NodeProvider node={nodeToRender} index={0}>
          <div className="max-w-[100px] max-h-[100px] flex items-center justify-center bg-gray-500 text-white p-2 overflow-hidden">
            <Component />
          </div>
        </NodeProvider>
      </div>
    </DragOverlay>
  );
}

