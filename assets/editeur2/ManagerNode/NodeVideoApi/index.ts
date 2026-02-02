import { type NodeType } from "../../types/NodeType";
import { defaultNodeConfiguration, type NodeConfigurationType } from "../NodeConfigurationType";
import View from "./View";
import Settings from "./Settings";
import { IoFilmOutline } from "react-icons/io5";

export const NODE_VIDEO_API_TYPE = "node-video-api" as const;

export interface NodeVideoApiType extends NodeType {
  type: "node-video-api";
  content: {
    // Références API
    apiId?: string;
    itemId?: string;

    // Contenu vidéo (identique à NodeVideo)
    src: string;
    poster: string;
    autoplay?: boolean;
    controls?: boolean;

    card: {
      style?: React.CSSProperties;
    };

    image: {
      style?: React.CSSProperties;
    }

    // Titre avec style (comme dans NodeCardApi)
    title?: {
      text?: string;
      className?: string;
      style?: React.CSSProperties;
    };
    showTitle?: boolean;
  };
}

export const NodeVideoApi: NodeConfigurationType = {
    ...defaultNodeConfiguration,
    view: View,
    edit: View,
    settings: Settings,
    type: NODE_VIDEO_API_TYPE,
    button: {
      ...defaultNodeConfiguration.button,
      label: "Video API",
      icon: IoFilmOutline,
      category: 'api',
      order: 2
    },
    default: {
      ...defaultNodeConfiguration.default,
      content: {
        apiId: "",
        itemId: "",
        src: "",
        poster: "",
        autoplay: true,
        controls: true,
        card: {
          style: {}
        },
        image: {
          style: {}
        },
        title: {
          text: "",
          className: "",
          style: {}
        },
        showTitle: true
      }
    }
};

export default NodeVideoApi;
