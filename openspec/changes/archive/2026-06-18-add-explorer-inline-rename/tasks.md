## 1. Édition inline dans l’explorateur

- [x] 1.1 Ajouter un état d’édition par nœud dans `ExplorerRow` (ou composant dédié) : double-clic sur le libellé active un champ texte inline, prérempli avec le nom affiché courant (`getNodeDisplayLabel`).
- [x] 1.2 Brancher la validation sur **Entrée** et **blur** : appeler `updateNode` avec `editorLabel` trimé ou `undefined` si vide (même logique que `NodeEditorLabelField`).
- [x] 1.3 Brancher **Échap** pour annuler sans persister ; empêcher la propagation du double-clic vers la sélection / dépli.
- [x] 1.4 Conserver le clic simple pour la sélection ; ne pas ouvrir l’édition au simple clic.

## 2. Affichage et synchronisation

- [x] 2.1 Afficher le placeholder du type (`getNodeTypeLabel`) dans le champ inline lorsque le nom personnalisé est vide.
- [x] 2.2 Vérifier que la modification depuis l’explorateur se reflète dans **NodeSettings** (« Nom dans l’éditeur ») et inversement.
- [x] 2.3 Vérifier l’affichage du type entre parenthèses lorsqu’un `editorLabel` personnalisé est défini.

## 3. Validation

- [x] 3.1 Page avec plusieurs blocs du même type : double-clic → renommage → nom visible dans l’arbre et dans NodeSettings après sélection.
- [x] 3.2 Renommage puis sauvegarde JSON : `editorLabel` persisté et restauré à la réouverture.
- [x] 3.3 Effacement du nom (valeur vide) : retour au libellé par défaut sans régression sur la sélection ni le DnD de l’explorateur.
