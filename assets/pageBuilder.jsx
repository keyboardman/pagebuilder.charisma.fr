import React from 'react';
import { createRoot } from 'react-dom/client';
import PageBuilderEmbed from './editeur2/PageBuilderEmbed';
import './editeur2/assets/css/index.css';

/**
 * Mount du PageBuilderEmbed (éditeur intégré sans iframe).
 * @param {string} containerId - ID du conteneur DOM
 * @param {Object} props - { value, onChange, fileManagerConfig }
 */
export function mountPageBuilder(containerId, props) {
  const el = document.getElementById(containerId);
  if (!el) return null;
  const root = createRoot(el);
  root.render(React.createElement(PageBuilderEmbed, props));
  return root;
}

export { PageBuilderEmbed };
