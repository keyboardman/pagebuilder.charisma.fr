import type { NodeID, NodeType } from "../../types/NodeType";
import NodeChild from "./NodeChild";
import DropZone from "./DropZone";
import _ from "lodash";
import { APP_MODE, useAppContext } from "../../services/providers/AppContext";

export function NodeCollectionChild({
  nodes,
  parentId,
  zone,
}: {
  nodes: Record<NodeID, NodeType>;
  parentId?: NodeID | null;
  zone: string;
}) {

  const { mode } = useAppContext();
  return (
    <>
      {_.map(_.sortBy(nodes, ['parent.order']), (node, key) => (
        <NodeChild key={key} node={node} index={node.parent.order} />
      ))}
      {mode === APP_MODE.EDIT && (
        <DropZone
          parent={{ id: parentId ?? "root", zone, order: _.entries(nodes).length }}
        />
      )}
    </>
  );
}

export default NodeCollectionChild;

