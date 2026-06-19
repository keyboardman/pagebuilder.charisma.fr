## 1. Édition inline à la sélection

- [x] 1.1 `NodeText/View.tsx` : activer `InputEditor` lorsque le nœud est sélectionné en mode édition ; aperçu HTML sinon.
- [x] 1.2 `NodeButton/View.tsx` : activer `TagNameEditable` à la sélection (gras partiel inclus) ; aperçu sanitizé sinon.
- [x] 1.3 `NodeTextIcon/View.tsx` : activer `InputEditor` sur le texte à la sélection ; conserver l'icône et la disposition identiques au rendu final.
- [x] 1.4 `NodeNavItem/View.tsx` : activer `TagNameEditable` sur le libellé à la sélection.

## 2. Interactions

- [x] 2.1 Empêcher la désélection ou la navigation lors d'un clic/focus dans la zone éditable (propagation stoppée).
- [x] 2.2 Persister le contenu au blur ; vérifier que NodeSettings reste synchronisé après édition inline.

## 3. Validation

- [x] 3.1 Mode édition : sélectionner un `NodeText`, modifier le texte inline, basculer en prévisualisation → contenu et styles identiques.
- [x] 3.2 Mode édition : nœud non sélectionné → aperçu WYSIWYG sans zone éditable.
- [x] 3.3 `NodeButton` : gras partiel éditable inline à la sélection ; persistance après sauvegarde.
- [x] 3.4 `NodeRichText` : modale inchangée, pas d'édition inline sur le canevas.
