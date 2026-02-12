# Change: Ajouter le conteneur image (NodeContainerImage)

## Why

Le builder dispose de conteneurs (NodeContainer, NodeFlex, NodeGrid) et d’un nœud image (NodeImage), mais il manque un conteneur dont la taille est pilotée par une image en arrière-plan et qui permet de déposer du contenu par-dessus, avec alignement horizontal et vertical configurable. Un **NodeContainerImage** permet de créer des blocs type « bannière » ou « hero » : image pleine largeur avec ratio défini, et zone de dépôt positionnée selon l’alignement choisi.

## What Changes

- Ajout d’un type de nœud **NodeContainerImage** (identifiant `node-container-image`) dans le builder :
  - Conteneur droppable (zone unique, ex. `main`) avec une image en arrière-plan couvrant tout le conteneur.
  - Propriétés configurables : **source de l’image** (src), **ratio** (aspect-ratio, ex. 16/9, 4/3, 1), **alignement horizontal** (start, center, end), **alignement vertical** (top, middle, bottom).
  - Dimensions du conteneur : largeur 100 % et hauteur définie par **aspect-ratio** (l’image définit la taille du conteneur).
  - La dropzone (contenu déposé) est positionnée à l’intérieur en fonction des propriétés d’alignement horizontal et vertical.
- Enregistrement de NodeContainerImage dans le registre des nœuds et dans le panneau des composants (catégorie container).
- Rendu : image en background (cover), conteneur avec `width: 100%` et `aspect-ratio` ; zone enfant avec flex (ou équivalent) pour appliquer alignement horizontal et vertical.

## Impact

- **Specs impactées** : `page-builder`
- **Code impacté** : `assets/editeur2/ManagerNode/` (nouveau dossier NodeContainerImage, `NodeRegistry.ts`), sérialisation HTML du builder si elle dépend des types de nœuds
