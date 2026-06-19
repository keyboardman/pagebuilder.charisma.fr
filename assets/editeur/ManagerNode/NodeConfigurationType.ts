import { type FC } from "react";
import type { IconType } from "react-icons/lib";

// Ces types sont placeholders, donc on permet un objet vide
export type NodeViewProps = Record<string, never>
/** @deprecated Conservé pour compatibilité des signatures View ; le canevas ne monte plus de composant edit distinct. */
export type NodeEditProps = Record<string, never>

export type NodeSettingsProps= Record<string, never>;

export const defaultNodeConfiguration: Partial<NodeConfigurationType> = {
  button: {
    label: "Élément",
    icon: () => null, // icône vide par défaut
    category: "standard",
    order: 0,
  },
  default: {},
};

export interface NodeConfigurationType {
    view: FC<NodeViewProps>;
    settings: FC<NodeSettingsProps>;
    type: string;
    button?: {
        label: string,
        icon: IconType,
        category?: string,
        order?:number,
        tooltip?: string
    }|null;
    default: {
        content?: Record<string, unknown>;
        attributes?: Record<string, unknown>;
    }
}