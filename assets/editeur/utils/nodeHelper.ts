import NodeRegistry from "../ManagerNode/components/NodeRegistry";
import { NODE_SLIDESHOW_TYPE } from "../ManagerNode/NodeSlideshow";
import { normalizeSlideshowContent } from "../ManagerNode/NodeSlideshow/slideshowApi";
import { NODE_ROOT_TYPE } from "../ManagerNode/NodeRoot";
import type { NodeID, NodesType, NodeType, ParentProps } from "../types/NodeType";
import { generateNodeId, makeParentProps } from "./helpers";

function cloneNodes(nodes: NodesType): NodesType {
    return JSON.parse(JSON.stringify(nodes));
}

function deleteNodeRecursively(nodes: NodesType, id: string): void {
    const current = nodes[id];
    if (!current) return;

    Object.values(nodes)
        .filter((n) => n.parent && n.parent.id === current.id)
        .forEach((child) => deleteNodeRecursively(nodes, child.id));

    delete nodes[id];
}

function reindexSiblingOrders(nodes: NodesType, parentId: NodeID | null, zone: string): void {
    const siblings = Object.values(nodes)
        .filter((n) => n.parent && n.parent.id === parentId && n.parent.zone === zone)
        .sort((a, b) => a.parent.order - b.parent.order);

    siblings.forEach((sibling, index) => {
        sibling.parent.order = index;
    });
}

function isInvalidNode(nodes: NodesType, node: NodeType): boolean {
    if (node.type === NODE_ROOT_TYPE) {
        return false;
    }
    if (!(node.type in NodeRegistry)) {
        return true;
    }
    const parentId = node.parent?.id;
    return parentId != null && !nodes[parentId];
}

