import { type NodeType } from "../../types/NodeType";
import View from "./View";
import Settings from "./Settings";
import { defaultNodeConfiguration, type NodeConfigurationType } from "../NodeConfigurationType";
import { IoText } from "react-icons/io5";

export const NODE_HTML_TYPE = "node-html" as const;

export interface NodeHtmlType extends NodeType {
  type: "node-html";
  content: {
    html: string;
  };
}

export const NodeHtml: NodeConfigurationType = {
  ...defaultNodeConfiguration,
  view: View,
  settings: Settings,
  type: NODE_HTML_TYPE,
  button: {
    ...defaultNodeConfiguration.button,
    label: "HTML",
    icon: IoText,
    category: "content",
    order: 9,
  },
  default: {
    ...defaultNodeConfiguration.default,
    content: {
      html: "<div>HTML personnalisé</div>",
    },
  },
};

export default NodeHtml;

