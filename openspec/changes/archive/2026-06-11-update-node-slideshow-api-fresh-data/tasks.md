## 1. Modèle et sanitisation

- [x] 1.1 Documenter dans `NodeSlideshow/index.ts` que `slides` n’est persisté qu’en mode `manual` ; en `api-endpoint`, seuls `slidesMode` et `apiId` décrivent la source.
- [x] 1.2 À la sauvegarde (hook existant ou `sanitizeNodes`), purger `content.slides` lorsque `slidesMode === "api-endpoint"`.

## 2. Chargement runtime (View)

- [x] 2.1 Extraire un helper `mapCollectionToSlides` (adapter + items → `NodeSlideshowSlide[]`) réutilisable.
- [x] 2.2 Dans `View.tsx`, si `slidesMode === "api-endpoint"` et `apiId` est défini, charger la collection via `fetchCollection` dans un `useEffect` (pattern NodeNavApi).
- [x] 2.3 Gérer les états chargement, erreur et collection vide sans bloquer le rendu Swiper.
- [x] 2.4 Conserver le comportement actuel (lecture de `content.slides`) en mode `manual`.

## 3. Panneau de réglages (Settings)

- [x] 3.1 Remplacer la persistance des slides API par un état local pour la preview des vignettes.
- [x] 3.2 Conserver le bouton « Recharger » pour rafraîchir la preview éditoriale sans modifier le contenu persisté.
- [x] 3.3 Désactiver le tri drag-and-drop des vignettes en mode `api-endpoint` (l’ordre vient de l’API).
- [x] 3.4 Lors du passage en mode `api-endpoint`, ne persister que `slidesMode` / `apiId` (pas de snapshot de slides).

## 4. Validation

- [x] 4.1 Vérifier manuellement : sélection API → preview à jour → sauvegarde → rechargement page → slides rechargées depuis l’API (pas le snapshot).
- [x] 4.2 Vérifier qu’une modification côté API se reflète après rechargement de la page publiée sans re-sauvegarde éditoriale.
- [x] 4.3 Vérifier le mode `manual` inchangé (persistance des slides).
- [x] 4.4 Exécuter `openspec validate update-node-slideshow-api-fresh-data --strict`.
