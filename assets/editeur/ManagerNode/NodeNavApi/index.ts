import { type NodeType } from "../../types/NodeType";
import type { CSSProperties } from "react";
import { defaultNodeConfiguration, type NodeConfigurationType } from "../NodeConfigurationType";
import View from "./View";
import Settings from "./Settings";
import { IoMenuOutline } from "react-icons/io5";
import type { NodeNavDirection, NodeNavVariant } from "../NodeNav";

export const NODE_NAV_API_TYPE = "node-nav-api" as const;

export type { NodeNavDirection, NodeNavVariant };

export type NodeNavApiTarget = "_self" | "_blank";

export interface NodeNavApiOptions {
  direction?: NodeNavDirection;
  variant?: NodeNavVariant;
  showBurger?: boolean;
  /** Défilement du menu sans barre visible (souris molette / touch). */
  scrollWithoutScrollbar?: boolean;
  target?: NodeNavApiTarget;
  justify?: "flex-start" | "center" | "flex-end" | "space-between" | "space-around" | "space-evenly";
  gap?: number;
}

export interface NavApiLinkItem {
  id: string;
  title: string;
  link: string;
}

export interface NodeNavApiType extends NodeType {
  type: "node-nav-api";
  content?: {
    apiId?: string;
    options: NodeNavApiOptions;
    nav: {
      id?: string;
      className?: string;
      style?: CSSProperties;
    };
    burger: {
      style?: CSSProperties;
    };
    burgerItem: {
      style?: CSSProperties;
    };
  };
}

export const NodeNavApi: NodeConfigurationType = {
  ...defaultNodeConfiguration,
  view: View,
  edit: View,
  settings: Settings,
  type: NODE_NAV_API_TYPE,
  button: {
    ...defaultNodeConfiguration.button,
    label: "Menu Nav API",
    icon: IoMenuOutline,
    category: "nav",
    order: 2,
  },
  default: {
    ...defaultNodeConfiguration.default,
    content: {
      apiId: "",
      options: {
        direction: "horizontal",
        variant: "navbar",
        showBurger: false,
        scrollWithoutScrollbar: false,
        target: "_self",
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
    },
  },
};

export default NodeNavApi;
