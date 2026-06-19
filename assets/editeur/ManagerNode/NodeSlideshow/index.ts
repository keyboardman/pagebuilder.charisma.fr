import { type NodeType } from "../../types/NodeType";
import Settings from "./Settings";
import { defaultNodeConfiguration, type NodeConfigurationType } from "../NodeConfigurationType";
import { IoImageOutline } from "react-icons/io5";
import SlideshowView from "./View";

export const NODE_SLIDESHOW_TYPE = "node-slideshow" as const;

export interface NodeSlideshowSlide {
  src: string;
  alt?: string;
  /** Source d'ajout de l'image pour traçabilité éditoriale */
  source?: "media" | "api-fixed";
  /** URL de destination optionnelle de la slide */
  link?: string;
  /** Références optionnelles pour les slides issues d'API */
  apiId?: string;
  itemId?: string;
}

export interface NodeSlideshowType extends NodeType {
  type: "node-slideshow";
  content: {
    /**
     * Mode de source des slides :
     * - `manual` : liste éditée directement (src/alt/lien) côté éditeur
     * - `api-endpoint` : liste déterminée par la sélection d'une API image fixe
     */
    slidesMode: "manual" | "api-endpoint";
    /** API endpoint sélectionnée (quand `slidesMode="api-endpoint"`) */
    apiId?: string;
    /**
     * Slides persistées uniquement en mode `manual`.
     * En mode `api-endpoint`, le tableau reste vide à la sauvegarde ;
     * les slides sont chargées à l'affichage via `apiId`.
     */
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
    /** Effet de transition Swiper */
    effect: "slide" | "fade" | "cube" | "coverflow" | "flip" | "cards" | "creative";
    /** Border radius CSS appliqué aux images (ex: "12px", "1rem", "20%") */
    imageBorderRadius: string;
    /** Espace horizontal entre slides (px) */
    gap: number;
  };
}

export const NodeSlideshow: NodeConfigurationType = {
  ...defaultNodeConfiguration,
  view: SlideshowView,
  settings: Settings,
  type: NODE_SLIDESHOW_TYPE,
  button: {
    ...defaultNodeConfiguration.button,
    label: "Slideshow",
    icon: IoImageOutline,
    category: "content",
    order: 10,
  },
  default: {
    ...defaultNodeConfiguration.default,
    content: {
      slidesMode: "manual",
      apiId: undefined,
      slides: [{ src: "https://placehold.net/3-800x600.png", alt: "", source: "media", link: "" }],
      navigationEnabled: true,
      paginationEnabled: true,
      speedMs: 300,
      autoplayEnabled: true,
      autoplayDelayMs: 3000,
      slidesPerViewByBreakpoint: { desktop: 1, tablet: 1, mobile: 1 },
      aspectRatio: "16/9",
      effect: "slide",
      imageBorderRadius: "0px",
      gap: 10,
    },
  },
};

export default NodeSlideshow;

