import { type FC } from "react";
import type { IconType } from "react-icons/lib";

// Ces types sont placeholders, donc on permet un objet vide
export type NodeViewProps = Record<string, never>
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
    edit: FC<NodeEditProps>;
    settings: FC<NodeSettingsProps>;
    type: string;
    button?: {
        label: string,
        icon: IconType,
        category?: string,
        order?:number
    }|null;
    default: {
        content?: Record<string, unknown>;
        attributes?: Record<string, unknown>;
    }
}