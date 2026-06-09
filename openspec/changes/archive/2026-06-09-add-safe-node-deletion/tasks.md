## 1. Utilitaires nœuds

- [x] 1.1 Extraire ou factoriser la logique récursive de suppression (descendants) partagée entre `removeNode` et l'épuration.
- [x] 1.2 Ajouter `countDescendants(nodes, nodeId)` pour la modale de confirmation.
- [x] 1.3 Ajouter `sanitizeNodes(nodes)` : retirer types inconnus (`!(type in NodeRegistry)`) et orphelins (`parent.id` absent), avec descendants et réindexation des ordres.

## 2. Épuration au chargement

- [x] 2.1 Appeler `sanitizeNodes` dans `AppProvider.parseJsonToNodes` après le parse JSON.
- [x] 2.2 Vérifier qu'une page contenant un type retiré du registre se charge sans erreur et que le JSON sauvegardé n'inclut plus ces entrées.

## 3. Confirmation de suppression

- [x] 3.1 Intercepter `onDelete` (via `NodeBuilderProvider` ou composant dédié) : ouvrir une modale `Dialog` avant d'appeler `removeNode`.
- [x] 3.2 Afficher le libellé du nœud, le type, et le nombre de descendants le cas échéant.
- [x] 3.3 Annuler ferme la modale sans modifier `nodes` ; confirmer appelle `removeNode` et désélectionne si le nœud supprimé était actif.

## 4. Validation

- [x] 4.1 Supprimer un conteneur avec enfants : confirmation affichée, tous les descendants retirés du JSON, ordres des frères réindexés.
- [x] 4.2 Annuler la modale : aucun changement dans `nodes`.
- [x] 4.3 Charger une page avec type obsolète + enfants : nœuds épurtés, arbre et canevas cohérents.
- [x] 4.4 Undo/redo : la suppression confirmée reste annulable via l'historique existant.
