import { type NodeType } from "../../types/NodeType";
import View from "./View";
import Settings from "./Settings";
import { IoLogoYoutube } from "react-icons/io5";
import { defaultNodeConfiguration, type NodeConfigurationType } from "../NodeConfigurationType";

export const NODE_YOUTUBE_TYPE = "node-youtube" as const;

export interface NodeYoutubeType extends NodeType {
  type: "node-youtube";
  content: {
    videoId: string;
  };
};

export const NodeYoutube: NodeConfigurationType = {
  ...defaultNodeConfiguration,
  view: View,
  edit: View,
  settings: Settings,
  type: NODE_YOUTUBE_TYPE,
  button: {
    ...defaultNodeConfiguration.button,
    label: "Youtube",
    icon: IoLogoYoutube,
    category: 'content',
    order: 5
  },
  default: {
    ...defaultNodeConfiguration.default,
    content: { videoId: '' }
  }
};

export default NodeYoutube;

