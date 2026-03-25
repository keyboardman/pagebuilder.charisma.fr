import { type NodeType } from "../../types/NodeType";
import { defaultNodeConfiguration, type NodeConfigurationType } from "../NodeConfigurationType";
import View from "./View";
import Settings from "./Settings";
import { nodeFormSelectDefaultContent } from "./defaults";
import { IoChevronDownCircleOutline } from "react-icons/io5";
import type { CSSProperties } from "react";

export const NODE_FORM_SELECT_TYPE = "node-form-select" as const;

export type NodeFormOption = { value: string; label: string };

export interface NodeFormSelectType extends NodeType {
  type: "node-form-select";
  content?: {
    container: {
      style: CSSProperties;
    };
    label: {
      text: string;
      style: CSSProperties;
    };
    select: {
      style: CSSProperties;
      name: string;
      placeholder: string;
      required: boolean;
      // Valeur de sélection initiale (si placeholder existe, c'est aussi la valeur de l'option vide)
      defaultValue: string;
      options: NodeFormOption[];
    };
  };
}

export const NodeFormSelect: NodeConfigurationType = {
  ...defaultNodeConfiguration,
  view: View,
  edit: View,
  settings: Settings,
  type: NODE_FORM_SELECT_TYPE,
  button: {
    ...defaultNodeConfiguration.button,
    label: "Select",
    icon: IoChevronDownCircleOutline,
    category: "form",
    order: 2,
  },
  default: {
    ...defaultNodeConfiguration.default,
    content: {
      ...nodeFormSelectDefaultContent,
    },
  },
};

export default NodeFormSelect;
