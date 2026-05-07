# Change: Ajouter le nœud NodeTextIcon dans le page builder

## Why
Le builder dispose déjà d'un nœud texte, mais il manque un composant simple pour associer un texte et une icône avec un placement flexible. Ce besoin revient pour construire rapidement des éléments éditoriaux (labels, callouts, liens iconiques) sans montage manuel de plusieurs nœuds.

## What Changes
- Ajout d'un nouveau nœud `NodeTextIcon`, basé sur le comportement de `NodeText`.
- Ajout des options de positionnement de l'icône avant ou après le texte.
- Ajout d'un lien cliquable appliqué au texte.
- Ajout des réglages d'alignement horizontal et vertical, et de la taille d'icône.

## Impact
- Affected specs: `page-builder`
- Affected code: registre des nœuds builder, panneau de settings du nœud, rendu preview/export, sérialisation du contenu de page
