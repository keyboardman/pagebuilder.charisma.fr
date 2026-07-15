import { type NodeType } from "../../types/NodeType";
import { defaultNodeConfiguration, type NodeConfigurationType } from "../NodeConfigurationType";
import View from "./View";
import Settings from "./Settings";
import { IoImagesOutline } from "react-icons/io5";
import type React from "react";
import type { NodeListImageMode } from "./listImageApiUtils";
import { LIST_IMAGE_MEDIA_TYPE } from "./listImageApiUtils";

export const NODE_LIST_IMAGE_TYPE = "node-list-image" as const;

export interface NodeListImageStyledPart {
  className?: string;
  style?: React.CSSProperties;
}

export interface NodeListImageMediaEntry {
  id: string;
  type: typeof LIST_IMAGE_MEDIA_TYPE;
  src: string;
  alt?: string;
  link?: string;
}

export interface NodeListImageType extends NodeType {
  type: "node-list-image";
  content: {
    listMode?: NodeListImageMode;
    apiId?: string;
    dynamicItems?: NodeListImageMediaEntry[];
    page?: number;
    itemsPerPage?: number;
    list: NodeListImageStyledPart;
    item: NodeListImageStyledPart;
    image: NodeListImageStyledPart;
  };
}

export const NodeListImage: NodeConfigurationType = {
  ...defaultNodeConfiguration,
  view: View,
  settings: Settings,
  type: NODE_LIST_IMAGE_TYPE,
  button: {
    ...defaultNodeConfiguration.button,
    label: "Liste <br/> Image",
    icon: IoImagesOutline,
    category: "api",
    order: 5,
  },
  default: {
    ...defaultNodeConfiguration.default,
    content: {
      listMode: "fixed",
      apiId: "",
      dynamicItems: [],
      page: 1,
      itemsPerPage: 10,
      list: {
        className: "",
        style: {},
      },
      item: {
        className: "",
        style: {},
      },
      image: {
        className: "",
        style: {},
      },
    },
  },
};

export default NodeListImage;
