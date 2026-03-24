# Change: Ajouter un nœud HTML dans le builder de page

## Pourquoi
Certains cas d’usage nécessitent d’insérer un fragment de code HTML personnalisé dans une page (embed tiers, snippet de tracking, markup spécifique) sans créer un nouveau type de nœud dédié à chaque fois. Aujourd’hui, le builder ne permet pas d’injecter facilement ce type de contenu ciblé.

## What Changes
- Ajout d’un type de nœud **NodeHtml** (identifiant `node-html`) dans le builder de page.
- Exposition d’une interface d’édition pour le contenu HTML (zone de texte multi‑ligne ou éditeur de code) dans le panneau de propriétés du nœud.
- Intégration du rendu du contenu HTML saisi dans la prévisualisation et dans le rendu final de la page.

## Impact
- Affected specs: `page-builder`
- Affected code: builder React (définition des nœuds, panneau de propriétés, sérialisation/désérialisation du contenu, rendu en preview et rendu final de page).

