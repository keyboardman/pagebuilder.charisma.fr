## Context

`NodeComponent` et `NodeChild` choisissent aujourd’hui le composant à rendre selon le mode :

| Mode | Composant | Chrome |
|------|-----------|--------|
| `edit` | `NodeRegistry[type].edit` | `NodeBuilderComponent` (menu, bordure, dropzones) |
| `preview` | `NodeRegistry[type].view` | aucun |
| `view` | `NodeRegistry[type].view` | aucun (page publique) |

De nombreux nœuds ont des divergences `Edit` / `View` : grilles, flex-wrap, édition inline, placeholders d’édition. Le navigateur de composants couvre la sélection ; le panneau **NodeSettings** couvre la configuration de contenu.

## Goals / Non-Goals

- Goals :
  - Canevas WYSIWYG : rendu identique entre édition et prévisualisation pour **tous** les types de nœuds.
  - Chrome d’édition minimal : menu à la sélection, bordure au survol, dropzones et DnD.
  - Sélection via Explorer ou clic sur le conteneur.
- Non-Goals :
  - Supprimer le toggle Édition / Prévisualisation.
  - Modifier le rendu public (`view`).
  - Refondre l’Explorer ou NodeSettings au-delà des champs de contenu nécessaires.

## Decisions

- **Décision** : `NodeComponent` et `NodeChild` SHALL rendre `NodeRegistry[type].view` en modes `edit` et `preview` ; seul le chrome d’édition (`NodeBuilderComponent`, dropzones) distingue l’édition.
- **Décision** : Les composants `View` qui contiennent déjà une logique `mode === APP_MODE.EDIT` (dropzones flex, etc.) conservent cette logique pour le DnD sans changer le rendu visuel des enfants.
- **Décision** : `NodeMenu` n’est rendu que si `isSelected()` ; le clic sur le wrapper du conteneur appelle `onSelect()`.
- **Décision** : Bordure du wrapper : discrète par défaut, couleur accentuée au survol, distincte à la sélection si utile.
- **Décision** : Contenu texte (`NodeText`, `NodeTextIcon`, libellé `NodeButton`) édité dans **NodeSettings** ; `NodeRichText` conserve sa modale à la sélection.
- **Décision** : `NodeFlex` applique `flex-wrap` selon la valeur persistée **y compris en édition** (WYSIWYG) ; les dropzones en édition restent fonctionnelles via la logique existante dans `View.tsx` (zones de dépôt superposées ou compactes selon justify).

## Risks / Trade-offs

- **Perte d’édition inline** : moins directe pour le texte → compensée par NodeSettings et modale RichText.
- **Dropzones avec `nowrap`** : enfants moins accessibles au DnD si tout tient sur une ligne → atténué par l’Explorer et dropzones compactes entre enfants.
- **Composants `Edit.tsx`** : code mort potentiel → nettoyage progressif après migration.

## Migration Plan

Changement front-end uniquement. Les pages existantes conservent leur contenu ; seul le flux d’édition change (plus d’inline sur le canevas).

## Open Questions

- Faut-il un éditeur riche minimal dans NodeSettings pour le gras partiel du `NodeButton`, ou un champ texte simple suffit-il dans un premier temps ?
