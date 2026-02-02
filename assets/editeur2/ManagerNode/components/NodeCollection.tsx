import type { NodeID, NodeType } from "../../types/NodeType";
import Node from "./Node";
import DropZone from "./DropZone";
import _ from "lodash";
import { APP_MODE, useAppContext } from "../../services/providers/AppContext";

export function NodeCollection({
  nodes,
  parentId,
  zone,
}: {
  nodes: Record<NodeID, NodeType>;
  parentId?: NodeID | null;
  zone: string;
}) {

  const { mode} = useAppContext();
  return (
    <>
      {_.map(_.sortBy(nodes, ['parent.order']), (node, key) => (<Node key={key} node={node} index={node.parent.order} />) )}
      {mode === APP_MODE.EDIT && (<DropZone
        parent={{ id: parentId ?? "root", zone, order: _.entries(nodes).length }}
      />)}

    </>
  );
}

export default NodeCollection;
