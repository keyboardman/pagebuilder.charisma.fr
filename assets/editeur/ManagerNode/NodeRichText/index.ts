import { type NodeType } from "../../types/NodeType";
import View from "./View";
import Edit from "./Edit";
import Settings from "./Settings";
import { defaultNodeConfiguration, type NodeConfigurationType } from "../NodeConfigurationType";
import { IoText } from "react-icons/io5";

export const NODE_RICH_TEXT_TYPE = "node-rich-text" as const;

export interface NodeRichTextType extends NodeType {
  type: "node-rich-text";
  content: {
    raw?: string;
    html?: string;
  };
}

export const NodeRichText: NodeConfigurationType = {
  ...defaultNodeConfiguration,
  view: View,
  edit: Edit,
  settings: Settings,
  type: NODE_RICH_TEXT_TYPE,
  button: {
    ...defaultNodeConfiguration.button,
    label: "Texte riche",
    icon: IoText,
    category: "content",
    order: 3,
  },
  default: {
    ...defaultNodeConfiguration.default,
    content: {
      html: "<p>Texte riche...</p>",
    },
  },
};

export default NodeRichText;
