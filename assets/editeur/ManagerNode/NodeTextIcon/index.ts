import type React from "react";
import { type NodeType } from "../../types/NodeType";
import View from "./View";
import Settings from "./Settings";
import { defaultNodeConfiguration, type NodeConfigurationType } from "../NodeConfigurationType";
import { IoText } from "react-icons/io5";

export const NODE_TEXT_ICON_TYPE = "node-text-icon" as const;

export type NodeTextIconName = "none" | "checkmark" | "star" | "arrow";
/** Taille visuelle : défaut (24px), petit (16px) ou grand (32px) — classes `ce-icon` / `ce-icon-small` / `ce-icon-large`. */
export type NodeTextIconSizeVariant = "default" | "small" | "large";
/** Source d'affichage de l'icône : presets intégrés, classe CSS du thème (mask), ou image URL. */
export type NodeTextIconSource = "preset" | "theme" | "image";
export type NodeTextIconPosition = "before" | "after";
export type NodeTextIconHorizontalAlign = "left" | "center" | "right";
export type NodeTextIconVerticalAlign = "top" | "middle" | "bottom";

/** Balise du bloc texte : corps de texte (`ce-text`) ou titres (`ce-header-h1` … `ce-header-h6`). */
export type NodeTextIconTag = "div" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface NodeTextIconType extends NodeType {
  type: "node-text-icon";
  content: {
    html: string;
    tag?: NodeTextIconTag;
    icon?: NodeTextIconName;
    /** Préréglage : preset (react-icons), theme (classe + CSS thème), image (URL). */
    iconSource?: NodeTextIconSource;
    /** Id stable de l'entrée icône dans la config thème (sélection éditeur). */
    themeIconId?: string;
    /** Classe CSS sans point (ex. ch_icon_home) — persistée pour le rendu sans repasser par la liste thème. */
    themeIconClass?: string;
    /** URL de l'image thème (secours si pas de classe, aperçu). */
    themeIconUrl?: string;
    /** Image personnalisée (URL absolue ou chemin servi). */
    iconImageUrl?: string;
    iconPosition?: NodeTextIconPosition;
    /** @deprecated Préférer iconSizeVariant ; conservé pour migration depuis d’anciennes pages. */
    iconSize?: number;
    iconSizeVariant?: NodeTextIconSizeVariant;
    linkUrl?: string;
    horizontalAlign?: NodeTextIconHorizontalAlign;
    verticalAlign?: NodeTextIconVerticalAlign;
    /** Conteneur flex (marge, padding, fond, bordure). */
    container?: {
      style?: React.CSSProperties;
    };
    /** Bloc texte (typographie, fond, bordure, espacement). */
    text?: {
      style?: React.CSSProperties;
    };
    /** Élément `<i>` icône (couleur via fond, bordure, espacement). */
    iconMedia?: {
      style?: React.CSSProperties;
    };
  };
}

export const NodeTextIcon: NodeConfigurationType = {
  ...defaultNodeConfiguration,
  view: View,
  settings: Settings,
  type: NODE_TEXT_ICON_TYPE,
  button: {
    ...defaultNodeConfiguration.button!,
    label: "Text Icon",
    icon: IoText,
    category: "content",
    order: 4,
  },
  default: {
    ...defaultNodeConfiguration.default,
    content: {
      html: "...",
      tag: "div",
      icon: "none" as NodeTextIconName,
      iconSource: "preset" as NodeTextIconSource,
      themeIconId: "",
      themeIconClass: "",
      themeIconUrl: "",
      iconImageUrl: "",
      iconPosition: "before" as NodeTextIconPosition,
      iconSizeVariant: "default" as NodeTextIconSizeVariant,
      linkUrl: "",
      horizontalAlign: "left" as NodeTextIconHorizontalAlign,
      verticalAlign: "middle" as NodeTextIconVerticalAlign,
      container: { style: {} },
      text: { style: {} },
      iconMedia: { style: {} },
    },
  },
};

export default NodeTextIcon;
