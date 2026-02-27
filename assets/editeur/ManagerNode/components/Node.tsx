import type { NodeType } from "../../types/NodeType";
import NodeComponent from "./NodeComponent";
import NodeProvider from "../../services/providers/NodeProvider";
import NodeBuilderProvider from "../../services/providers/NodeBuilderProvider";
import { APP_MODE, useAppContext } from "../../services/providers/AppContext";

export default function Node({  node, index }: {  node: NodeType, index: number }) {
    const { mode } = useAppContext();
    return mode === APP_MODE.VIEW ? <NodeProvider node={node} index={index}><NodeComponent /></NodeProvider> : <NodeProvider node={node} index={index}><NodeBuilderProvider><NodeComponent /></NodeBuilderProvider></NodeProvider>;
}