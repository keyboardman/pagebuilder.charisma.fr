import { APP_MODE, useAppContext } from "./AppContext";
import { NodeContext, type NodeContextProps } from "./NodeContext";
import { type FC } from "react";
import NodeBuilderProvider from "./NodeBuilderProvider";
import { type NodesType } from "../../types/NodeType";

export const NodeProvider: FC<NodeContextProps> = ({ node, index, children }: NodeContextProps) => {
    const { mode, getChildren } = useAppContext();

    const getNodeChildren = (area: string): NodesType => {
        return getChildren(node.id, area);
    }

    return (
        <NodeContext.Provider value={{ node, getChildren: getNodeChildren, index }}>
            {mode === APP_MODE.EDIT ? <NodeBuilderProvider>{children}</NodeBuilderProvider> : children}
        </NodeContext.Provider>
    );
};

export default NodeProvider;
