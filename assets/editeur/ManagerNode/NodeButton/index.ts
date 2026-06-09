import { type NodeType } from "../../types/NodeType";
import View from "./View";
import Edit from "./Edit";
import Settings from "./Settings";
import { defaultNodeConfiguration, type NodeConfigurationType } from "../NodeConfigurationType";
import { IoEllipseOutline } from "react-icons/io5";

export type NodeButtonButtonType = "button" | "submit" | "link";
export type NodeButtonSizeType = "small" | "medium" | "large";
export type NodeButtonVariantType = "default" | "primary" | "secondary";

export const NODE_BUTTON_TYPE = "node-button" as const;

export const NODE_BUTTON_SIZE_OPTIONS: { value: NodeButtonSizeType; label: string }[] = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
];

export const NODE_BUTTON_VARIANT_OPTIONS: { value: NodeButtonVariantType; label: string }[] = [ 
  { value: "default", label: "Default" },
  { value: "primary", label: "Primary" },
  { value: "secondary", label: "Secondary" },
];


export interface NodeButtonType extends NodeType {
  type: "node-button";
  content: {
    buttonType: NodeButtonButtonType;
    /** Texte brut ou HTML inline limité (`<strong>`, `<b>`) pour le gras partiel. */
    label: string;
    href?: string;
    target?: string;
    variant?: NodeButtonVariantType;
    size?: NodeButtonSizeType;
  };
}

export const NodeButton: NodeConfigurationType = {
  ...defaultNodeConfiguration,
  view: View,
  edit: Edit,
  settings: Settings,
  type: NODE_BUTTON_TYPE,
  button: {
    ...defaultNodeConfiguration.button!,
    label: "Bouton",
    icon: IoEllipseOutline,
    category: "content",
    order: 12,
  },
  default: {
    ...defaultNodeConfiguration.default,
    content: {
      buttonType: "button" as NodeButtonButtonType,
      label: "Bouton",
      href: "",
      target: "_self",
      variant: "default" as NodeButtonVariantType,
      size: "medium" as NodeButtonSizeType,
    },
  },
};

export default NodeButton;
