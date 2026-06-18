# Change: Dropzone extensible en NodeNav horizontal

## Why

Lorsqu’un **NodeNav** est en direction **horizontale**, la zone de dépôt (`main`) est difficile à repérer en mode édition — **qu’il y ait déjà des NodeNavItem ou aucun**. Avec des items, la dropzone finale est réduite à une fine bande quasi invisible (`p-1`, sans bordure). Sans item, bien que `DropZone` applique `flex-1` en mode vide, le conteneur `.ce-menu-content` ne s’étend pas sur toute la largeur du `<nav>` : la zone reste minuscule et l’utilisateur doit chercher où déposer.

## What Changes

- En mode **édition** et direction **horizontale**, le conteneur flex `.ce-menu-content` SHALL occuper **toute la largeur** du `<nav>` pour que la dropzone puisse s’étendre.
- La zone de dépôt du conteneur `main` — **seule** (menu vide) ou **finale** (après les items) — SHALL occuper l’espace horizontal restant (`flex: 1`), avec une taille minimale au moins équivalente à l’existant (`min-height: 2.5rem`).
- Les dropzones **intermédiaires** (entre items, pour le réordonnancement) conservent leur taille compacte actuelle.
- Le comportement en direction **verticale** et le rendu en mode **prévisualisation / export** (sans dropzones) restent inchangés.
- Aucun changement de persistance JSON : ajustement d’affichage en mode édition uniquement.

## Impact

- Affected specs: `page-builder`
- Affected code:
  - `assets/editeur/ManagerNode/components/DropZone.tsx` (prop optionnelle pour expansion)
  - `assets/editeur/ManagerNode/components/NodeCollection.tsx` (transmission de la prop sur la dropzone finale)
  - `assets/editeur/ManagerNode/NodeNav/View.tsx` (activation en direction horizontale + largeur du conteneur)
  - `assets/editeur/assets/themes/base/css/node-nav.css` (`.ce-menu-content` pleine largeur en horizontal si nécessaire)
