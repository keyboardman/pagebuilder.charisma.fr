## 1. Rendu canevas unifié

- [x] 1.1 Dans `NodeComponent.tsx`, rendre le composant `view` en mode édition (conserver `NodeBuilderComponent` pour le chrome).
- [x] 1.2 Dans `NodeChild.tsx`, rendre le composant `view` en mode édition (conserver `NodeChildBuilder` pour dropzones et drag).
- [x] 1.3 Vérifier que les `View.tsx` conteneurs (`NodeFlex`, `NodeNav`, `NodeGrid`, etc.) gèrent correctement les dropzones en mode édition sans diverger du rendu preview.

## 2. Chrome d’édition

- [x] 2.1 Afficher `NodeMenu` uniquement lorsque le nœud est sélectionné.
- [x] 2.2 Conserver la sélection au clic sur le wrapper du conteneur.
- [x] 2.3 Ajouter la bordure de survol sur le conteneur en mode édition.

## 3. Édition de contenu hors canevas

- [x] 3.1 Ajouter l’édition du contenu HTML dans `NodeText/Settings.tsx`.
- [x] 3.2 Ajouter l’édition du libellé dans `NodeButton/Settings.tsx` (avec support du gras partiel si prévu).
- [x] 3.3 Aligner `NodeTextIcon/Settings.tsx` sur le même modèle que `NodeText`.
- [x] 3.4 Retirer ou déprécier les composants `Edit.tsx` non utilisés sur le canevas.

## 4. Ajustements par type de nœud

- [x] 4.1 `NodeGrid` : supprimer la grille tronquée et les bordures de cellules d’édition.
- [x] 4.2 `NodeFlex` : appliquer `flex-wrap` persisté en édition (supprimer le forçage `wrap` si WYSIWYG).

## 5. Validation

- [x] 5.1 Manuel : bascule édition ↔ prévisualisation sans saut de disposition sur une page variée (texte, bouton, flex, grille).
- [x] 5.2 Manuel : sélection via Explorer affiche le menu ; désélection le masque.
- [x] 5.3 Manuel : survol d’un bloc non sélectionné change la bordure du conteneur.
- [x] 5.4 Manuel : édition du texte et du libellé bouton via NodeSettings.
- [x] 5.5 Manuel : drag-and-drop et dropzones toujours fonctionnels en édition.
