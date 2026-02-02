import type { NodeType } from "../../types/NodeType";
import NodeProvider from "../../services/providers/NodeProvider";
import NodeBuilderProvider from "../../services/providers/NodeBuilderProvider";
import { APP_MODE, useAppContext } from "../../services/providers/AppContext";
import { useNodeContext } from "../../services/providers/NodeContext";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { type ReactNode } from "react";
import DropZone from "./DropZone";
import NodeRegistry, { isKnownNode } from "./NodeRegistry";

// Composant qui rend un node sans menu mais avec les fonctionnalités d'édition
function NodeChildBuilder({ children }: { children: ReactNode }) {
    const { node, index } = useNodeContext();
    const { drag } = useNodeBuilderContext();

    return (
        <>
            <DropZone parent={{ ...node.parent, order: index }} />
            <div
                ref={drag.ref}
                className="relative"
            >
                {/* Pas de NodeMenu ici - les enfants n'ont pas de menu */}
                {children}
            </div>
        </>
    );
}

function NodeChildComponent() {
    const { mode } = useAppContext();
    const { node } = useNodeContext();
    
    if (!node || !isKnownNode(node)) {
        return null;
    }

    const Component = mode === APP_MODE.EDIT ? NodeRegistry[node.type]['edit'] : NodeRegistry[node.type]['view'];

    return mode === APP_MODE.EDIT ? (<NodeChildBuilder><Component /></NodeChildBuilder>) : <Component />;
}

// Composant principal qui rend un node enfant sans menu
export default function NodeChild({ node, index }: { node: NodeType, index: number }) {
    const { mode } = useAppContext();
    return (
        <NodeProvider node={node} index={index}>
            {mode === APP_MODE.EDIT ? (
                <NodeBuilderProvider>
                    <NodeChildComponent />
                </NodeBuilderProvider>
            ) : (
                <NodeChildComponent />
            )}
        </NodeProvider>
    );
}

