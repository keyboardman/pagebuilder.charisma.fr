import { useCallback, useEffect, useState } from "react";
import { useAppContext } from "../services/providers/AppContext";
import { useBuilderContext } from "../services/providers/BuilderContext";
import type { NodeID } from "../types/NodeType";
import ExplorerTreeNode from "./components/ExplorerTreeNode";
import { findRootNode, getAncestorIds } from "./utils/explorerTree";

const Explorer = () => {
  const { nodes } = useAppContext();
  const { selected, setSelected } = useBuilderContext();
  const [expanded, setExpanded] = useState<Set<NodeID>>(() => new Set());

  const rootNode = findRootNode(nodes);

  const onToggleExpand = useCallback((id: NodeID) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const onSelect = useCallback(
    (id: NodeID) => {
      setSelected(id);
    },
    [setSelected]
  );

  useEffect(() => {
    if (!selected) {
      return;
    }
    setExpanded((prev) => {
      const next = new Set(prev);
      getAncestorIds(nodes, selected).forEach((id) => next.add(id));
      next.add(selected);
      return next;
    });

    requestAnimationFrame(() => {
      document
        .querySelector(`[data-explorer-node-id="${selected}"]`)
        ?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
  }, [selected, nodes]);

  useEffect(() => {
    if (rootNode) {
      setExpanded((prev) => {
        if (prev.has(rootNode.id)) {
          return prev;
        }
        const next = new Set(prev);
        next.add(rootNode.id);
        return next;
      });
    }
  }, [rootNode?.id]);

  if (!rootNode) {
    return (
      <p className="px-1 text-sm text-muted-foreground">Aucun nœud racine trouvé.</p>
    );
  }

  return (
    <div
      className="explorer-tree min-h-0 flex-1 overflow-auto"
      role="tree"
      aria-label="Structure de la page"
    >
      <div className="explorer-tree__inner min-w-max pr-1">
        <ExplorerTreeNode
          node={rootNode}
          nodes={nodes}
          depth={0}
          expanded={expanded}
          selected={selected}
          onToggleExpand={onToggleExpand}
          onSelect={onSelect}
        />
      </div>
    </div>
  );
};

export default Explorer;
