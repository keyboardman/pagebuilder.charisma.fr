## Why

Chaque implémentation ApiCard (`CharismaEvenementApiCard`, `CharismaVideosApiCard`, etc.) redéclare manuellement `getType()` pour retourner la même valeur (`image`, `article`, `video` ou `list`) que celle déjà implicite dans l'interface qu'elle implémente. C'est du code dupliqué, source d'erreurs (mauvais type déclaré) et de bruit lors de l'ajout d'une nouvelle API.

## What Changes

- Ajouter une implémentation par défaut de `getType()` dans chaque interface typée (`ApiCardArticleInterface`, `ApiCardVideoInterface`, `ApiCardImageInterface`, `ApiCardListInterface`) retournant respectivement `article`, `video`, `image` et `list`.
- Supprimer les méthodes `getType()` redondantes dans toutes les classes ApiCard existantes qui implémentent une interface typée.
- Conserver `getType()` sur `ApiCardInterface` pour les cas où une implémentation directe de la base serait nécessaire (aucun cas actuel).

## Capabilities

### New Capabilities

_(aucune)_

### Modified Capabilities

- `builder-api-registry` : préciser que les interfaces typées fournissent `getType()` par défaut et que les implémentations n'ont pas à le redéclarer.

## Impact

- Code affecté : `src/PageBuilder/ApiCard/ApiCard*Interface.php` (4 interfaces) et toutes les implémentations concrètes (~8 classes).
- Aucun changement d'API HTTP ni de contrat JSON exposé au builder.
- Comportement inchangé pour le registre et le frontend : le champ `type` reste identique.
