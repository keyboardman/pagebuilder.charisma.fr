## 1. Modèle de données

- [x] 1.1 Ajouter `CollectionListOptions` (`gap?: number`) et `list?: CollectionListOptions` dans `content` (`index.ts`)
- [x] 1.2 Définir `list: { gap: 3 }` dans le contenu par défaut du nœud

## 2. Rendu liste

- [x] 2.1 Appliquer `GAP_CLASS[list.gap ?? 3]` (gérer `0`) sur le conteneur dans `CollectionDisplayList` (div et ul list-api)
- [x] 2.2 Retirer le `gap` fixe de `.ce-collection-list` dans `node-collection.css` pour laisser le paramètre primer

## 3. Settings Affichage

- [x] 3.1 Afficher un contrôle Gap lorsque `display === "list"` dans `DisplayTab.tsx` (même clamp 0–10 que la grille, maj de `content.list.gap`)

## 4. Tests

- [x] 4.1 Étendre les tests de `CollectionDisplayList` pour vérifier la classe gap par défaut et avec `list.gap` explicite
