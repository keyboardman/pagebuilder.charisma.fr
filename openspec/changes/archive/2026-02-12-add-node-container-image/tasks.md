## 1. Implémentation

- [x] 1.1 Créer le nœud NodeContainerImage : `assets/editeur2/ManagerNode/NodeContainerImage/index.ts` (type `node-container-image`, `isDroppable: true`, `attributes.options` : `src`, `ratio`, `alignHorizontal`, `alignVertical`)
- [x] 1.2 Créer `NodeContainerImage/View.tsx` : conteneur avec `width: 100%`, `aspect-ratio` depuis options ; image en arrière-plan (background-image, background-size: cover, position center) ; zone interne (NodeCollection) avec styles d’alignement (justify-content / align-items dérivés de alignHorizontal et alignVertical) et dropzone
- [x] 1.3 Créer `NodeContainerImage/Settings.tsx` : champs source image (src), ratio (ex. liste ou champ texte pour 16/9, 4/3, 1), alignement horizontal (start, center, end), alignement vertical (top, middle, bottom) ; réutiliser Base2Settings pour id/className si cohérent avec les autres nœuds
- [x] 1.4 Enregistrer NodeContainerImage dans `NodeRegistry.ts` et s’assurer qu’il apparaît dans le panneau des composants (catégorie `container`)
- [x] 1.5 Vérifier que la sérialisation HTML du builder inclut la structure et les styles (image de fond, ratio, alignement) pour preview / export

## 2. Validation

- [x] 2.1 Test manuel : ajouter un NodeContainerImage, définir une image et un ratio ; modifier alignements horizontal et vertical ; déposer des blocs dans la zone ; sauvegarder et vérifier le rendu en prévisualisation
- [x] 2.2 Vérifier qu’aucun test existant ne casse (builder, nœuds)
