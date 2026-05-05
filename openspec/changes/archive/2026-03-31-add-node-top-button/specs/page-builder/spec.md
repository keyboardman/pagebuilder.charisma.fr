## ADDED Requirements
### Requirement: Nœud bouton retour en haut (NodeTopButton)
Le builder SHALL fournir un type de nœud **NodeTopButton** (identifiant `node-top-button`) permettant de remonter la page en haut lors d'un clic utilisateur.

Le nœud SHALL afficher un bouton comportant une icône directionnelle (retour en haut) et SHALL exposer dans ses paramètres de style au minimum:
- la couleur de fond du bouton
- la couleur de l'icône
- la bordure (épaisseur/style/couleur)

Un `NodeTopButton` SHALL pouvoir être ajouté uniquement comme enfant direct de **NodeRoot** et SHALL être refusé sous tout autre parent.

Le comportement de retour en haut SHALL être disponible dans l'éditeur, la preview et le rendu final.

#### Scenario: Ajout du NodeTopButton depuis le panneau
- **WHEN** l'utilisateur ajoute un bloc depuis le panneau des composants et choisit `NodeTopButton`
- **AND** la cible d'insertion est `NodeRoot`
- **THEN** un nœud `node-top-button` est inséré dans la page avec un style par défaut et une icône visible

#### Scenario: Refus d'ajout hors NodeRoot
- **WHEN** l'utilisateur tente d'ajouter ou de déplacer un `NodeTopButton` sous un parent différent de `NodeRoot`
- **THEN** l'opération est refusée et le nœud ne peut pas y rester

#### Scenario: Clic sur le bouton pour remonter la page
- **WHEN** l'utilisateur clique sur le NodeTopButton dans une page avec un scroll vertical
- **THEN** la vue remonte vers le haut de la page

#### Scenario: Stylisation du bouton
- **WHEN** l'utilisateur modifie la couleur de fond, la couleur de l'icône ou la bordure du NodeTopButton dans les settings
- **THEN** le rendu du bouton est mis à jour immédiatement avec ces styles dans l'éditeur et en preview
- **AND** le rendu final de la page applique les mêmes styles

#### Scenario: Persistance du NodeTopButton
- **WHEN** l'utilisateur sauvegarde une page contenant un ou plusieurs NodeTopButton stylisés
- **THEN** les propriétés de style et le comportement du nœud sont conservés et restitués au rechargement
