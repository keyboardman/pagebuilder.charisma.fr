import { type NodeType } from "../../types/NodeType";
import View from "./View";
import Edit from "./Edit";
import Settings from "./Settings";
import { defaultNodeConfiguration, type NodeConfigurationType } from "../NodeConfigurationType";
import { IoArrowUpOutline } from "react-icons/io5";

export const NODE_TOP_BUTTON_TYPE = "node-top-button" as const;

export interface NodeTopButtonType extends NodeType {
  type: "node-top-button";
  content: {
    iconColor: string;
    ariaLabel?: string;
    horizontalAlign?: "left" | "right";
    offsetBottom?: number;
    offsetSide?: number;
  };
}

export const NodeTopButton: NodeConfigurationType = {
  ...defaultNodeConfiguration,
  view: View,
  edit: Edit,
  settings: Settings,
  type: NODE_TOP_BUTTON_TYPE,
  button: {
    ...defaultNodeConfiguration.button!,
    label: "Top page",
    icon: IoArrowUpOutline,
    category: "content",
    order: 12,
  },
  default: {
    ...defaultNodeConfiguration.default,
    content: {
      iconColor: "#ffffff",
      ariaLabel: "Retour en haut",
      horizontalAlign: "right",
      offsetBottom: 24,
      offsetSide: 24,
    },
    attributes: {
      style: {
        backgroundColor: "#111827",
        border: "1px solid #111827",
        borderRadius: "9999px",
        width: "44px",
        height: "44px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      },
    },
  },
};

export default NodeTopButton;
