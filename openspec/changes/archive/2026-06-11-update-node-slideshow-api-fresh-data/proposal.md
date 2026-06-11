# Change: Données API fraîches pour NodeSlideshow

## Why

En mode `api-endpoint`, le NodeSlideshow persiste aujourd’hui la liste complète des slides (URLs, alt, liens) dans le contenu sérialisé de la page. Les visiteurs voient donc un snapshot figé au moment de la dernière sauvegarde, même si la collection API a évolué entre-temps. Le comportement attendu est aligné sur **NodeNavApi** : ne conserver que la référence à l’API (`apiId`) et recharger la collection à chaque affichage.

## What Changes

- En mode `api-endpoint`, le contenu persisté du nœud SHALL conserver `slidesMode`, `apiId` et les réglages Swiper, mais **ne SHALL pas** sérialiser le tableau `slides` issu de l’API.
- Le rendu (`View.tsx`) SHALL charger la collection via `fetchCollection` à l’affichage (éditeur, preview, rendu final), sur le même modèle que `NodeNavApi`.
- Le panneau de réglages SHALL prévisualiser les slides API en mémoire locale (bouton « Recharger ») sans écrire les slides dans le contenu du nœud.
- Le tri drag-and-drop et l’édition manuelle des slides SHALL rester limités au mode `manual`.
- À la sauvegarde, les slides API déjà présentes dans d’anciennes pages SHALL être ignorées ou purgées pour éviter toute réutilisation accidentelle.
- **BREAKING** (comportemental) : les pages existantes en mode `api-endpoint` n’afficheront plus le snapshot des slides sauvegardées ; elles afficheront la collection API courante (ou un état dégradé si l’API est indisponible).

## Impact

- Affected specs: `page-builder`
- Affected code:
  - `assets/editeur/ManagerNode/NodeSlideshow/View.tsx` (fetch runtime)
  - `assets/editeur/ManagerNode/NodeSlideshow/Settings.tsx` (preview locale, pas de persistance des slides API)
  - `assets/editeur/ManagerNode/NodeSlideshow/index.ts` (types / valeurs par défaut)
  - Éventuellement un helper de sanitisation à la sauvegarde (comme pour d’autres nœuds API)
