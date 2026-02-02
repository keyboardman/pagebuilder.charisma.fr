import { type NodeType } from "../../types/NodeType";
import View from "./View";
import Edit from "./Edit";
import Settings from "./Settings";
import { defaultNodeConfiguration, type NodeConfigurationType } from "../NodeConfigurationType";
import { IoTextOutline } from "react-icons/io5";

export const NODE_HEADER_TYPE = "node-header" as const;

export interface NodeHeaderType extends NodeType {
  type: "node-header";
  content: {
    html: string;
    tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  };
};

export const NodeHeader: NodeConfigurationType = {
    ...defaultNodeConfiguration,
    view: View,
    edit: Edit,
    settings: Settings,
    type: NODE_HEADER_TYPE,
    button: {
      ...defaultNodeConfiguration.button,
      label: "Header",
      icon: IoTextOutline,
      category: 'content',
      order: 2
    },
    default: {
      ...defaultNodeConfiguration.default,
      content: { 
        html: "Titre",
        tag: "h1"
      }
    }
};

export default NodeHeader;

