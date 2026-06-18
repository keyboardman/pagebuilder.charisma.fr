# Change: Dropzones NodeFlex et wrap réservé à la prévisualisation

## Why

En mode **édition**, un **NodeFlex** en direction horizontale (`row`, `row-reverse`) souffre du même problème que le **NodeNav** avant correction : la dropzone finale est quasi invisible et l’utilisateur doit chercher où déposer un bloc. Par ailleurs, l’option **Wrap = No wrap** (`flex-wrap: nowrap`) en mode édition empêche les enfants de passer à la ligne, ce qui masque la zone de dépôt et complique le drag-and-drop ; le `nowrap` ne doit s’appliquer qu’en **prévisualisation** et en **vue** (rendu final), pas pendant l’édition.

## What Changes

- En mode **édition**, direction **horizontale** (`row`, `row-reverse`) et **justify-content** `flex-start` : le conteneur `.ce-flex-inner` occupe toute la largeur ; la dropzone `main` (vide ou finale) s’étend (`flex: 1`, `min-height: 2.5rem`), sur le même modèle que **NodeNav** horizontal. Avec `center`, `flex-end` ou `space-*`, la dropzone finale reste compacte pour préserver l’alignement et la sélection des enfants.
- Les dropzones **intermédiaires** (entre enfants, pour le réordonnancement) conservent leur taille compacte actuelle.
- Lorsque l’option **wrap** est `nowrap`, le style `flex-wrap: nowrap` SHALL être appliqué **uniquement** en modes **preview** et **view** ; en mode **edit**, le conteneur SHALL utiliser `flex-wrap: wrap` pour garder la dropzone accessible.
- Aucun changement de persistance JSON : l’option `wrap` reste enregistrée telle quelle ; seul le rendu en mode édition diffère.

## Impact

- Affected specs: `page-builder`
- Affected code:
  - `assets/editeur/ManagerNode/NodeFlex/View.tsx` (activation `trailingDropzoneFill`, largeur du conteneur, logique wrap selon le mode)
  - `assets/editeur/assets/themes/base/css/node-flex.css` (largeur pleine du conteneur inner en horizontal si nécessaire)
  - Réutilisation des props existantes `trailingDropzoneFill` / `fillRemaining` dans `NodeCollection.tsx` et `DropZone.tsx` (déjà en place pour NodeNav)
