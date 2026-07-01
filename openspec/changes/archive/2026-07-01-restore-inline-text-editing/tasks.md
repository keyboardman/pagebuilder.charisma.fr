## 1. NodeHeader — édition inline et rendu HTML

- [x] 1.1 `NodeHeader/View.tsx` : ajouter la bascule `isInlineEditing` (mode édition + `builder.isSelected()`) comme `NodeText/View.tsx`.
- [x] 1.2 Monter `InputEditor` à la sélection avec `tagName` = `content.tag`, `value` = `content.html`, classes `ce-header` / `ce-header-h*`, persistance au blur via `builder.onChange`.
- [x] 1.3 Hors sélection : rendre `content.html` via `dangerouslySetInnerHTML` (aligné sur `NodeText`), et non en texte brut.

## 2. InputEditor — retours à la ligne

- [x] 2.1 Vérifier que la touche **Entrée** n'est pas bloquée dans `InputEditor` (comportement contentEditable natif).
- [x] 2.2 Si nécessaire, normaliser légèrement le HTML au blur (ex. `<div><br></div>` → `<br>`) pour un rendu cohérent à l'export.
- [x] 2.3 Conserver le collage en texte brut et `stopPropagation` sur mousedown/click.

## 3. NodeText — vérification et alignement

- [x] 3.1 Vérifier que l'édition inline de `NodeText/View.tsx` s'active bien à la sélection (contexte builder, focus au clic).
- [x] 3.2 Corriger tout bug empêchant la saisie ou la persistance si constaté lors des tests.
- [x] 3.3 Confirmer la synchronisation bidirectionnelle avec le panneau NodeSettings après édition inline.

## 4. Validation manuelle

- [x] 4.1 Sélectionner un `NodeHeader`, modifier le titre inline, blur → contenu persisté et visible hors sélection.
- [x] 4.2 `NodeText` et `NodeHeader` : insérer un retour à la ligne (Entrée), sauvegarder → rendu identique en prévisualisation.
- [x] 4.3 Vérifier qu'un clic dans la zone éditable ne désélectionne pas le nœud.
- [x] 4.4 `NodeNavItem` inchangé (libellé une ligne) ; `NodeRichText` inchangé (modale uniquement).
