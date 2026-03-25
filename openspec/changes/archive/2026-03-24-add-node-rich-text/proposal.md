# Change: Ajouter un nœud de texte riche (NodeRichText)

## Why
L’éditeur a aujourd’hui un nœud texte simple et un nœud HTML brut, mais il manque un nœud de texte riche accessible pour les usages éditoriaux courants (gras, italique, listes, liens) sans écrire de HTML.

## What Changes
- Ajout d’un nouveau nœud `NodeRichText` (identifiant `node-rich-text`) dans le builder.
- Ajout d’un éditeur WYSIWYG avec actions de mise en forme de base: gras, italique, souligné, barré, listes à puces, listes numérotées, lien.
- Ajout de la persistance et du rechargement du contenu riche dans le format de contenu existant du builder.
- Ajout d’un rendu preview/final fidèle au contenu édité.

## Impact
- Affected specs: `page-builder`
- Affected code: `assets/editeur/ManagerNode/NodeRichText/*` (nouveaux fichiers), `assets/editeur/ManagerNode/components/NodeRegistry.ts`, éventuelle adaptation de sérialisation/rendu du builder
