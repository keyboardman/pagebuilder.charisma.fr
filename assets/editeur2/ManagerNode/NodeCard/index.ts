import { type NodeType } from "../../types/NodeType";
import { defaultNodeConfiguration, type NodeConfigurationType } from "../NodeConfigurationType";
import View from "./View";
import Edit from "./Edit";
import Settings from "./Settings";
import { IoCard } from "react-icons/io5";

export const NODE_CARD_TYPE = "node-card" as const;

export type CardElementType = "image" | "title" | "text" | "labels" | null;

export type ContainerPosition = "left" | "top" | "right";
export type ContainerAlign = "start" | "center" | "end" | "stretch";
export type ContainerRatio = "1/4" | "1/3"| "2/5" | "1/2" | "2/3" | "full";

export interface NodeCardType extends NodeType {
  type: "node-card";
  content: {
    show: {
      image?: boolean;
      title?: boolean;
      text?: boolean;
      labels?: boolean;
    };
    // container
    container: {
      position: ContainerPosition;
      align: ContainerAlign;
      ratio: ContainerRatio;
      link?: string;
    };

    // image
    image: {
      src?: string;
      alt?: string;
      className?: string;
      style?: React.CSSProperties;
    };

    // Contenu de la card
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


    //labels?: string[]; // Tableau de labels pour l'affichage
    //labelsInput?: string; // Valeur brute de l'input pour permettre la saisie

    
    // Élément sélectionné (pour l'affichage des settings)
    selectedElement?: CardElementType;
    
    // Styles pour chaque élément

    //labelsStyle?: React.CSSProperties;
    //labelsClassName?: string;
    //labelClassName?: string;
    contentClassName?: string;
  };
}

export const NodeCard: NodeConfigurationType = {
    ...defaultNodeConfiguration,
    view: View,
    edit: Edit,
    settings: Settings,
    type: NODE_CARD_TYPE,
    button: {
      ...defaultNodeConfiguration.button,
      label: "Card",
      icon: IoCard,
      category: 'standard',
      order: 2
    },
    default: {
      ...defaultNodeConfiguration.default,
      content: {
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
        //labelsInput: "",
      }
    }
};

export default NodeCard;

