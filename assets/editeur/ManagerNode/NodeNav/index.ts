import { type NodeType } from "../../types/NodeType";
import type { CSSProperties } from "react";
import { defaultNodeConfiguration, type NodeConfigurationType } from "../NodeConfigurationType";
import View from "./View";
import Settings from "./Settings";
import { IoMenuOutline } from "react-icons/io5";

export const NODE_NAV_TYPE = "node-nav" as const;

export type NodeNavDirection = "horizontal" | "vertical";

export type NodeNavVariant = "navbar" | "liste";

export interface NodeNavOptions {
  direction?: NodeNavDirection;
  variant?: NodeNavVariant;
  showBurger?: boolean;
  burgerStyle?: CSSProperties;
  justify?: "flex-start" | "center" | "flex-end" | "space-between" | "space-around" | "space-evenly";
  gap?: number;
}

export interface NodeNavType extends NodeType {
  type: "node-nav";
  content?: {
    options: NodeNavOptions,
    nav: {
      id?: string;
      className?: string;
      style?: CSSProperties;
    },
    burger: {
      style?: CSSProperties;
    },
    burgerItem: {
      style?: CSSProperties;
    },
  };
  isDroppable: true;
}

export const NodeNav: NodeConfigurationType = {
  ...defaultNodeConfiguration,
  view: View,
  edit: View,
  settings: Settings,
  type: NODE_NAV_TYPE,
  button: {
    ...defaultNodeConfiguration.button,
    label: "Menu Nav",
    icon: IoMenuOutline,
    category: "nav",
    order: 0,
  },
  default: {
    ...defaultNodeConfiguration.default,
    content: {
      options: {
        direction: "horizontal",
        variant: "navbar",
        showBurger: false,
        justify: "flex-start",
        gap: 0,
      },
      nav: {
        className: "",
        style: {},
      },
      burger: {
        style: {},
      },
      burgerItem: {
        style: {},
      },
    }
  },
};

export default NodeNav;
