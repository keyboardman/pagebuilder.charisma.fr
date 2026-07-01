## Why

L'édition directe du texte sur le canevas est un prérequis UX du builder : elle permet de modifier le contenu sans passer systématiquement par le panneau **NodeSettings**. Ce comportement existait avant la bascule WYSIWYG et reste partiellement implémenté (`NodeText`, `NodeNavItem`), mais **`NodeHeader` n'active pas l'édition inline** et le rendu n'interprète pas le HTML stocké (`content.html`). De plus, l'insertion de **retours à la ligne** n'est pas garantie de façon cohérente entre les nœuds texte courts.

## What Changes

- Activer l'**édition inline à la sélection** pour **`NodeHeader`**, sur le même modèle que `NodeText` et `NodeNavItem` (`InputEditor` / `contentEditable`, mêmes balises, classes et styles que le rendu final).
- Vérifier et corriger l'édition inline de **`NodeText`** si elle est inactive ou incomplète (focus, persistance, synchronisation avec NodeSettings).
- Permettre l'insertion de **retours à la ligne** dans `NodeText` et `NodeHeader` via la touche **Entrée** en mode édition inline ; le contenu SHALL être persisté en HTML (`<br>` ou équivalent) et restitué à l'identique en prévisualisation et à l'export.
- Corriger le rendu hors édition de **`NodeHeader`** pour afficher `content.html` (et non du texte brut), afin que les sauts de ligne soient visibles.
- Conserver le panneau **NodeSettings** comme canal complémentaire ; `NodeRichText` reste édité via modale uniquement.

## Capabilities

### New Capabilities

_Aucune nouvelle capacité — extension du comportement d'édition inline existant du builder._

### Modified Capabilities

- `page-builder` : étendre le requirement « Canevas d'édition WYSIWYG » pour inclure `NodeHeader` dans les nœuds éditables inline à la sélection ; ajouter l'exigence de retours à la ligne pour `NodeText` et `NodeHeader`.

## Impact

- **Frontend** :
  - `assets/editeur/ManagerNode/NodeHeader/View.tsx`
  - `assets/editeur/ManagerNode/NodeText/View.tsx` (vérification / correctifs)
  - `assets/editeur/components/form/InputEditor.tsx` (gestion Entrée / sauts de ligne si nécessaire)
- **Specs** : delta `openspec/changes/restore-inline-text-editing/specs/page-builder/spec.md`
- **Hors scope** : `NodeRichText`, `NodeButton` (gras partiel), API backend, export HTML au-delà de la persistance des `<br>` existants
