## Context

Les nœuds `NodeListApi` et `NodeNavApi` chargent une collection fixe via `GET /api/page-builder/lists/{apiId}/items` (sans pagination). Le backend `ApiListArticle` interroge un endpoint distant figé et renvoie tous les items mappés.

Besoin utilisateur : limiter **l'affichage** à N éléments et choisir quelle « page » de la collection montrer — par ex. page 2 avec 10 items/page → afficher les items 11 à 20 de la collection reçue.

Les noms `page` et `itemsPerPage` reprennent la convention API Platform pour la cohérence éditoriale, mais ces paramètres restent **purement côté nœud** : ils ne sont pas transmis au backend ni aux APIs distantes.

## Goals / Non-Goals

**Goals:**

- Permettre à l'utilisateur de configurer `page` et `itemsPerPage` (10, 20, 30) dans les réglages `NodeListApi` et `NodeNavApi`
- Découper la collection chargée côté frontend avant le rendu
- Rétrocompatibilité : nœuds existants sans ces champs affichent toute la collection

**Non-Goals:**

- Modifier `ApiListArticle`, `BuilderApiListArticleItemsPageProvider` ou les endpoints distants
- Pagination interactive côté visiteur (pas de boutons « page suivante » dans le rendu public)
- Re-fetch backend lors du changement de page
- Supporter `itemsPerPage` arbitraire (seulement 10, 20, 30)

## Decisions

### 1. Paramètres stockés dans `content` du nœud

- `content.page` : `number`, défaut `1` (utilisé seulement si `itemsPerPage` est défini)
- `content.itemsPerPage` : `10 | 20 | 30 | undefined` — si absent, afficher toute la collection (rétrocompatibilité)

### 2. Découpage côté frontend

Utilitaire partagé (ex. dans `listApiUtils.ts`) :

```ts
function paginateItems<T>(items: T[], page: number, itemsPerPage?: number): T[] {
  if (itemsPerPage == null) return items;
  const safePage = Math.max(1, page);
  const safeSize = [10, 20, 30].includes(itemsPerPage) ? itemsPerPage : 10;
  const start = (safePage - 1) * safeSize;
  return items.slice(start, start + safeSize);
}
```

Le fetch reste inchangé : une seule requête par `apiId`, cache inchangé (clé = `apiId`).

### 3. Rendu

`View.tsx` charge la collection complète, puis applique `paginateItems()` avec `content.page` et `content.itemsPerPage` avant le rendu.

Si la page demandée dépasse la collection, le rendu affiche une liste vide — pas d'erreur.

### 4. UI réglages

Dans l'onglet « Général » de `NodeListApi/Settings.tsx` et `NodeNavApi/Settings.tsx` :
- Input numérique pour **Page** (min 1)
- Select pour **Éléments par page** : 10, 20, 30 (option « Tous » ou valeur vide pour désactiver la limite)

Placé sous le sélecteur d'API, avant les toggles `show`.

## Risks / Trade-offs

- **[Trade-off] Collection incomplète côté backend** → Le découpage s'applique sur ce que le backend fournit déjà ; si l'ApiListArticle ne renvoie que 10 items, l'utilisateur ne pourra pas afficher la page 2 au-delà de ces 10 items.
- **[Risque] Pages existantes** → Sans `itemsPerPage` persisté, comportement inchangé (tous les items affichés).
- **[Trade-off] Pas de contrôle visiteur** → Fenêtre d'affichage fixe choisie à l'édition.

## Migration Plan

1. Déployer frontend uniquement
2. Nœuds existants : aucun changement visible (`itemsPerPage` absent = tout afficher)
3. Rollback : retirer les réglages et le découpage frontend

## Open Questions

- Faut-il une option explicite « Tous » dans le select itemsPerPage, ou seulement 10/20/30 avec absence = tous ? → Recommandation : absence = tous (rétrocompat), select avec option « Tous » pour réinitialiser.
