import type { NodeID } from "../../types/NodeType";

export function scrollCanvasToNode(nodeId: NodeID): void {
  const el = document.querySelector(`[data-ce-id="${CSS.escape(nodeId)}"]`);
  if (!el) {
    return;
  }

  el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
}
