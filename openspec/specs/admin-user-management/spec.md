# admin-user-management Specification

## Purpose
TBD - created by archiving change add-user-account-deletion. Update Purpose after archive.
## Requirements
### Requirement: Suppression d'un compte utilisateur depuis l'administration
Le systeme SHALL permettre a un administrateur de supprimer un compte utilisateur depuis la liste des comptes dans l'interface d'administration.

#### Scenario: Suppression reussie d'un compte
- **WHEN** un administrateur declenche la suppression d'un compte existant depuis `/admin/comptes` avec un jeton CSRF valide
- **THEN** le compte cible est supprime de la base de donnees
- **AND** un message de confirmation est affiche a l'administrateur
- **AND** la liste des comptes n'affiche plus le compte supprime

#### Scenario: Rejet de suppression avec jeton CSRF invalide
- **WHEN** un administrateur soumet une demande de suppression avec un jeton CSRF invalide ou absent
- **THEN** la suppression est refusee
- **AND** le compte n'est pas supprime
- **AND** un message d'erreur explicite est affiche

### Requirement: Protection contre la suppression de son propre compte
Le systeme SHALL empecher un administrateur authentifie de supprimer le compte actuellement utilise pour la session en cours.

#### Scenario: Tentative de suppression de son propre compte
- **WHEN** un administrateur tente de supprimer son propre compte
- **THEN** la suppression est refusee
- **AND** le compte reste actif en base
- **AND** un message d'erreur explicite informe que l'operation n'est pas autorisee

