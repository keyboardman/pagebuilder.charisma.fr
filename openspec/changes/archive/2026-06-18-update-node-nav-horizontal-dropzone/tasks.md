## 1. Composant DropZone

- [x] 1.1 Ajouter une prop optionnelle (ex. `fillRemaining`) sur `DropZone` pour appliquer `flex: 1` et une taille minimale (`min-h-[2.5rem]`)
- [x] 1.2 Conserver le style compact actuel lorsque `fillRemaining` est absent ou `false`
- [x] 1.3 Vérifier que le survol / état `isDropTarget` reste visible sur la zone étendue

## 2. NodeCollection et NodeNav

- [x] 2.1 Étendre `NodeCollection` avec une prop (ex. `trailingDropzoneFill`) transmise à la dropzone finale
- [x] 2.2 Dans `NodeNav/View.tsx`, passer `trailingDropzoneFill={!isVertical}` lorsque le menu n’est pas en layout burger
- [x] 2.3 Faire occuper à `.ce-menu-content` toute la largeur du `<nav>` en direction horizontale (style inline ou CSS, ex. `width: 100%`)
- [x] 2.4 S’assurer que la dropzone unique (menu vide) bénéficie aussi de `fillRemaining` en horizontal, et pas seulement du style `isEmptyZone` insuffisant sans parent pleine largeur

## 3. Validation manuelle

- [x] 3.1 NodeNav horizontal vide : la dropzone occupe toute la largeur du nav, zone clairement visible
- [x] 3.2 NodeNav horizontal avec 1+ items : la dropzone finale occupe l’espace restant à droite des items
- [x] 3.3 NodeNav vertical : dropzone sans expansion pleine largeur (comportement actuel)
- [x] 3.4 Drag-and-drop d’un NodeNavItem sur la zone étendue et entre deux items (dropzones intermédiaires) fonctionne toujours
- [x] 3.5 Prévisualisation / export : aucune dropzone visible, rendu du menu inchangé
