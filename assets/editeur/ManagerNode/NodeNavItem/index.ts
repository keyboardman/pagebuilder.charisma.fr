import { type NodeType } from "../../types/NodeType";
import { defaultNodeConfiguration, type NodeConfigurationType } from "../NodeConfigurationType";
import View from "./View";
import Settings from "./Settings";
import { IoEllipseOutline } from "react-icons/io5";

export const NODE_NAV_ITEM_TYPE = "node-nav-item" as const;

export type NodeNavItemKind = "link" ;

export interface NodeNavItemContent {
  /** link */
  label?: string;
  href?: string;
  target?: string;
}

export interface NodeNavItemType extends NodeType {
  type: "node-nav-item";
  content: NodeNavItemContent;
}

export const NodeNavItem: NodeConfigurationType = {
  ...defaultNodeConfiguration,
  view: View,
  settings: Settings,
  type: NODE_NAV_ITEM_TYPE,
  button: {
    ...defaultNodeConfiguration.button,
    label: "Item menu",
    icon: IoEllipseOutline,
    category: "nav",
    order: 1,
  },
  default: {
    ...defaultNodeConfiguration.default,
    content: {
      label: "Lien",
      href: "",
      target: "_self",
    },
  },
};

export default NodeNavItem;
