import { type NodeType } from "../../types/NodeType";
import View from "./View";
import Edit from "./Edit";
import Settings from "./Settings";
import { defaultNodeConfiguration, type NodeConfigurationType } from "../NodeConfigurationType";
import { IoText } from "react-icons/io5";

export const NODE_TEXT_TYPE = "node-text" as const;

export interface NodeTextType extends NodeType {
  type: "node-text";
  content: {
    html: string;
    tag?: "div" | "p";
  };
};

export const NodeText: NodeConfigurationType = {
    ...defaultNodeConfiguration,
    view: View,
    edit: Edit,
    settings: Settings,
    type: NODE_TEXT_TYPE,
    button: {
      ...defaultNodeConfiguration.button,
      label: "Text",
      icon: IoText,
      category: 'content',
      order: 1
    },
    default: {
      ...defaultNodeConfiguration.default,
      content: { 
        html: "...",
        tag: "div"
      }
    }
};

export default NodeText;