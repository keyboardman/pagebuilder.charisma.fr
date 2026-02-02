import { type NodeType } from "../../types/NodeType";
import View from "./View";
import Settings from "./Settings";
import { IoFilmOutline } from "react-icons/io5";
import { defaultNodeConfiguration, type NodeConfigurationType } from "../NodeConfigurationType";

export const NODE_VIDEO_TYPE = "node-video" as const;

export interface NodeVideoType extends NodeType {
  type: "node-video";
  content: {
    src: string;
    poster: string;
    autoplay?: boolean;
    controls?: boolean;
  };
};

export const NodeVideo: NodeConfigurationType = {
  ...defaultNodeConfiguration,
  view: View,
  edit: View,
  settings: Settings,
  type: NODE_VIDEO_TYPE,
  button: {
    ...defaultNodeConfiguration.button,
    label: "Video",
    icon: IoFilmOutline,
    category: 'content',
    order: 4
  },
  default: {
    ...defaultNodeConfiguration.default,
    content: { src: '', poster: '', autoplay: false, controls: false }
  }
};

export default NodeVideo;
