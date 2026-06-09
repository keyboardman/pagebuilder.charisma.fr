import { Fragment } from "react";
import { NODE_ROOT_TYPE } from "../../ManagerNode/NodeRoot";
import type { NodeID, NodesType, NodeType } from "../../types/NodeType";
import { getChildZoneGroups, hasChildren } from "../utils/explorerTree";
import ExplorerDropZone from "./ExplorerDropZone";
import ExplorerRow from "./ExplorerRow";

export type ExplorerTreeNodeProps = {
  node: NodeType;
  nodes: NodesType;
  depth: number;
  expanded: Set<NodeID>;
  selected: NodeID | null;
  onToggleExpand: (id: NodeID) => void;
  onSelect: (id: NodeID) => void;
};

export default function ExplorerTreeNode({
  node,
  nodes,
  depth,
  expanded,
  selected,
  onToggleExpand,
  onSelect,
}: ExplorerTreeNodeProps) {
  const childGroups = getChildZoneGroups(nodes, node.id);
  const isExpandable = hasChildren(nodes, node.id);
  const isExpanded = expanded.has(node.id);
  const isActive = selected === node.id;
  const showZoneHeaders = childGroups.length > 1;
  const isDraggable = node.type !== NODE_ROOT_TYPE;

  console.log("childGroups", childGroups);

  const handleRowClick = () => {
    onSelect(node.id);
    if (isExpandable && !isExpanded) {
      onToggleExpand(node.id);
    }
  };

  const handleToggleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onToggleExpand(node.id);
  };

  return (
    <div role="treeitem" aria-expanded={isExpandable ? isExpanded : undefined}>
      <ExplorerRow
        node={node}
        depth={depth}
        isExpandable={isExpandable}
        isExpanded={isExpanded}
        isActive={isActive}
        isDraggable={isDraggable}
        onToggleExpand={handleToggleClick}
        onSelect={handleRowClick}
      />
      {isExpanded &&
        childGroups.map((group) => {
          const childDepth = depth + (showZoneHeaders ? 2 : 1);

          return (
            <div key={`${node.id}-${group.zone}`}>
              {showZoneHeaders && (
                <div
                  className="truncate px-1 py-0.5 text-xs text-muted-foreground"
                  style={{ paddingLeft: `${(depth + 1) * 12 + 24}px` }}
                >
                  {group.zone}
                </div>
              )}
              {group.children.length === 0 ? (
                <ExplorerDropZone
                  parent={{ id: node.id, zone: group.zone, order: 0 }}
                  depth={childDepth}
                />
              ) : (
                <>
                  {group.children.map((child) => (
                    <Fragment key={child.id}>
                      <ExplorerDropZone
                        parent={{
                          id: node.id,
                          zone: group.zone,
                          order: child.parent.order,
                        }}
                        depth={childDepth}
                      />
                      <ExplorerTreeNode
                        node={child}
                        nodes={nodes}
                        depth={childDepth}
                        expanded={expanded}
                        selected={selected}
                        onToggleExpand={onToggleExpand}
                        onSelect={onSelect}
                      />
                    </Fragment>
                  ))}
                  <ExplorerDropZone
                    parent={{
                      id: node.id,
                      zone: group.zone,
                      order: group.children.length,
                    }}
                    depth={childDepth}
                  />
                </>
              )}
            </div>
          );
        })}
    </div>
  );
}
