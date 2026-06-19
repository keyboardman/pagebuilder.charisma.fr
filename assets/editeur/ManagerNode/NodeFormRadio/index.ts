import { type NodeType } from "../../types/NodeType";
import { defaultNodeConfiguration, type NodeConfigurationType } from "../NodeConfigurationType";
import View from "./View";
import Settings from "./Settings";
import { nodeFormRadioDefaultContent } from "./defaults";
import { IoRadioButtonOnOutline } from "react-icons/io5";
import type { CSSProperties } from "react";

export const NODE_FORM_RADIO_TYPE = "node-form-radio" as const;

export type NodeFormRadioOrientation = "vertical" | "horizontal";

export type NodeFormRadioOption = { value: string; label: string };

export interface NodeFormRadioType extends NodeType {
  type: "node-form-radio";
  content?: {
    container: {
      style: CSSProperties;
    };
    label: {
      text: string;
      style: CSSProperties;
    };
    radio: {
      style: CSSProperties;
      name: string;
      required: boolean;
      orientation: NodeFormRadioOrientation;
      options: NodeFormRadioOption[];
    };
  };
}

export const NodeFormRadio: NodeConfigurationType = {
  ...defaultNodeConfiguration,
  view: View,
  settings: Settings,
  type: NODE_FORM_RADIO_TYPE,
  button: {
    ...defaultNodeConfiguration.button,
    label: "Radio",
    icon: IoRadioButtonOnOutline,
    category: "form",
    order: 3,
  },
  default: {
    ...defaultNodeConfiguration.default,
    content: {
      ...nodeFormRadioDefaultContent,
    },
  },
};

export default NodeFormRadio;
