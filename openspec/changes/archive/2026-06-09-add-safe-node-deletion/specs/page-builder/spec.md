## ADDED Requirements

### Requirement: Confirmation avant suppression d'un nœud

Lorsqu'un utilisateur déclenche la suppression manuelle d'un nœud éditable (ex. icône poubelle du menu de bloc), le builder SHALL afficher une **modale de confirmation** avant de modifier `NodesType`. La modale SHALL indiquer le libellé ou le type du nœud ciblé. Si le nœud possède un ou plusieurs **descendants**, la modale SHALL le signaler et SHALL préciser qu'ils seront supprimés avec lui. La suppression ne SHALL s'exécuter qu'après confirmation explicite ; l'annulation SHALL laisser `nodes` inchangé.

#### Scenario: Confirmation avec descendants

- **WHEN** l'utilisateur clique sur supprimer pour un conteneur ayant des nœuds enfants
- **THEN** une modale de confirmation s'affiche
- **AND** le message indique que les sous-blocs seront également supprimés
- **AND** la suppression n'est appliquée qu'après validation explicite

#### Scenario: Annulation de la suppression

- **WHEN** l'utilisateur ouvre la modale de confirmation puis annule
- **THEN** le nœud et ses descendants restent présents dans `nodes`
- **AND** la sélection et l'affichage du builder ne changent pas

#### Scenario: Suppression confirmée d'un nœud feuille

- **WHEN** l'utilisateur confirme la suppression d'un nœud sans enfant
- **THEN** le nœud est retiré de `NodesType`
- **AND** les ordres des frères restants dans la même zone parente sont réindexés

### Requirement: Suppression récursive des descendants

Lorsqu'un nœud est supprimé (manuellement après confirmation ou lors de l'épuration automatique), le builder SHALL retirer **récursivement** ce nœud et **tous ses descendants** de `NodesType`. Aucun nœud dont `parent.id` référençait le nœud supprimé (directement ou via une chaîne d'ancêtres supprimés) ne SHALL subsister dans le JSON.

#### Scenario: Suppression d'un conteneur parent

- **WHEN** l'utilisateur confirme la suppression d'un conteneur possédant des enfants imbriqués
- **THEN** le conteneur et l'ensemble de ses descendants sont retirés de `NodesType`
- **AND** aucun nœud orphelin ne reste référencé dans le JSON

#### Scenario: Réindexation après suppression

- **WHEN** un nœud est supprimé parmi plusieurs frères dans la même zone parente
- **THEN** les `parent.order` des frères restants sont réassignés de façon séquentielle sans trou

### Requirement: Nettoyage des nœuds invalides au chargement

Lors du chargement du contenu éditable (parse du JSON vers `NodesType`), le builder SHALL **épurer automatiquement** les entrées invalides avant d'afficher la page :

- les nœuds dont le `type` n'existe pas dans le registre courant `NodeRegistry`, **avec tous leurs descendants** ;
- les nœuds **orphelins** dont `parent.id` ne correspond à aucun nœud existant dans le dictionnaire (sauf le nœud racine `node-root`).

L'épuration SHALL appliquer la même suppression récursive et la même réindexation des ordres que la suppression manuelle. Le nœud racine `node-root` ne SHALL jamais être retiré par cette épuration.

#### Scenario: Type de nœud retiré du registre

- **WHEN** le JSON chargé contient un nœud de type absent de `NodeRegistry` (ex. ancien composant supprimé du code)
- **THEN** ce nœud et tous ses descendants sont retirés de `NodesType` au chargement
- **AND** le builder s'affiche sans erreur avec la structure restante valide

#### Scenario: Nœud orphelin sans parent existant

- **WHEN** le JSON chargé contient un nœud dont `parent.id` ne référence aucun nœud du dictionnaire
- **THEN** ce nœud et ses descendants sont retirés de `NodesType` au chargement

#### Scenario: Sauvegarde après épuration

- **WHEN** l'utilisateur enregistre la page après ouverture d'un contenu nettoyé automatiquement
- **THEN** le JSON persisté ne contient plus les nœuds invalides ni leurs descendants
