import { type NodeType } from "../../types/NodeType";
import { defaultNodeConfiguration, type NodeConfigurationType } from "../NodeConfigurationType";
import View from "./View";
import Settings from "./Settings";
import { IoListOutline } from "react-icons/io5";
import type React from "react";

export const NODE_LIST_API_TYPE = "node-list-api" as const;

export const LIST_API_ELIGIBLE_TYPE = "list" as const;

export interface NodeListApiShow {
  title?: boolean;
  description?: boolean;
  counter?: boolean;
  like?: boolean;
}

export interface NodeListApiStyledPart {
  className?: string;
  style?: React.CSSProperties;
}

export interface NodeListApiType extends NodeType {
  type: "node-list-api";
  content: {
    apiId?: string;
    show: NodeListApiShow;
    list: NodeListApiStyledPart;
    item: NodeListApiStyledPart;
    title: NodeListApiStyledPart;
    description: NodeListApiStyledPart;
    counter: NodeListApiStyledPart;
    like: NodeListApiStyledPart;
  };
}

export const NodeListApi: NodeConfigurationType = {
  ...defaultNodeConfiguration,
  view: View,
  settings: Settings,
  type: NODE_LIST_API_TYPE,
  button: {
    ...defaultNodeConfiguration.button,
    label: "Liste API",
    icon: IoListOutline,
    category: "api",
    order: 4,
  },
  default: {
    ...defaultNodeConfiguration.default,
    content: {
      apiId: "",
      show: {
        title: true,
        description: true,
        counter: true,
        like: true,
      },
      list: {
        className: "",
        style: {},
      },
      item: {
        className: "",
        style: {},
      },
      title: {
        className: "",
        style: {},
      },
      description: {
        className: "",
        style: {},
      },
      counter: {
        className: "",
        style: {},
      },
      like: {
        className: "",
        style: {},
      },
    },
  },
};

export default NodeListApi;
