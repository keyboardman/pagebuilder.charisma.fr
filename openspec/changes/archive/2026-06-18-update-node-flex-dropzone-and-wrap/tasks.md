## 1. NodeFlex — dropzones horizontales

- [x] 1.1 Dans `NodeFlex/View.tsx`, détecter la direction horizontale (`row`, `row-reverse`) et le mode édition (`APP_MODE.EDIT`)
- [x] 1.2 Passer `trailingDropzoneFill` à `NodeCollection` lorsque direction horizontale + mode édition
- [x] 1.3 Étendre `.ce-flex-inner` sur toute la largeur en horizontal + édition (style inline ou `node-flex.css`)

## 2. NodeFlex — wrap réservé à preview/view

- [x] 2.1 Dans `NodeFlex/View.tsx`, appliquer `flexWrap: options.wrap` uniquement si `mode` est `preview` ou `view`
- [x] 2.2 En mode `edit`, forcer `flexWrap: "wrap"` indépendamment de l’option `nowrap` enregistrée

## 3. Validation manuelle

- [x] 3.1 NodeFlex horizontal vide : dropzone occupe toute la largeur, zone clairement visible
- [x] 3.2 NodeFlex horizontal avec 1+ enfants : dropzone finale occupe l’espace restant à droite (ou à gauche en `row-reverse`)
- [x] 3.3 NodeFlex vertical (`column`, `column-reverse`) : dropzone sans expansion pleine largeur (comportement actuel)
- [x] 3.4 Drag-and-drop sur la zone étendue et entre deux enfants fonctionne toujours
- [x] 3.5 Option Wrap = No wrap : en édition les enfants passent à la ligne ; en preview/view le nowrap s’applique
- [x] 3.6 Sauvegarde : l’option `wrap: nowrap` est conservée dans le JSON
