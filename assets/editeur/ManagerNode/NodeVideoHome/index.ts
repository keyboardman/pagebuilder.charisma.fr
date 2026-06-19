import { type NodeType } from "../../types/NodeType";
import { defaultNodeConfiguration, type NodeConfigurationType } from "../NodeConfigurationType";
import View from "./View";
import Settings from "./Settings";
import { IoFilmOutline } from "react-icons/io5";
import type React from "react";

export const NODE_VIDEO_HOME_TYPE = "node-video-home" as const;

export interface NodeVideoHomeItem {
  id: string;
  title: string;
  type: "charisma" | "youtube";
  source: string;
  poster: string;
}

export interface NodeVideoHomeType extends NodeType {
  type: "node-video-home";
  content: {
    endpoint: string;
    container: {
      style?: React.CSSProperties;
    };
    card: {
      style?: React.CSSProperties;
    };
    image: {
      style?: React.CSSProperties;
    };
    title: {
      style?: React.CSSProperties;
    };
    videos: NodeVideoHomeItem[];
  };
}

export const NodeVideoHome: NodeConfigurationType = {
  ...defaultNodeConfiguration,
  view: View,
  settings: Settings,
  type: NODE_VIDEO_HOME_TYPE,
  button: {
    ...defaultNodeConfiguration.button,
    label: "Vdo Home",
    icon: IoFilmOutline,
    category: "custom",
    order: 2,
  },
  default: {
    ...defaultNodeConfiguration.default,
    content: {
      endpoint: "https://api.charisma.fr/api/charisma/videos/homes",
      container: {
        style: {},
      },
      card: {
        style: {},
      },
      image: {
        style: {
          aspectRatio: "16 / 9",
        },
      },
      title: {
        style: {},
      },
      videos: [],
    },
  },
};

export default NodeVideoHome;
