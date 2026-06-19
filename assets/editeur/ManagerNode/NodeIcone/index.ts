import type React from "react";
import { type NodeType } from "../../types/NodeType";
import View from "./View";
import Settings from "./Settings";
import { defaultNodeConfiguration, type NodeConfigurationType } from "../NodeConfigurationType";
import { IoStarOutline } from "react-icons/io5";
import type {
  NodeTextIconHorizontalAlign,
  NodeTextIconName,
  NodeTextIconSizeVariant,
  NodeTextIconSource,
  NodeTextIconVerticalAlign,
} from "../NodeTextIcon";

export const NODE_ICONE_TYPE = "node-icone" as const;

export type NodeIconeName = NodeTextIconName;
export type NodeIconeSizeVariant = NodeTextIconSizeVariant;
export type NodeIconeSource = NodeTextIconSource;
export type NodeIconeHorizontalAlign = NodeTextIconHorizontalAlign;
export type NodeIconeVerticalAlign = NodeTextIconVerticalAlign;
export type NodeIconeSizeMode = "preset" | "custom";

export interface NodeIconeType extends NodeType {
  type: "node-icone";
  content: {
    icon?: NodeIconeName;
    iconSource?: NodeIconeSource;
    themeIconId?: string;
    themeIconClass?: string;
    themeIconUrl?: string;
    iconImageUrl?: string;
    iconSizeMode?: NodeIconeSizeMode;
    iconSizeVariant?: NodeIconeSizeVariant;
    /** Largeur en px lorsque `iconSizeMode` vaut `custom` (hauteur = largeur). */
    iconWidth?: number;
    linkUrl?: string;
    horizontalAlign?: NodeIconeHorizontalAlign;
    verticalAlign?: NodeIconeVerticalAlign;
    container?: {
      style?: React.CSSProperties;
    };
    iconMedia?: {
      style?: React.CSSProperties;
    };
  };
}

export const NodeIcone: NodeConfigurationType = {
  ...defaultNodeConfiguration,
  view: View,
  settings: Settings,
  type: NODE_ICONE_TYPE,
  button: {
    ...defaultNodeConfiguration.button!,
    label: "Icone",
    icon: IoStarOutline,
    category: "content",
    order: 5,
  },
  default: {
    ...defaultNodeConfiguration.default,
    content: {
      icon: "star" as NodeIconeName,
      iconSource: "preset" as NodeIconeSource,
      themeIconId: "",
      themeIconClass: "",
      themeIconUrl: "",
      iconImageUrl: "",
      iconSizeMode: "preset" as NodeIconeSizeMode,
      iconSizeVariant: "default" as NodeIconeSizeVariant,
      iconWidth: 24,
      linkUrl: "",
      horizontalAlign: "left" as NodeIconeHorizontalAlign,
      verticalAlign: "middle" as NodeIconeVerticalAlign,
      container: { style: {} },
      iconMedia: { style: {} },
    },
  },
};

export default NodeIcone;
