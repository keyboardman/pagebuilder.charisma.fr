import { type NodeType } from "../../types/NodeType";
import { defaultNodeConfiguration, type NodeConfigurationType } from "../NodeConfigurationType";
import View from "./View";
import Settings from "./Settings";
import { IoAlbumsOutline } from "react-icons/io5";
import type React from "react";
import type { ContainerAlign, ContainerPosition, ContainerRatio } from "../NodeCard";
import type { CollectionView } from "./View/collectionViews";

export const NODE_COLLECTION_TYPE = "node-collection" as const;

export const COLLECTION_IMAGE_MEDIA_TYPE = "media" as const;

export type CollectionType = "image" | "video" | "article";
export type CollectionMode = "fixed" | "dynamic";
export type CollectionDisplay = "list" | "grid" | "slideshow";

export type {
  CollectionView,
  CollectionImageView,
  CollectionVideoView,
  CollectionArticleView,
} from "./View/collectionViews";

/** Entrée dynamique article (`id` item + `type` = apiId source). */
export interface CollectionArticleDynamicEntry {
  id: string;
  type: string;
}

/** Entrée dynamique image (médiathèque). */
export interface CollectionImageMediaEntry {
  id: string;
  type: typeof COLLECTION_IMAGE_MEDIA_TYPE;
  src: string;
  alt?: string;
  link?: string;
}

export interface CollectionVideoDynamicEntry {
  apiId: string;
  itemId: string;
  title?: string;
}

export interface CollectionShow {
  image?: boolean;
  title?: boolean;
  description?: boolean;
  counter?: boolean;
  like?: boolean;
  labels?: boolean;
}

export interface CollectionStyledPart {
  className?: string;
  style?: React.CSSProperties;
}

export interface CollectionListOptions {
  gap?: number;
}

export interface CollectionGridOptions {
  columns?: {
    desktop?: number;
    tablet?: number;
    mobile?: number;
  };
  gap?: number;
}

export interface CollectionSlideshowOptions {
  navigationEnabled?: boolean;
  paginationEnabled?: boolean;
  speedMs?: number;
  autoplayEnabled?: boolean;
  autoplayDelayMs?: number;
  slidesPerViewByBreakpoint?: {
    desktop: number;
    tablet: number;
    mobile: number;
  };
  aspectRatio?: string;
  effect?: "slide" | "fade" | "cube" | "coverflow" | "flip" | "cards" | "creative";
  imageBorderRadius?: string;
  gap?: number;
}

export interface CollectionCardContainer {
  position?: ContainerPosition;
  align?: ContainerAlign;
  ratio?: ContainerRatio;
  style?: React.CSSProperties;
}

export interface NodeCollectionType extends NodeType {
  type: "node-collection";
  content: {
    collectionType?: CollectionType;
    mode?: CollectionMode;
    display?: CollectionDisplay;
    view?: CollectionView;
    apiId?: string;
    page?: number;
    itemsPerPage?: number;
    dynamicImageItems?: CollectionImageMediaEntry[];
    dynamicArticleItems?: CollectionArticleDynamicEntry[];
    dynamicVideoItems?: CollectionVideoDynamicEntry[];
    show?: CollectionShow;
    list?: CollectionListOptions;
    grid?: CollectionGridOptions;
    slideshow?: CollectionSlideshowOptions;
    collection?: CollectionStyledPart;
    item?: CollectionStyledPart;
    image?: CollectionStyledPart;
    title?: CollectionStyledPart;
    description?: CollectionStyledPart;
    counter?: CollectionStyledPart;
    like?: CollectionStyledPart;
    labels?: CollectionStyledPart;
    card?: { style?: React.CSSProperties };
    container?: CollectionCardContainer;
    text?: CollectionStyledPart;
  };
}

export const NodeCollection: NodeConfigurationType = {
  ...defaultNodeConfiguration,
  view: View,
  settings: Settings,
  type: NODE_COLLECTION_TYPE,
  button: {
    ...defaultNodeConfiguration.button,
    label: "Collection",
    icon: IoAlbumsOutline,
    category: "api",
    order: 6,
  },
  default: {
    ...defaultNodeConfiguration.default,
    content: {
      collectionType: "article",
      mode: "fixed",
      display: "list",
      view: "default",
      apiId: "",
      page: 1,
      itemsPerPage: 10,
      dynamicImageItems: [],
      dynamicArticleItems: [],
      dynamicVideoItems: [],
      show: {
        image: true,
        title: true,
        description: true,
        counter: true,
        like: true,
        labels: true,
      },
      list: {
        gap: 3,
      },
      grid: {
        columns: { desktop: 3, tablet: 2, mobile: 1 },
        gap: 4,
      },
      slideshow: {
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
      collection: { className: "", style: {} },
      item: { className: "", style: {} },
      image: { className: "", style: {} },
      title: { className: "", style: {} },
      description: { className: "", style: {} },
      counter: { className: "", style: {} },
      like: { className: "", style: {} },
      labels: { className: "", style: {} },
      card: { style: {} },
      container: {
        position: "top",
        align: "start",
        ratio: "full",
        style: {},
      },
      text: { className: "", style: {} },
    },
  },
};

export default NodeCollection;
