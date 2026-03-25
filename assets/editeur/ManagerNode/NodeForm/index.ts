import { type NodeType } from "../../types/NodeType";
import { defaultNodeConfiguration, type NodeConfigurationType } from "../NodeConfigurationType";
import View from "./View";
import Settings from "./Settings";
import { IoReceiptOutline } from "react-icons/io5";

export const NODE_FORM_TYPE = "node-form" as const;

export type NodeFormMethod = "GET" | "POST";

export interface NodeFormType extends NodeType {
  type: "node-form";
  content?: {
    method: NodeFormMethod;
    action: string;
  };
  isDroppable: true;
}

export const NodeForm: NodeConfigurationType = {
  ...defaultNodeConfiguration,
  view: View,
  edit: View,
  settings: Settings,
  type: NODE_FORM_TYPE,
  button: {
    ...defaultNodeConfiguration.button,
    label: "Form",
    icon: IoReceiptOutline,
    category: "form",
    order: 0,
  },
  default: {
    ...defaultNodeConfiguration.default,
    content: {
      method: "POST",
      action: "",
    },
  },
};

export default NodeForm;
