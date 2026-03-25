import { type NodeType } from "../../types/NodeType";
import { defaultNodeConfiguration, type NodeConfigurationType } from "../NodeConfigurationType";
import View from "./View";
import Settings from "./Settings";
import { nodeFormInputDefaultContent } from "./defaults";
import { IoTextOutline } from "react-icons/io5";
import type { CSSProperties } from "react";

export const NODE_FORM_INPUT_TYPE = "node-form-input" as const;

export type NodeFormInputHtmlType =
  | "text"
  | "email"
  | "number"
  | "tel";

export interface NodeFormInputType extends NodeType {
  type: "node-form-input";
  content?: {
    container: {
      style: CSSProperties;
    };
    label: {
      text: string;
      style: CSSProperties;
    };
    input: {
      style: CSSProperties;
      type: NodeFormInputHtmlType;
      name: string;
      placeholder: string;
      required: boolean;
      defaultValue: string;
    };
  };
}

export const NodeFormInput: NodeConfigurationType = {
  ...defaultNodeConfiguration,
  view: View,
  edit: View,
  settings: Settings,
  type: NODE_FORM_INPUT_TYPE,
  button: {
    ...defaultNodeConfiguration.button,
    label: "Input",
    icon: IoTextOutline,
    category: "form",
    order: 1,
  },
  default: {
    ...defaultNodeConfiguration.default,
    content: { ...nodeFormInputDefaultContent },
  },
};

export default NodeFormInput;
