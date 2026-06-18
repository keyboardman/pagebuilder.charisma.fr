import type { NodeID, NodeType } from "../../types/NodeType";
import Node from "./Node";
import DropZone from "./DropZone";
import _ from "lodash";
import { APP_MODE, useAppContext } from "../../services/providers/AppContext";

export function NodeCollection({
  nodes,
  parentId,
  zone,
  trailingDropzoneFill = false,
}: {
  nodes: Record<NodeID, NodeType>;
  parentId?: NodeID | null;
  zone: string;
  /** Trailing dropzone grows to fill remaining flex space (e.g. NodeNav horizontal). */
  trailingDropzoneFill?: boolean;
}) {

  const { mode } = useAppContext();
  const nodeCount = _.entries(nodes).length;
  return (
    <>
      {_.map(_.sortBy(nodes, ["parent.order"]), (node, key) => (
        <Node key={key} node={node} index={node.parent.order} />
      ))}
      {mode === APP_MODE.EDIT && (
        <DropZone
          parent={{ id: parentId ?? "root", zone, order: nodeCount }}
          isEmptyZone={nodeCount === 0}
          fillRemaining={trailingDropzoneFill}
        />
      )}

    </>
  );
}

export default NodeCollection;
