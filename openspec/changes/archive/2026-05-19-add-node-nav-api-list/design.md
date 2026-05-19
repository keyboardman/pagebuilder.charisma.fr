## Context

**NodeNav** accepte des **NodeNavItem** déposés manuellement. Les blocs API existants (**NodeCardApi**, **NodeVideoApi**) sélectionnent **un** item via `apiId` + `itemId`. Un menu de navigation nécessite au contraire **toute** une collection d’entrées homogènes (libellé + URL).

Le registre Symfony expose déjà les `ApiCard` via `/page-builder/api/cards` ; le frontend les enregistre comme `ApiAdapter`. Les types actuels sont `article`, `video`, `image`.

## Goals / Non-Goals

- Goals:
  - Introduire le type ApiCard `list` et un nœud **NodeNavApi** réutilisant les hooks CSS de **NodeNav** (`ce-menu`, `ce-menu--{variant}`, `data-ce-variant`).
  - Permettre l’ajout de nouvelles sources menu par simple service PHP tagué.
- Non-Goals:
  - Édition manuelle des items dans le builder (pas d’enfants droppables).
  - Pagination/recherche côté UI pour la sélection d’API (seule la liste des APIs `list` est proposée).

## Decisions

- **Type ApiCard `list`** : nouvelle interface `ApiCardListInterface` avec `getType(): string` retournant `"list"`. Même contrat `fetchCollection` / `fetchItem` / `mapItem` que la base ; le format mappé impose `title` + `link` pour le rendu menu.
- **NodeNavApi sans enfants** : le nœud n’est pas droppable et ne crée pas de `NodeNavItem` ; les entrées viennent exclusivement de `fetchCollection` pour l’`apiId` configuré.
- **Configuration** : `content.apiId` (obligatoire pour un rendu utile) ; pas de `itemId`. Options de présentation reprises de **NodeNav** (`direction`, `variant`, `showBurger`, `target`, `justify`, `gap`, styles `nav` / `burger`). L’option `target` (`_self` / `_blank`) s’applique à tous les liens et n’est pas fournie par l’ApiCard `list`.
- **Mode de collection** : les APIs `list` peuvent être `normal` ou `fixed` via `ApiCardBehaviorInterface` ; en mode `fixed`, le nœud charge l’intégralité de la collection (limite élevée, sans recherche), comme pour les slideshows image en collection fixe.
- **Rendu** : structure HTML proche de **NodeNav** / **NodeNavItem** type lien (`<a href target>` avec texte `title`) pour réutiliser les styles thème existants (`ce-menu`, `ce-nav-item` ou équivalent documenté).
- **Sélecteur d’API** : dans les réglages du nœud, ne proposer que les adapters dont `type === "list"`.

## Alternatives considered

- **Réutiliser NodeNav + génération automatique de NodeNavItem enfants** : rejeté (pollution du modèle de page, synchronisation difficile à la sauvegarde).
- **Nœud custom hardcodé (comme NodeAnniversaire)** : rejeté (pas extensible ; une source par nœud).
- **Typer `list` sans interface dédiée** : rejeté (incohérent avec `ApiCardArticleInterface` / `ApiCardVideoInterface` / `ApiCardImageInterface`).

## Risks / Trade-offs

- **Latence / disponibilité API** → afficher un état vide ou message d’erreur dans l’éditeur et le rendu, sans bloquer la sauvegarde de la page.
- **Ordre des items** → défini par l’implémentation `fetchCollection` ; pas de réordonnancement manuel dans le builder (hors scope).

## Migration Plan

- Aucune migration de contenu : nouveau nœud et nouveau type ApiCard.
- Les pages existantes avec **NodeNav** ne sont pas impactées.

## Open Questions

- Quelle première implémentation PHP `ApiCardListInterface` livrer en même temps que le nœud (rubriques Charisma, stub, autre) ? À trancher à l’implémentation si non précisé en review.
