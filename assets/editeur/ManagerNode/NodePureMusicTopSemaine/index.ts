import { type NodeType } from "../../types/NodeType";
import { defaultNodeConfiguration, type NodeConfigurationType } from "../NodeConfigurationType";
import View from "./View";
import Settings from "./Settings";
import { IoMusicalNotesOutline } from "react-icons/io5";
import type React from "react";

export const NODE_PUREMUSIC_TOP_SEMAINE_TYPE = "node-puremusic-top-semaine" as const;

export interface NodePureMusicTopSemaineItem {
  id: string;
  titre: string;
  artiste: string;
  album: string;
  vignette: string;
  source: string;
}

export interface NodePureMusicTopSemaineType extends NodeType {
  type: "node-puremusic-top-semaine";
  content: {
    endpoint: string;
    title: {
      style?: React.CSSProperties;
    };
    player: {
      style?: React.CSSProperties;
      icon?: {
        style?: React.CSSProperties;
      };
    };
    item: {
      style?: React.CSSProperties;
      number: {
        style?: React.CSSProperties;
      };
      title: {
        style?: React.CSSProperties;
      };
      icon: {
        style?: React.CSSProperties;
      };
      description: {
        style?: React.CSSProperties;
      };
    };
    musiques: NodePureMusicTopSemaineItem[];
  };
}

export const NodePureMusicTopSemaine: NodeConfigurationType = {
  ...defaultNodeConfiguration,
  view: View,
  settings: Settings,
  type: NODE_PUREMUSIC_TOP_SEMAINE_TYPE,
  button: {
    ...defaultNodeConfiguration.button,
    label: "Top PM",
    icon: IoMusicalNotesOutline,
    category: "custom",
    order: 3,
  },
  default: {
    ...defaultNodeConfiguration.default,
    content: {
      endpoint: "https://api.charisma.fr/api/puremusic/musiques/tops/semaine",
      title: {
        style: {},
      },
      player: {
        style: {
          backgroundColor: "#0f172a",
          color: "#ffffff",
        },
        icon: {
          style: {
            color: "#ffffff",
          },
        },
      },
      item: {
        style: {},
        number: {
          style: {},
        },
        title: {
          style: {},
        },
        icon: {
          style: {
            backgroundColor: "#4794D8",
            color: "#ffffff",
          },
        },
        description: {
          style: {},
        },
      },
      musiques: [],
    },
  },
};

export default NodePureMusicTopSemaine;
