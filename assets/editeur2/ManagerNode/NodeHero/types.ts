import type { NodeType } from "../../types/NodeType";

// Identifiant technique du node dans le contenu sérialisé.
// On garde la même valeur string pour compatibilité.
export const NODE_HERO_TYPE = "node-hero" as const;

export type ContainerImageAlignHorizontal = "start" | "center" | "end";
export type ContainerImageAlignVertical = "top" | "middle" | "bottom";

export interface NodeHeroOptions {
  src?: string;
  ratio?: string;
  alignHorizontal?: ContainerImageAlignHorizontal;
  alignVertical?: ContainerImageAlignVertical;
  /** Styles appliqués à la zone de dépôt (overlay) : background, spacing */
  dropzoneStyle?: React.CSSProperties;
}

export interface NodeHeroType extends NodeType {
  type: typeof NODE_HERO_TYPE;
  content?: undefined;
  isDroppable: true;
  attributes?: NodeType["attributes"] & {
    options?: NodeHeroOptions;
  };
}

// Alias pour compatibilité avec les anciens noms(NodeContainerImage*)
export const NODE_CONTAINER_IMAGE_TYPE = NODE_HERO_TYPE;
export type NodeContainerImageOptions = NodeHeroOptions;
export type NodeContainerImageType = NodeHeroType;
