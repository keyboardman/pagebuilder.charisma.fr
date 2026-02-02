
import { type NodeType } from "../../types/NodeType";
import { defaultNodeConfiguration, type NodeConfigurationType } from "../NodeConfigurationType";
import View from "./View";
import Settings from "./Settings";
import { IoImageOutline } from "react-icons/io5";

export const NODE_IMAGE_TYPE = "node-image" as const;

export interface NodeImageType extends NodeType {
  type: "node-image";
  content: {
    src: string;
    alt?: string;
  };
};

export const NodeImage: NodeConfigurationType = {
    ...defaultNodeConfiguration,
    view: View,
    edit: View,
    settings: Settings,
    type: NODE_IMAGE_TYPE,
    button: {
      ...defaultNodeConfiguration.button,
      label: "Image",
      icon: IoImageOutline,
      category: 'content',
      order: 3
    },
    default: {
      ...defaultNodeConfiguration.default,
      content: { src: 'https://placehold.net/3-800x600.png', alt: ''}
    }
};

export default NodeImage;