## Why

Le builder dispose déjà de **NodeCardApi** (un item API) et de **NodeNavApi** (collection de liens de navigation), mais il manque un nœud générique pour afficher une **liste d’items riches** alimentée par une ApiCard : image, titre, description et compteur, avec la possibilité d’activer ou masquer chaque élément selon le besoin éditorial. Ce cas est fréquent (tops, rétrospectives, listes d’articles ou de médias) et ne doit pas imposer un nœud custom hardcodé par source.

## What Changes

- Ajout du nœud **`NodeListApi`** (identifiant `node-list-api`) dans le builder : sélection d’une ApiCard de type **`list`** (`AbstractApiCardList`), chargement de la collection via `fetchCollection`, rendu d’une liste d’items.
- Chaque item affiche optionnellement **image**, **titre**, **description** et **compteur** ; l’éditeur expose des toggles `show.image`, `show.title`, `show.description`, `show.counter` pour contrôler la visibilité de chaque champ au niveau du nœud.
- Extension du format mappé ApiCard avec un champ optionnel **`counter`** (nombre ou chaîne affichable) pour les sources qui exposent un compteur (vues, likes, classement, etc.).
- Réglages de style par sous-partie (image, titre, description, compteur, conteneur item) alignés sur les conventions des nœuds API existants.
- Hooks CSS dédiés (`ce-list-api`, `ce-list-api-item`, etc.) pour le ciblage thème.

## Capabilities

### New Capabilities

_Aucune — le comportement est couvert par des deltas sur les capacités existantes._

### Modified Capabilities

- `page-builder` : ajout du nœud **NodeListApi** (sélection API, chargement collection, affichage conditionnel image/titre/description/compteur, états dégradés, persistance).
- `builder-api-registry` : extension du contrat `mapItem` avec le champ optionnel `counter` et sa propagation jusqu’au JSON API Platform.

## Impact

- Affected specs: **page-builder**, **builder-api-registry**
- Affected code:
  - `assets/editeur/ManagerNode/NodeListApi/` (nouveau nœud : `index.ts`, `View.tsx`, `Settings.tsx`, utils)
  - `assets/editeur/ManagerNode/components/NodeRegistry.ts`
  - `assets/editeur/ManagerApi/` (`ApiAdapter.ts`, `backendApiAdapter.ts`)
  - `src/PageBuilder/ApiCard/ApiCardInterface.php` (docblock / contrat `counter`)
  - `src/ApiResource/BuilderApiCardItem.php`, `src/DTO/BuilderApiCardItemData.php`, `src/PageBuilder/Api/BuilderApiResourceFactory.php`
  - thème de base (`node-list-api.css` ou équivalent)
  - `assets/components/ThemeFormComponent/utils.ts` (sélecteur thème si applicable)
  - `docs/ajout-api-card.md` (documentation du champ `counter` et usage NodeListApi)
