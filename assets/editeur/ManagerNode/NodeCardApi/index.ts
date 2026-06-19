import { type NodeType } from "../../types/NodeType";
import { defaultNodeConfiguration, type NodeConfigurationType } from "../NodeConfigurationType";
import View from "./View";
import Settings from "./Settings";
import { IoCardOutline } from "react-icons/io5";

export type ContainerPosition = "left" | "right" | "top" | "overlay";
export type ContainerTextPositionApi = "bottom" | "top" | "center";
export type ContainerAlign = "start" | "center" | "end" | "stretch";
export type ContainerRatio = "1_4" | "1_3"| "2_5" | "1_2" | "2_3" | "full";

export const ContainerPositionOptions = [
  { label: "Gauche", value: "left" },
  { label: "Droite", value: "right" },
  { label: "Haut", value: "top" },
  { label: "Overlay", value: "overlay" },
];

export const ContainerAlignOptions = [
  { label: "Début", value: "start" },
  { label: "Centre", value: "center" },
  { label: "Fin", value: "end" },
  { label: "Étirer", value: "stretch" },
];

export const ContainerRatioOptions = [
  { label: "1/4", value: "1_4" },
  { label: "1/3", value: "1_3" },
  { label: "1/2", value: "1_2" },
  { label: "Plein", value: "full" },
];

export const NODE_CARD_API_TYPE = "node-card-api" as const;

export interface NodeCardApiType extends NodeType {
  type: "node-card-api";
  content: {
    // Références API
    apiId?: string;
    itemId?: string;

    // Affichage des éléments (identique à NodeCard)
    show: {
      image?: boolean;
      title?: boolean;
      text?: boolean;
      labels?: boolean;
    };

    card: {
      style?: React.CSSProperties;
    };

    // container (identique à NodeCard avec option overlay)
    container: {
      position: ContainerPosition;
      align: ContainerAlign;
      ratio: ContainerRatio;
      link?: string;
      style?: React.CSSProperties;
    };

    // image (identique à NodeCard)
    image: {
      src?: string;
      alt?: string;
      className?: string;
      style?: React.CSSProperties;
    };

    // contenu (identique à NodeCard)
    title: {
      text?: string;
      className?: string;
      style?: React.CSSProperties;
    };

    text: {
      text?: string;
      className?: string;
      style?: React.CSSProperties;
    };

    labels: {
      className?: string;
      style?: React.CSSProperties;
      items?: string[];
    };

  };
}

export const NodeCardApi: NodeConfigurationType = {
    ...defaultNodeConfiguration,
    view: View,
    settings: Settings,
    type: NODE_CARD_API_TYPE,
    button: {
      ...defaultNodeConfiguration.button,
      label: "Card API",
      icon: IoCardOutline,
      category: 'api',
      order: 3
    },
    default: {
      ...defaultNodeConfiguration.default,
      content: {
        apiId: "",
        itemId: "",
        show: {
          image: true,
          title: true,
          text: true,
          labels: true,
        },
        container: {
          position: "top",
          align: "start",
          ratio: "full",
          link: "#",
          style: {}
        },
        image: {
          src: "",
          alt: "",
          className: "",
          style: {},
        },
        title: {
          text: "",
          className: "",
          style: {},
        },
        text: {
          text: "",
          className: "",
          style: {},
        },
        labels: {
          items: [],
          className: "",
          style: {},
        },
      }
    }
};

export default NodeCardApi;
