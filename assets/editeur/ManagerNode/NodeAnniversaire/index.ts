import { type NodeType } from "../../types/NodeType";
import View from "./View";
import Settings from "./Settings";
import { defaultNodeConfiguration, type NodeConfigurationType } from "../NodeConfigurationType";
import { IoGiftOutline } from "react-icons/io5";
import type React from "react";

export const NODE_ANNIVERSAIRE_TYPE = "node-anniversaire" as const;

export interface NodeAnniversaireType extends NodeType {
  type: "node-anniversaire";
  content: {
    endpoint: string;
    container: {
      style?: React.CSSProperties;
    };
    title: {
      text: string;
      style?: React.CSSProperties;
    };
    day: {
      style?: React.CSSProperties;
    };
    anniversaires: {
      style?: React.CSSProperties;
    };
  };
}

export const NodeAnniversaire: NodeConfigurationType = {
  ...defaultNodeConfiguration,
  view: View,
  settings: Settings,
  type: NODE_ANNIVERSAIRE_TYPE,
  button: {
    ...defaultNodeConfiguration.button,
    label: "Anniv.",
    icon: IoGiftOutline,
    category: "custom",
    order: 1,
  },
  default: {
    ...defaultNodeConfiguration.default,
    content: {
      endpoint: "https://api.charisma.fr/charisma/anniversaire/mariage",
      container: {
        style: {},
      },
      title: {
        text: "Anniversaires de mariage",
        style: {},
      },
      day: {
        style: {},
      },
      anniversaires: {
        style: {},
      },
    },
  },
};

export default NodeAnniversaire;
