## Context

Le NodeSlideshow supporte deux modes de source (`manual` et `api-endpoint`). Le mode API a été implémenté en chargeant la collection dans `Settings.tsx` via `loadSlidesFromApi`, puis en persistant le résultat dans `content.slides`. `View.tsx` lit uniquement `content.slides`, ce qui fige les données.

**NodeNavApi** résout déjà ce cas : seul `apiId` est persisté ; `View.tsx` appelle `apiRegistry.get(apiId).fetchCollection()` dans un `useEffect`.

## Goals / Non-Goals

- Goals :
  - Données toujours fraîches en mode `api-endpoint` à chaque affichage.
  - Persistance minimale : `slidesMode`, `apiId`, réglages Swiper.
  - Cohérence architecturale avec NodeNavApi.
- Non-Goals :
  - Cache HTTP ou TTL côté client.
  - Réordonnancement manuel persistant des slides API.
  - Modification des contrats `builder-api-registry`.

## Decisions

- **Fetch au rendu** : extraire une fonction `mapCollectionToSlides(items, adapter)` partagée entre `View.tsx` et `Settings.tsx` (ou un petit module `slideshowApi.ts`) pour mapper `fetchCollection` → `NodeSlideshowSlide[]`.
- **Pas de persistance des slides API** : `loadSlidesFromApi` dans Settings met à jour un état React local pour la preview des vignettes ; seuls `slidesMode` et `apiId` passent par `updateContent`.
- **Sanitisation à la sauvegarde** : lors de la sérialisation (ou via `sanitizeNodes` / hook de save), si `slidesMode === "api-endpoint"`, forcer `slides` à `[]` ou omettre le champ pour ne pas réécrire de snapshot.
- **Migration douce** : au rendu, si `slidesMode === "api-endpoint"`, ignorer tout `content.slides` legacy et toujours fetcher depuis l’API.
- **États dégradés** : chargement (placeholder ou slide par défaut), erreur API (message discret ou slide placeholder), collection vide — sans bloquer la sauvegarde de la page.

## Risks / Trade-offs

- **Latence au premier paint** → afficher un état de chargement court (comme NodeNavApi) ; images en `loading="lazy"` conservées.
- **Indisponibilité API** → état dégradé ; la page reste éditable et sauvegardable.
- **Pages legacy** → les snapshots stockés ne seront plus utilisés ; comportement voulu.

## Migration Plan

1. Déployer le fetch runtime dans `View.tsx`.
2. Adapter `Settings.tsx` pour ne plus appeler `updateContent({ slides: ... })` en mode API.
3. Ajouter la sanitisation à la sauvegarde pour purger les slides API résiduelles.
4. Aucune migration base de données : le JSON de page est auto-corrigé à la prochaine sauvegarde.

## Open Questions

- Aucune pour l’instant : le périmètre est calqué sur NodeNavApi.
