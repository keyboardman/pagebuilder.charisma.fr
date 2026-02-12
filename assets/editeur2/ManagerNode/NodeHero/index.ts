import { defaultNodeConfiguration, type NodeConfigurationType } from "../NodeConfigurationType";
import View from "./View";
import Settings from "./Settings";
import { IoImageOutline } from "react-icons/io5";
import { NODE_HERO_TYPE } from "./types";

export { NODE_HERO_TYPE };
export type {
  ContainerImageAlignHorizontal,
  ContainerImageAlignVertical,
  NodeHeroOptions,
  NodeHeroType,
  // alias legacy
  NodeContainerImageOptions,
  NodeContainerImageType,
} from "./types";

export const NodeHero: NodeConfigurationType = {
  ...defaultNodeConfiguration,
  view: View,
  edit: View,
  settings: Settings,
  type: NODE_HERO_TYPE,
  button: {
    ...defaultNodeConfiguration.button,
    label: "Hero",
    icon: IoImageOutline,
    category: "container",
    order: 4,
  },
  default: {
    ...defaultNodeConfiguration.default,
    attributes: {
      options: {
        src: "",
        ratio: "16/9",
        alignHorizontal: "center",
        alignVertical: "middle",
        dropzoneStyle: {},
      },
    },
  },
};

export default NodeHero;
