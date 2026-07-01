import { useEffect } from "react";

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
