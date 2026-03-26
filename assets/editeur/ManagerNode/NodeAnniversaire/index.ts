import { type NodeType } from "../../types/NodeType";
import View from "./View";
import Edit from "./Edit";
import Settings from "./Settings";
import { defaultNodeConfiguration, type NodeConfigurationType } from "../NodeConfigurationType";
import { IoGiftOutline } from "react-icons/io5";

export const NODE_ANNIVERSAIRE_TYPE = "node-anniversaire" as const;

export interface NodeAnniversaireType extends NodeType {
  type: "node-anniversaire";
  content: {
    endpoint: string;
  };
}

export const NodeAnniversaire: NodeConfigurationType = {
  ...defaultNodeConfiguration,
  view: View,
  edit: Edit,
  settings: Settings,
  type: NODE_ANNIVERSAIRE_TYPE,
  button: {
    ...defaultNodeConfiguration.button,
    label: "Anniversaire",
    icon: IoGiftOutline,
    category: "custom",
    order: 1,
  },
  default: {
    ...defaultNodeConfiguration.default,
    content: {
      endpoint: "https://api.charisma.fr/charisma/anniversaire/mariage",
    },
  },
};

export default NodeAnniversaire;
