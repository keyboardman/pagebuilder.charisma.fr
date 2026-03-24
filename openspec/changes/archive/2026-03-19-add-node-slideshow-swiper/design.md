## Context
Le builder utilise un système de “nodes” React enregistrés via `NodeRegistry`, avec un mode édition (panneau de réglages) et un mode vue (rendu dans la preview et le rendu final). Les nodes exploitent des composants communs (ex. sélection d’images via médiathèque/file manager en iframe + `postMessage`).

## Goals / Non-Goals
- Goals:
  - Ajouter un nouveau node `node-slideshow` qui rend un carousel via Swiper.
  - Permettre l’édition d’une liste d’images (add, tri, supprimer, modifier l’image de la slide sélectionnée).
  - Exposer des réglages Swiper : navigation, pagination, vitesse (ms).
- Non-Goals:
  - Ne pas développer une gestion de mise en page complexe (ratios/hauteurs avancés) au-delà d’un comportement cohérent avec les images.

## Decisions
- Dépendance:
  - Utiliser la librairie `swiper` côté frontend et activer les modules `Navigation` et `Pagination`.
- Modèle de données du node:
  - `content.slides`: tableau ordonné d’images (URL absolue) représentant l’ordre Swiper.
  - `content.navigationEnabled`: boolean
  - `content.paginationEnabled`: boolean
  - `content.speedMs`: nombre entier (ms)
- Edition:
  - Utiliser le file manager existant (même mécanisme que `InputFile`) pour ajouter/modifier une image d’une slide.
  - Utiliser un drag-and-drop pour réordonner la liste de slides dans le panneau de settings.
- Rendu:
  - Construire le DOM Swiper avec un conteneur unique du node et un `SwiperSlide` par image.
  - Appliquer navigation/pagination/vitesse depuis le `content` du node.

## Risks / Trade-offs
- CSS Swiper peut fuiter hors du scope; mitigation: wrapper du node et CSS spécifique à `data-ce-type="node-slideshow"`.
- L’intégration Swiper peut impacter le poids du bundle; mitigation: charger uniquement les modules nécessaires.

## Migration Plan
Non applicable (nouveau node).

## Open Questions
- Le type exact de pagination (bullets vs autre) sera fixé à la base sur un comportement simple (si besoin, on l’étendra ensuite).

