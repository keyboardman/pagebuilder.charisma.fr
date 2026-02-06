import { useNodeContext } from "../../services/providers/NodeContext";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import NodeRegistry, {isKnownNode} from "./NodeRegistry";
import { APP_MODE } from "../../services/providers/AppContext";
import { NODE_ROOT_TYPE } from "../NodeRoot";
import { useAppContext } from "../../services/providers/AppContext";
import DropZone from "./DropZone";
import {type ReactNode } from "react";
import NodeMenu from "./NodeMenu";

function EmptySettings() {
    return false;
}

function NodeBuilderComponent({ children }: { children: ReactNode }) {

    const { node, index } = useNodeContext();
    const { drag} = useNodeBuilderContext();
    

    const isRootNode = node.type === NODE_ROOT_TYPE;

    return (
        <>
            {!isRootNode && <DropZone parent={{ ...node.parent, order: index }} />}
            <div
                ref={drag.ref}
                className="m-1 p-1 border border-border/50 rounded-b-sm"
            >
                <NodeMenu />
                <div>
                    {children}
                </div>
            </div>
            
        </>
    )
}

function NodeComponent() {
    const { mode } = useAppContext();
    const { node } = useNodeContext();

    if (!node) return <EmptySettings />;

    if (!isKnownNode(node)) {
        return <EmptySettings />;
    }

    const Component = (mode === APP_MODE.VIEW || mode === APP_MODE.PREVIEW)
        ? NodeRegistry[node.type].view
        : NodeRegistry[node.type].edit;

    return (mode === APP_MODE.VIEW || mode === APP_MODE.PREVIEW) ? (
        <Component />
    ) : (
        <NodeBuilderComponent><Component /></NodeBuilderComponent>
    );
}

export default NodeComponent;
