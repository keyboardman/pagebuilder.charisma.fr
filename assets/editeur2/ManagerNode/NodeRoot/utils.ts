import { useEffect } from "react";
import type { DefaultStyle, TypographyElement } from "./index";
import { DEFAULT_TYPOGRAPHY_STYLES } from "./index";

/**
 * Génère les styles CSS pour les éléments de typographie
 * @param defaultStyles - Les styles personnalisés depuis la configuration du node
 * @param applyToAllElements - Si true, applique les styles à h1-h6, p et div. Si false, applique uniquement à h1-h6
 * @returns Le CSS généré pour les éléments de typographie
 */
export const generateTypographyStyles = (
  defaultStyles?: Partial<Record<TypographyElement, DefaultStyle>>,
  applyToAllElements: boolean = false
): string => {
  // En mode edit (applyToAllElements = false), on n'applique que h1-h6 pour ne pas impacter le builder
  // En mode view (applyToAllElements = true), on applique tous les éléments (h1-h6, p, div)
  const elements: TypographyElement[] = applyToAllElements 
    ? ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
    : ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  
  // Valeurs par défaut depuis NodeRoot.default
  const fallbackStyles = DEFAULT_TYPOGRAPHY_STYLES;

  /* 1️⃣ Génération des variables (UNE FOIS) */
  const variables = `
  .node-root-content {
    ${elements.map(element => {
      const style = defaultStyles?.[element] ?? fallbackStyles[element];
      return `
      --${element}-font-size: ${style.fontSize};
      --${element}-font-family: ${style.fontFamily};
      --${element}-line-height: ${style.lineHeight};
      --${element}-color: ${style.color};
      `;
    }).join('')}
  }
`;

/* 2️⃣ Consommation (spécificité 0) */
const rules = elements.map(element => `
   :where(.node-root-content ${element}) {
    font-size: var(--${element}-font-size);
    font-family: var(--${element}-font-family);
    line-height: var(--${element}-line-height);
    color:  var(--${element}-color);
  }
  `).join('');
  
  return variables + rules;
};

/**
 * Hook personnalisé pour injecter les styles de typographie dans le head du document
 * @param document - Le document où injecter les styles (window.document ou iframe.contentDocument)
 * @param defaultStyles - Les styles personnalisés depuis la configuration du node
 * @param applyToAllElements - Si true, applique les styles à h1-h6, p et div. Si false, applique uniquement à h1-h6
 */
export const useTypographyStyles = (
  document: Document | null,
  defaultStyles?: Partial<Record<TypographyElement, DefaultStyle>>,
  applyToAllElements: boolean = false
) => {
  useEffect(() => {
    if (!document) return;

    const styleId = 'node-root-typography-styles';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      // Ajouter à la fin du head pour surcharger index.css
      document.head.appendChild(styleElement);
    }
    
    // Mettre à jour le contenu des styles
    styleElement.textContent = generateTypographyStyles(defaultStyles, applyToAllElements);
    
    // Nettoyer lors du démontage
    return () => {
      const element = document.getElementById(styleId);
      if (element) {
        element.remove();
      }
    };
  }, [document, defaultStyles, applyToAllElements]);
};

/**
 * Hook personnalisé pour mettre à jour le titre de la page
 * @param title - Le titre de la page à afficher
 * @param document - Le document où mettre à jour le titre (optionnel, utilise window.document par défaut)
 */
export const usePageTitle = (title?: string, document?: Document | null) => {
  useEffect(() => {
    const targetDoc = document || window.document;
    if (title) {
      targetDoc.title = title;
    }
  }, [title, document]);
};
