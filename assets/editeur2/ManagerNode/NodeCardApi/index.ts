import { type NodeType } from "../../types/NodeType";
import { defaultNodeConfiguration, type NodeConfigurationType } from "../NodeConfigurationType";
import View from "./View";
import Edit from "./Edit";
import Settings from "./Settings";
import { IoCardOutline } from "react-icons/io5";
import type { CardElementType, ContainerAlign, ContainerRatio } from "../NodeCard";

export type ContainerPositionApi = "left" | "top" | "right" | "overlay";

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
      position: ContainerPositionApi;
      align: ContainerAlign;
      ratio: ContainerRatio;
      link?: string;
      style?: React.CSSProperties;
      // Configuration du contenu en overlay sur l'image (activé automatiquement si position === "overlay")
      textOverlay?: {
        position?: 'bottom' | 'top' | 'center'; // Position du contenu sur l'image
        background?: {
          gradient?: string; // Gradient CSS (ex: linear-gradient(to top, rgba(0,0,0,0.8), transparent))
          color?: string; // Couleur de fond alternative (fallback si pas de gradient)
        };
      };
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

    // Élément sélectionné (pour l'affichage des settings)
    selectedElement?: CardElementType;
  };
}

export const NodeCardApi: NodeConfigurationType = {
    ...defaultNodeConfiguration,
    view: View,
    edit: Edit,
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
          ratio: "1/3",
          link: "#",
          style: {},
          textOverlay: {
            position: "bottom",
            background: {},
          },
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
