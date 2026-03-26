# Change: Ajouter des collections fixes pour ApiCardInterface

## Why
Le builder doit pouvoir consommer des collections fixes provenant d'APIs card, pas seulement pour les images mais aussi pour les vidéos et les articles. En parallèle, les APIs de type `image` doivent aussi continuer à gérer un mode normal, comme `video` et `article`, pour préserver un comportement homogène.

## What Changes
- Étendre le contrat des APIs card pour formaliser une collection fixe pour les types `image`, `video` et `article`.
- Clarifier que le mode collection fixe est curaté côté backend et n'exige pas de recherche/pagination pilotée par l'utilisateur.
- Préciser que le type `image` supporte aussi le mode normal (non fixe), avec le même niveau de prise en charge que `video` et `article`.
- Clarifier que la variante d'affichage image (`list` ou `slider`) est pilotée uniquement par l'éditeur page builder, sans métadonnée backend dans `ApiCard`.
- Clarifier le mapping minimal des items pour chaque type en mode collection fixe.

## Impact
- Affected specs: `builder-api-registry`
- Affected code: `src/PageBuilder/ApiCard/ApiCardInterface.php`, `src/PageBuilder/ApiCard/ApiCardArticleInterface.php`, `src/PageBuilder/ApiCard/ApiCardVideoInterface.php`, `src/PageBuilder/ApiCard/ApiCardImageInterface.php`, implémentations `ApiCard*`, endpoints JSON consommés par le builder
