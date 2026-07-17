import type { CollectionType } from "../index";

/** Vue thème par défaut — une seule par type image / video. */
export type CollectionDefaultView = "default";

/** Vues étendues pour le type article (en plus de `default`). */
export type CollectionArticleExtendedView = "article";

export type CollectionImageView = CollectionDefaultView;
export type CollectionVideoView = CollectionDefaultView;
export type CollectionArticleView = CollectionDefaultView | CollectionArticleExtendedView;

export type CollectionView = CollectionImageView | CollectionVideoView | CollectionArticleView;

export interface CollectionViewOption {
  value: string;
  label: string;
  /** Hook CSS thème principal (documentation / settings). */
  themeSelector: string;
}

type ViewRegistryEntry = {
  options: CollectionViewOption[];
  defaultView: string;
};

/**
 * Registre des vues disponibles par type de collection.
 * Chaque type a au minimum `default` (rendu aligné sur le nœud thème correspondant).
 * Les types peuvent déclarer des vues étendues supplémentaires.
 */
export const COLLECTION_VIEW_REGISTRY: Record<CollectionType, ViewRegistryEntry> = {
  image: {
    defaultView: "default",
    options: [{ value: "default", label: "Image (thème)", themeSelector: ".ce-image" }],
  },
  video: {
    defaultView: "default",
    options: [
      {
        value: "default",
        label: "Vidéo (thème)",
        themeSelector: ".ce-card .ce-video, .ce-card .ce-youtube",
      },
    ],
  },
  article: {
    defaultView: "default",
    options: [
      { value: "default", label: "Défaut", themeSelector: ".ce-card" },
      { value: "article", label: "Variante 1", themeSelector: ".ce-list-api" },
    ],
  },
};

export function getCollectionViewOptions(collectionType: CollectionType): CollectionViewOption[] {
  return COLLECTION_VIEW_REGISTRY[collectionType].options;
}

export function normalizeCollectionView(
  collectionType: CollectionType,
  value?: string
): CollectionView {
  const registry = COLLECTION_VIEW_REGISTRY[collectionType];

  if (collectionType === "article") {
    if (value === "article") return "article";
    // Migration depuis l'ancien schéma `card` → `default` (ce-card).
    if (value === "card") return "default";
    return "default";
  }

  // image / video : seule la vue default existe.
  if (value === "card") return "default";
  return registry.defaultView as CollectionView;
}

export function isYoutubeVideoSrc(src?: string): boolean {
  if (!src?.trim()) return false;
  return /youtube\.com|youtu\.be/i.test(src);
}