const nodeHelper = {
    createNode: ( type: string, parentId: NodeID | null, zone = "main", order: number = 0): NodeType => {
        const id = generateNodeId();
        const parent = makeParentProps({ id: parentId, zone, order });
        const config = NodeRegistry[type];

        if (!config) {
            throw new Error(`Type de node inconnu : ${type}`);
        }

        return {
            id,
            type,
            parent,
            ...config.default,
        } as NodeType;
    },
    addNode: (nodes: NodesType, newNode: NodeType): NodesType => {

        // --- ajouter l'élément dans la nouvelle liste ---
        const _targets = nodeHelper.getChildren(nodes, newNode.parent.id, newNode.parent.zone);

        // décale les éléments existants pour faire de la place
        Object.values(_targets).forEach(node => {
            if (node.parent.order >= newNode.parent.order) {
                node.parent.order += 1;
            }
        });

        _targets[newNode.id] = newNode;

        // réordonne les nodes de la cible
        const sortedTargets = Object.fromEntries(
            Object.values(_targets)
            .sort((a, b) => a.parent.order - b.parent.order)
            .map(n => [n.id, n])
        );

        const _nodes = nodeHelper.updateNodes(nodes, sortedTargets);

        return _nodes;

    },
    moveNode: (nodes: NodesType, id: NodeID, source: ParentProps, target: ParentProps): NodesType => {
        // ne rien faire
        if (id === target.id) return nodes;

        const movingNode = nodes[id];
        if (!movingNode) return nodes;

        // retirer le node de la source
        let remainingSourceNodes = Object.values(nodes).filter((n) => n.id !== id);
        // trier les nodes de la zone source et reindexer les ordres
        remainingSourceNodes = remainingSourceNodes
            .filter((n) => n.parent?.id === source?.id && n.parent?.zone === source?.zone)
            .sort((a, b) => a.parent?.order - b.parent?.order)
            .map((node, index) => ({...node, parent: { ...node.parent, order: index }}));

        const sourceUpdate = remainingSourceNodes.reduce<NodesType>((acc, node) => {
            acc[node.id] = node;
            return acc;
        }, {});

        const _nodes = nodeHelper.updateNodes(nodes, sourceUpdate);

        // trier les nodes de la zone target et reindexer les ordres
        let remainingTargetNodes = Object.values(nodes).filter((n) => n.id !== id);
        remainingTargetNodes = remainingTargetNodes
            .filter((n) => n.parent?.id === target?.id && n.parent?.zone === target?.zone)
            .sort((a, b) => a.parent?.order - b.parent?.order)
            .map((node, index) => ({...node, parent: { ...node.parent, order: index }}));
        
        // insert the node in the target zone
        remainingTargetNodes.splice(target.order, 0, {
            ...movingNode,
            parent: { id: target.id, zone: target.zone, order: target.order },
        });
        remainingTargetNodes = remainingTargetNodes.map((node, index) => ({...node, parent: { ...node.parent, order: index }}));

        const targetUpdate = remainingTargetNodes.reduce<NodesType>((acc, node) => {
            acc[node.id] = node;
            return acc;
        }, {});

        return nodeHelper.updateNodes(_nodes, targetUpdate);
    },
    updateNode: (nodes: NodesType, updatedNode: NodeType): NodesType => {
        return {...nodes, [updatedNode.id]: updatedNode};
    },
    countDescendants: (nodes: NodesType, nodeId: NodeID): number => {
        return Object.values(nodes)
            .filter((n) => n.parent?.id === nodeId)
            .reduce(
                (count, child) => count + 1 + nodeHelper.countDescendants(nodes, child.id),
                0
            );
    },
    removeNode: (nodes: NodesType, node: NodeType) => {
        const _nodes = cloneNodes(nodes);

        deleteNodeRecursively(_nodes, node.id);
        reindexSiblingOrders(_nodes, node.parent?.id ?? null, node.parent?.zone ?? "main");

        return _nodes;
    },
    sanitizeNodes: (nodes: NodesType): NodesType => {
        const _nodes = cloneNodes(nodes);
        let changed = true;

        while (changed) {
            changed = false;
            const toRemove = Object.values(_nodes).filter((node) => isInvalidNode(_nodes, node));

            if (toRemove.length === 0) {
                break;
            }

            changed = true;
            const affectedGroups: Array<{ parentId: NodeID | null; zone: string }> = [];

            for (const node of toRemove) {
                affectedGroups.push({
                    parentId: node.parent?.id ?? null,
                    zone: node.parent?.zone ?? "main",
                });
                deleteNodeRecursively(_nodes, node.id);
            }

            const seenGroups = new Set<string>();
            for (const { parentId, zone } of affectedGroups) {
                const key = `${parentId ?? "null"}\0${zone}`;
                if (seenGroups.has(key)) {
                    continue;
                }
                seenGroups.add(key);
                reindexSiblingOrders(_nodes, parentId, zone);
            }

            console.warn(
                `[nodeHelper] sanitizeNodes: removed ${toRemove.length} invalid node(s)`
            );
        }

        for (const node of Object.values(_nodes)) {
            if (node.type !== NODE_SLIDESHOW_TYPE || !node.content) {
                continue;
            }
            node.content = normalizeSlideshowContent(
                node.content as Record<string, unknown>
            );
        }

        return _nodes;
    },
    updateNodes: (nodes: NodesType,  updatedNodes: NodesType): NodesType => {
        const map = { ...nodes };
        Object.values(updatedNodes).map(n => {
            map[n.id] = n;
        });
        return map;
    },
    getChildren: (nodes: NodesType, parentId: NodeID | null, zone = "main"): NodesType => {
        return Object.values(nodes)
            .filter(n => n.parent?.id === parentId && n.parent.zone === zone)
            .sort((a, b) => a.parent.order - b.parent.order)
            .reduce<Record<string, NodeType>>((acc, node) => {
                acc[node.id] = node;
                return acc;
            }, {});
    },
    duplicateNode: (node: NodeType): NodeType => {
        // Générer un nouvel ID unique
        const newId = generateNodeId();
        
        // Créer une copie profonde du nœud avec toutes ses propriétés
        // Utiliser JSON.parse/stringify pour un clonage profond des objets imbriqués (content, attributes, etc.)
        const clonedNode = JSON.parse(JSON.stringify(node));
        
        // Créer le nœud dupliqué avec le nouvel ID et le nouvel order
        const duplicatedNode: NodeType = {
            ...clonedNode,
            id: newId,
            parent: {
                ...clonedNode.parent,
                order: clonedNode.parent.order + 1
            }
        };
        
        return duplicatedNode;
    }

}

export default nodeHelper;