import { type NodeType } from "../../types/NodeType";
import View from "./View";
import Edit from "./Edit";
import Settings from "./Settings";
import { defaultNodeConfiguration, type NodeConfigurationType } from "../NodeConfigurationType";
import { IoEllipseOutline } from "react-icons/io5";

export const NODE_BUTTON_TYPE = "node-button" as const;

export type NodeButtonButtonType = "button" | "submit" | "link";

export interface NodeButtonType extends NodeType {
  type: "node-button";
  content: {
    buttonType: NodeButtonButtonType;
    label: string;
    href?: string;
    target?: string;
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
    order: 2,
  },
  default: {
    ...defaultNodeConfiguration.default,
    content: {
      buttonType: "button" as NodeButtonButtonType,
      label: "Bouton",
      href: "",
      target: "_self",
    },
  },
};

export default NodeButton;
