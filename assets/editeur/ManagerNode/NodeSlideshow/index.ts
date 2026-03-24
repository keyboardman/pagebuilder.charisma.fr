import { type NodeType } from "../../types/NodeType";
import Edit from "./Edit";
import Settings from "./Settings";
import { defaultNodeConfiguration, type NodeConfigurationType } from "../NodeConfigurationType";
import { IoImageOutline } from "react-icons/io5";
import SlideshowView from "./View";

export const NODE_SLIDESHOW_TYPE = "node-slideshow" as const;

export interface NodeSlideshowSlide {
  src: string;
  alt?: string;
}

export interface NodeSlideshowType extends NodeType {
  type: "node-slideshow";
  content: {
    slides: NodeSlideshowSlide[];
    navigationEnabled: boolean;
    paginationEnabled: boolean;
    /** Vitesse Swiper en millisecondes */
    speedMs: number;
    /** Autoplay Swiper en continu */
    autoplayEnabled: boolean;
    /** Délai autoplay Swiper en millisecondes */
    autoplayDelayMs: number;
    /** Nombre de slides visibles selon le breakpoint */
    slidesPerViewByBreakpoint: {
      desktop: number;
      tablet: number;
      mobile: number;
    };
    /** Aspect ratio CSS appliqué au média (ex: "16/9", "4/3", "1/1", "auto") */
    aspectRatio: string;
  };
}

export const NodeSlideshow: NodeConfigurationType = {
  ...defaultNodeConfiguration,
  view: SlideshowView,
  edit: Edit,
  settings: Settings,
  type: NODE_SLIDESHOW_TYPE,
  button: {
    ...defaultNodeConfiguration.button,
    label: "Slideshow",
    icon: IoImageOutline,
    category: "content",
    order: 6,
  },
  default: {
    ...defaultNodeConfiguration.default,
    content: {
      slides: [{ src: "https://placehold.net/3-800x600.png", alt: "" }],
      navigationEnabled: true,
      paginationEnabled: true,
      speedMs: 300,
      autoplayEnabled: true,
      autoplayDelayMs: 3000,
      slidesPerViewByBreakpoint: { desktop: 1, tablet: 1, mobile: 1 },
      aspectRatio: "16/9",
    },
  },
};

export default NodeSlideshow;

