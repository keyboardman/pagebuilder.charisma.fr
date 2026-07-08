## Why

Le builder dispose deja d'une API card pour les evenements de la home, mais pas pour les bannieres d'evenements en retrospective. Les editeurs ont besoin d'une source dediee pour afficher les retrospectives sans reutiliser une card qui cible un endpoint different.

## What Changes

- Ajouter une nouvelle API card backend `CharismaEvenementRetrospectiveApiCard` sur le meme pattern que `CharismaEvenementHomeApiCard`.
- Consommer l'endpoint `https://api.charisma.fr/api/charisma/banniere/evenements/retrospective` avec pagination et filtre de recherche sur le titre.
- Mapper les items retournes vers le format image attendu par le builder (`id`, `title`, `image`, `link`, `raw`).
- Exposer cette card dans le registre des APIs card pour qu'elle soit selectionnable dans l'editeur.

## Capabilities

### New Capabilities
- `charisma-evenement-retrospective-api-card`: Fournir une API card image en collection fixe pour les bannieres d'evenements retrospective.

### Modified Capabilities
- Aucun.

## Impact

- Code backend impacte: `src/PageBuilder/ApiCard/` (nouvelle classe API card) et enregistrement de service/tags Symfony si necessaire.
- API externe consommee: `https://api.charisma.fr/api/charisma/banniere/evenements/retrospective`.
- Impacts frontend indirects: la nouvelle source devient disponible via les endpoints builder API existants.
