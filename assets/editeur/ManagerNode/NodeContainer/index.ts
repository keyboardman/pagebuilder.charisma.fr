import { type NodeType } from "../../types/NodeType";
import { defaultNodeConfiguration, type NodeConfigurationType } from "../NodeConfigurationType";
import View from "./View";
import Settings from "./Settings";
import { IoSquareOutline } from "react-icons/io5";

export const NODE_CONTAINER_TYPE = "node-container" as const

export interface NodeContainerType extends NodeType {
    type: "node-container";
    content?: undefined;
    isDroppable: true;
}

export const NodeContainer: NodeConfigurationType = {
    ...defaultNodeConfiguration,
    view: View,
    edit: View,
    settings: Settings,
    type: NODE_CONTAINER_TYPE,
    button: {
        ...defaultNodeConfiguration.button,
        label: "Container",
        icon: IoSquareOutline,
        category: 'container',
        order: 1
    },
    default: {
        ...defaultNodeConfiguration.default,
        attributes: {options: {fluid: false}}
    }
} 

export default NodeContainer;