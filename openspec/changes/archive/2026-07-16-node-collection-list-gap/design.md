## Context

NodeCollection expose déjà un `gap` pour **grid** (échelle Tailwind via `GAP_CLASS` dans `CollectionDisplay.tsx`, contrôle dans `DisplayTab`) et pour **slideshow** (`spaceBetween` Swiper, valeur en px). Le mode **list** s’appuie sur un `gap: 0.75rem` fixe dans `node-collection.css` (`.ce-collection-list`) sans paramètre éditorial.

## Goals / Non-Goals

**Goals:**

- Permettre de régler l’espacement vertical entre items en mode liste depuis l’onglet Affichage.
- Réutiliser le même modèle UX / échelle que `grid.gap` (classes Tailwind `gap-*`, plage 0–10).
- Persister la valeur dans `content.list.gap` avec un défaut rétrocompatible.

**Non-Goals:**

- Unifier grid/list/slideshow sous un seul objet `gap` global.
- Changer le gap slideshow (px / Swiper) ou le gap interne des items (`.ce-collection-item`).
- Gap responsive par breakpoint.

## Decisions

### 1. Clé de contenu `list.gap` (miroir de `grid`)

- **Choix** : `content.list?: { gap?: number }` avec défaut `3` (équivalent ~`0.75rem` / Tailwind `gap-3`).
- **Pourquoi** : cohérent avec `content.grid.gap` ; n’encombre pas le contenu racine ; clair quand `display !== list`.
- **Alternatives** : `content.gap` partagé (risque de confusion entre modes) ; CSS custom property seule (moins visible dans les settings).

### 2. Application via classes Tailwind, comme la grille

- **Choix** : réutiliser / partager `GAP_CLASS` dans `CollectionDisplayList` ; retirer le `gap` fixe de `.ce-collection-list` pour éviter le conflit CSS.
- **Pourquoi** : même rendu et mêmes valeurs que la grille ; un seul mapping à maintenir.
- **Alternatives** : `style={{ gap }}` en rem (divergence d’échelle) ; garder le CSS et surcharger en inline (spécificité fragile).

### 3. Contrôle UI aligné sur la grille

- **Choix** : bloc Gap dans `DisplayTab` lorsque `display === "list"`, même `parseClampedInt(value, 0, 10)`.
- **Pourquoi** : parité éditoriale grille / liste.

### 4. Markup list-api

- **Choix** : appliquer la même classe `gap-*` sur `<ul class="ce-list-api-items ce-collection-list">` et sur le `<div class="ce-collection-list">`.
- **Pourquoi** : les deux chemins de rendu liste doivent respecter le paramètre.

## Risks / Trade-offs

- **[Conflit CSS]** `.ce-collection-list { gap: 0.75rem }` écrase ou concurrence Tailwind → **Mitigation** : retirer `gap` du CSS thème (garder `display: flex; flex-direction: column`).
- **[Nœuds existants]** sans `list.gap` → **Mitigation** : défaut runtime `?? 3` pour conserver l’apparence actuelle.
- **[Échelle 0]** `gap-0` / absence de clé dans `GAP_CLASS` → **Mitigation** : gérer `0` explicitement (classe `gap-0` ou style inline), comme pour la grille si manquant.

## Migration Plan

1. Étendre le type + default content.
2. Brancher le rendu liste + settings.
3. Ajuster le CSS thème.
4. Mettre à jour les tests display liste.
5. Rollback : retirer `list` / contrôle ; restaurer le gap CSS fixe.

## Open Questions

- Aucune bloquante : défaut `3` aligné sur le CSS actuel.
