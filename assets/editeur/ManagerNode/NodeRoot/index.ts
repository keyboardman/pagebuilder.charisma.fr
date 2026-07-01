import { type NodeType } from "../../types/NodeType";
import { defaultNodeConfiguration, type NodeConfigurationType } from "../NodeConfigurationType";
import Settings from "./Settings";
import View from "./View";

export const NODE_ROOT_TYPE = "node-root" as const;

export type NodeRootBackground =
  | { type: 'default' }
  | { type: 'color'; color: string }
  | {
      type: 'image';
      url: string;
      position?: string;
      size?: string;
      repeat?: string;
      color?: string;
    }
  | {
      type: 'video';
      url: string;
      poster?: string;
      objectFit?: string;
      objectPosition?: string;
      color?: string;
    };

export interface NodeRootType extends NodeType {
  type: 'node-root';
  content: {
    title: string;
    background?: NodeRootBackground;
  };
};

export const NodeRoot: NodeConfigurationType = {
    ...defaultNodeConfiguration,
    type: NODE_ROOT_TYPE,
    view: View,
    settings: Settings,
    default: {
      ...defaultNodeConfiguration.default,
      content: {
        title: "",
        background: { type: "default" },
      }
    },
    button: null
};


export default NodeRoot;
