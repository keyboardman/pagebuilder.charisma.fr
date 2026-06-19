# Change : désactiver la navigation des liens en mode édition

## Why

Depuis le canevas WYSIWYG, les composants `view` affichent des liens cliquables (menus, cartes, diaporama, texte riche, etc.) comme en prévisualisation. En mode **édition**, un clic sur ces liens **quitte le builder** ou **intercepte la sélection** du nœud au lieu de le sélectionner.

Cas notable : **`NodeYoutube`** — l’iframe du lecteur YouTube capture les clics et empêche la sélection du bloc via le canevas.

La navigation et les interactions « visiteur » doivent rester réservées au mode **prévisualisation** (et au rendu public).

## What Changes

- En mode **édition**, tous les liens cliquables **dans le canevas** (`admin-layout__main`) SHALL être **non navigants** : aucune ouverture d’URL, aucune sortie du builder ; le clic contribue à la **sélection** du nœud (via le conteneur de bloc ou l’Explorer).
- En mode **prévisualisation** et en **view**, le comportement des liens reste **inchangé**.
- Les **lecteurs embarqués** (iframe YouTube, etc.) SHALL être neutralisés en édition pour ne pas bloquer la sélection du nœud.
- Le périmètre exclut le chrome du builder (header, sidebars, menus hors canevas).

## Impact

- Affected specs: `page-builder`
- Affected code:
  - `assets/editeur/assets/css/builder.css` (règles ciblées `[data-mode=edit]` sur le canevas)
  - `assets/editeur/ManagerNode/NodeYoutube/View.tsx` et/ou `assets/editeur/assets/themes/base/css/node-youtube.css`
  - Audit des `View.tsx` avec liens (`NodeNavItem`, `NodeNav`, `NodeNavApi`, `NodeCard`, `NodeSlideshow`, `NodeTextIcon`, `NodeIcone`, `NodeButton`, `NodeRichText`)
  - `assets/editeur/app/builder/Builder.tsx` (classe ou attribut de mode déjà présent via `data-mode`)
