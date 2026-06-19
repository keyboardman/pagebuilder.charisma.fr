# Change: Édition inline du texte à la sélection en mode édition

## Why

Le canevas WYSIWYG en mode **édition** affiche désormais le même rendu qu'en **prévisualisation**, ce qui supprime le saut visuel entre les deux modes. En contrepartie, l'édition du contenu texte a été restreinte au panneau **NodeSettings** (ou aux modales existantes), ce qui ralentit les retouches courantes et éloigne l'expérience de l'édition directe « sur le nœud » disponible auparavant.

L'utilisateur souhaite conserver le rendu WYSIWYG tout en pouvant **modifier le texte directement dans le nœud lorsqu'il est sélectionné**, comme avant.

## What Changes

- En mode **édition**, les nœuds à contenu texte court (`NodeText`, `NodeButton`, `NodeTextIcon`, `NodeNavItem`) SHALL activer une **édition inline** sur le canevas **uniquement lorsque le nœud est sélectionné**.
- Hors sélection, le canevas SHALL conserver l'aperçu WYSIWYG (identique à la prévisualisation).
- Le panneau **NodeSettings** reste disponible comme canal d'édition complémentaire ; `NodeRichText` conserve l'édition via modale.
- L'édition inline SHALL réutiliser les composants existants (`InputEditor`, `TagNameEditable`) et SHALL persister le contenu au **blur** ou à la validation, sans modifier la disposition ni les styles du rendu final.

## Impact

- Affected specs: `page-builder`
- Affected code:
  - `assets/editeur/ManagerNode/NodeText/View.tsx`
  - `assets/editeur/ManagerNode/NodeButton/View.tsx`
  - `assets/editeur/ManagerNode/NodeTextIcon/View.tsx`
  - `assets/editeur/ManagerNode/NodeNavItem/View.tsx`
  - Contexte de sélection (`NodeBuilderContext`, `NodeComponent.tsx`)
