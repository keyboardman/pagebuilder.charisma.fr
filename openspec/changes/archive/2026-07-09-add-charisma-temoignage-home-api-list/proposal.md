## Why

Le builder dispose déjà de **NodeListApi** et d'une ApiCard article `CharismaTemoignageApiCard` (collection paginée `/api/charisma/temoignages`), mais pas d'une source **list** dédiée à la sélection éditoriale home (`/api/charisma/temoignages/home`). Les éditeurs ont besoin d'afficher la liste des témoignages mis en avant sur la page d'accueil Charisma sans reconfigurer manuellement une collection complète.

## What Changes

- Ajouter une nouvelle ApiCard backend **`CharismaTemoignageHomeApiList`** de type **`list`** (`AbstractApiCardList`), consommable par **NodeListApi**.
- Consommer l'endpoint `https://api.charisma.fr/api/charisma/temoignages/home` (collection API Platform avec `member` et `totalItems`).
- Mapper chaque témoignage vers le contrat `list` riche du builder : `id`, `title`, `link`, `description` (depuis `resume`), `image` (depuis `thumbnails.normal`), `labels` (depuis `theme.nom`), `raw`.
- Enregistrer la card dans `config/services.yaml` (tag `app.builder_api_card`).
- Documenter la nouvelle source dans `docs/ajout-api-card.md`.

## Capabilities

### New Capabilities

- `charisma-temoignage-home-api-list` : fournir une ApiCard `list` en collection fixe pour les témoignages home Charisma, exploitable par NodeListApi.

### Modified Capabilities

- Aucun (le contrat `list` et NodeListApi existent déjà ; seule une implémentation concrète est ajoutée).

## Impact

- Code backend : `src/PageBuilder/ApiCard/CharismaTemoignageHomeApiList.php` (nouvelle classe) et `config/services.yaml`.
- API externe consommée : `https://api.charisma.fr/api/charisma/temoignages/home`.
- Documentation : `docs/ajout-api-card.md`.
- Impacts frontend indirects : la nouvelle source apparaît dans le sélecteur d'API de NodeListApi via les endpoints builder existants.
