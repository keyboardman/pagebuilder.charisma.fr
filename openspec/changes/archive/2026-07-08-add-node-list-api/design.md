## Context

**NodeCardApi** affiche **un** item sélectionné (`apiId` + `itemId`). **NodeNavApi** affiche une **collection de liens** issus d’APIs de type `list`. Il manque un nœud générique pour afficher une **liste visuelle d’items** (image, titre, description, compteur) alimentée par les mêmes ApiCards **`list`** (`AbstractApiCardList`).

Le registre Symfony expose déjà `fetchCollection` et un format mappé standard (`id`, `title`, `description`, `image`, `labels`, `link`, `text`, `raw`). Le champ **compteur** n’est pas encore normalisé dans ce contrat.

## Goals / Non-Goals

**Goals:**

- Introduire **NodeListApi** (`node-list-api`) : sélection d’une ApiCard, chargement de la collection, rendu d’une liste d’items.
- Permettre d’activer ou masquer indépendamment **image**, **titre**, **description** et **compteur** via `content.show`.
- Étendre le contrat `mapItem` avec un champ optionnel **`counter`** propagé jusqu’au frontend.
- Réutiliser les patterns éprouvés de **NodeNavApi** (chargement collection, états dégradés) et de **NodeCardApi** (sous-parties stylables, toggles `show`).
- Exposer des hooks CSS (`ce-list-api`, `ce-list-api-item`, `ce-list-api-image`, etc.) pour le thème.

**Non-Goals:**

- Pagination ou recherche interactive dans le builder (la collection est chargée selon les paramètres par défaut de l’ApiCard, comme NodeNavApi en mode fixe).
- Réordonnancement manuel des items dans le builder.
- Remplacement de **NodeCardApi**, **NodeNavApi** ou des nœuds custom existants (ex. **NodePureMusicTopSemaine**).
- Nouveau type ApiCard dédié : le nœud consomme le type **`list`** (`AbstractApiCardList`), comme **NodeNavApi**, avec un rendu différent.

## Decisions

- **Types ApiCard éligibles** : le sélecteur d’API dans les réglages ne propose que les adapters dont `type` est **`list`** (`AbstractApiCardList`). **NodeNavApi** et **NodeListApi** partagent ce type mais ont des rendus distincts (menu de liens vs liste riche).
- **Pas d’`itemId`** : contrairement à **NodeCardApi**, le nœud ne sélectionne pas un item unique ; il charge toute la collection via `fetchCollection` (page 1, limite adaptée au mode `normal` / `fixed` de l’ApiCard).
- **Visibilité des champs** : `content.show.image`, `content.show.title`, `content.show.description`, `content.show.counter` (booléens, tous optionnels, défaut `true`). Un champ activé mais absent dans l’item mappé n’est pas rendu (pas d’espace réservé vide).
- **Champ `counter`** : ajout optionnel au format mappé (`counter?: string | number`). Les implémentations ApiCard peuvent le peupler depuis leurs données brutes (ex. `compteur`, `views`, rang). Propagation : `ApiCardInterface::mapItem` → `BuilderApiCardItem` → `ApiAdapter.mapItem` → rendu NodeListApi.
- **Structure de contenu** : `content.apiId`, `content.show`, `content.list` (styles conteneur), `content.item` (styles par item), `content.image`, `content.title`, `content.description`, `content.counter` (styles par sous-partie, alignés sur NodeCardApi).
- **Rendu HTML** : conteneur `<ul class="ce-list-api">` ou `<div>` selon sémantique retenue ; chaque item en `<li class="ce-list-api-item">` avec sous-éléments conditionnels. Lien optionnel sur l’item si `link` est présent dans le mapping (wrapper ou zone cliquable, comme NodeCardApi).
- **Réutilisation des vues partagées** : importer depuis `ManagerNode/shared/card/` (`ViewImage`, `ViewTitle`, etc.) lorsque compatible, pour limiter la duplication.
- **Mode collection fixe** : si l’ApiCard déclare `collectionMode: "fixed"`, charger avec une limite élevée sans recherche (même stratégie que NodeSlideshow / NodeNavApi).

## Risks / Trade-offs

- **[Champ counter hétérogène]** → Les APIs distantes nomment le compteur différemment. Mitigation : chaque ApiCard mappe vers `counter` dans `mapItem` ; le nœud n’interprète pas `raw`.
- **[Performance collection volumineuse]** → Un `fetchCollection` avec trop d’items peut ralentir le rendu. Mitigation : respecter la limite de l’ApiCard ; pas de pagination UI dans cette version.
- **[Latence API]** → Afficher état vide ou placeholder discret sans bloquer la sauvegarde (aligné NodeNavApi).
- **[Duplication partielle avec NodeCardApi]** → Mitigation : factorisation via modules `shared/card/` ; pas de fusion des nœuds.

## Migration Plan

- Aucune migration de contenu : nouveau nœud uniquement.
- Extension rétrocompatible du JSON ApiCard (`counter` optionnel) : les clients existants ignorent le nouveau champ.
- Déploiement : merge du nœud + extension backend ; aucune action requise sur les pages existantes.

## Open Questions

- Faut-il livrer une ApiCard de référence mettant en avant `counter` dès la première implémentation, ou s’appuyer sur une ApiCard Charisma existante ? À trancher à l’implémentation.
- Limite par défaut de `fetchCollection` pour NodeListApi (ex. 20 vs 50) : calquer sur NodeNavApi / NodeSlideshow.
