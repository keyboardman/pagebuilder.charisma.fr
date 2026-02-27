import NodeRegistry from "../ManagerNode/components/NodeRegistry";
import type { NodeID, NodesType, NodeType, ParentProps } from "../types/NodeType";
import { generateNodeId, makeParentProps } from "./helpers";

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
    removeNode: (nodes: NodesType, node: NodeType) => { 
        // Clonage profond des nodes
        const _nodes: NodesType = JSON.parse(JSON.stringify(nodes));

        // Fonction récursive interne
        const deleteRecursively = (id: string) => {
            const current = _nodes[id];
            if (!current) return;

            // Supprimer récursivement les enfants
            Object.values(_nodes)
                .filter(n => n.parent && n.parent.id === current.id)
                .forEach(child => {
                    deleteRecursively(child.id)
                });
            // Supprimer le nœud lui-même
            delete _nodes[id];
        };

        // Supprimer le nœud et tous ses descendants
        deleteRecursively(node.id);

        // Récupérer les frères restants dans la même zone
        const siblings = Object.values(_nodes)
            .filter(n => n.parent && n.parent.id === node.parent.id && n.parent.zone === node.parent.zone)
            .sort((a, b) => a.parent.order - b.parent.order);

        // Réassigner des ordres séquentiels
        siblings.forEach((sibling, index) => {
            sibling.parent.order = index;
        });

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