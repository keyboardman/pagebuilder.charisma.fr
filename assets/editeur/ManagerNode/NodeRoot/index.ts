import { type NodeType } from "../../types/NodeType";
import { defaultNodeConfiguration, type NodeConfigurationType } from "../NodeConfigurationType";
import Settings from "./Settings";
import View from "./View";
import Edit from "./Edit";

export const NODE_ROOT_TYPE = "node-root" as const;

export type TypographyElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'p';

export interface DefaultStyle {
  fontSize: string;
  fontFamily: string;
  lineHeight: string;
  color: string;
}

export interface NodeRootType extends NodeType {
  type: 'node-root';
  content: {
    title: string;
    defaultStyles?: Partial<Record<TypographyElement, DefaultStyle>>;
  };
};

/**
 * Styles par défaut pour les éléments de typographie
 * Utilisés comme valeurs par défaut dans la configuration du node et comme fallback dans les autres fichiers
 */
export const DEFAULT_TYPOGRAPHY_STYLES: Record<TypographyElement, DefaultStyle> = {
  h1: { fontSize: '2.25rem', fontFamily: 'var(--font-sans)', lineHeight: '2.5', color: 'var(--foreground)' },
  h2: { fontSize: '1.875rem', fontFamily: 'var(--font-sans)', lineHeight: '2.25', color: 'var(--foreground)' },
  h3: { fontSize: '1.5rem', fontFamily: 'var(--font-sans)', lineHeight: '2', color: 'var(--foreground)' },
  h4: { fontSize: '1.25rem', fontFamily: 'var(--font-sans)', lineHeight: '1.75', color: 'var(--foreground)' },
  h5: { fontSize: '1.125rem', fontFamily: 'var(--font-sans)', lineHeight: '1.75', color: 'var(--foreground)' },
  h6: { fontSize: '1rem', fontFamily: 'var(--font-sans)', lineHeight: '1.5', color: 'var(--foreground)' },
  p: { fontSize: '1rem', fontFamily: 'var(--font-sans)', lineHeight: '1.5', color: 'var(--foreground)' },
  div: { fontSize: '1rem', fontFamily: 'var(--font-sans)', lineHeight: '1.5', color: 'var(--foreground)' },
};

export const NodeRoot: NodeConfigurationType = {
    ...defaultNodeConfiguration,
    type: NODE_ROOT_TYPE,
    view: View,
    edit: Edit,
    settings: Settings,
    default: {
      ...defaultNodeConfiguration.default,
      content: { 
        title: "",
        defaultStyles: DEFAULT_TYPOGRAPHY_STYLES
      }
    },
    button: null
};


export default NodeRoot;