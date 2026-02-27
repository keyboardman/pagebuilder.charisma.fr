import { type NodeType } from "../../types/NodeType";
import { defaultNodeConfiguration, type NodeConfigurationType } from "../NodeConfigurationType";
import View from "./View";
import Settings from "./Settings";
import { IoExpandOutline } from "react-icons/io5";

export const NODE_FLEX_TYPE = "node-flex" as const;

export type FlexDirection = "row" | "row-reverse" | "column" | "column-reverse";
export type FlexJustify = "flex-start" | "center" | "flex-end" | "space-between" | "space-around" | "space-evenly";
export type FlexAlign = "flex-start" | "center" | "flex-end" | "stretch" | "baseline";
export type FlexWrap = "nowrap" | "wrap" | "wrap-reverse";

export interface NodeFlexOptions {
  direction?: FlexDirection;
  justify?: FlexJustify;
  align?: FlexAlign;
  gap?: number;
  wrap?: FlexWrap;
}

export interface NodeFlexType extends NodeType {
  type: "node-flex";
  content?: undefined;
  isDroppable: true;
  attributes?: NodeType["attributes"] & {
    options?: NodeFlexOptions;
  };
}

export const NodeFlex: NodeConfigurationType = {
  ...defaultNodeConfiguration,
  view: View,
  edit: View,
  settings: Settings,
  type: NODE_FLEX_TYPE,
  button: {
    ...defaultNodeConfiguration.button,
    label: "Flex",
    icon: IoExpandOutline,
    category: "container",
    order: 3,
  },
  default: {
    ...defaultNodeConfiguration.default,
    attributes: {
      options: {
        direction: "row",
        justify: "flex-start",
        align: "stretch",
        gap: 4,
        wrap: "nowrap",
      },
    },
  },
};

export default NodeFlex;
