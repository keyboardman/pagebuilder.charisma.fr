## ADDED Requirements
### Requirement: Gestion des icones disponibles d'un theme
Le systeme SHALL permettre de gerer une collection d'icones disponibles au niveau d'un theme depuis l'interface d'administration du theme.

Chaque icone SHALL exposer les champs suivants:
- `name` (nom fonctionnel de l'icone),
- `className` (classe CSS utilisee pour cibler l'icone),
- `url` (lien vers la ressource SVG utilisee comme masque CSS).

Le systeme SHALL permettre d'ajouter, modifier et supprimer ces icones dans le formulaire de gestion du theme.

#### Scenario: Ajout d'une icone dans le formulaire de theme
- **WHEN** l'utilisateur ajoute une nouvelle icone en renseignant `name`, `className` et `url`
- **THEN** l'icone est ajoutee a la collection d'icones du theme
- **AND** la configuration est persistable avec le reste des parametres du theme

#### Scenario: Modification d'une icone existante
- **WHEN** l'utilisateur modifie le nom, la classe ou le lien d'une icone existante puis sauvegarde
- **THEN** les nouvelles valeurs remplacent les anciennes dans la configuration du theme

#### Scenario: Suppression d'une icone existante
- **WHEN** l'utilisateur supprime une icone depuis la liste des icones du theme puis sauvegarde
- **THEN** l'icone retiree n'apparait plus dans la configuration du theme

### Requirement: Rendu CSS des icones de theme base sur mask
Le systeme SHALL generer un rendu CSS d'icone base sur la technique `mask`/`-webkit-mask` avec `currentColor`.

Pour chaque icone configuree, la regle CSS generee SHALL appliquer au minimum:
- `width: 24px;`
- `height: 24px;`
- `background: currentColor;`
- `mask: url('<url>') no-repeat center;`
- `-webkit-mask: url('<url>') no-repeat center;`

Le selecteur CSS SHALL utiliser la `className` configuree (par exemple `.icon-home`).

#### Scenario: Generation CSS d'une icone configuree
- **WHEN** une icone est configuree avec `className` et `url`
- **THEN** la generation CSS du theme produit une regle ciblee sur cette classe avec `background: currentColor` et `mask`/`-webkit-mask` pointant vers l'URL configuree

#### Scenario: Mise a jour du rendu CSS apres edition d'une icone
- **WHEN** l'utilisateur modifie `className` ou `url` d'une icone puis regenere le CSS du theme
- **THEN** la regle CSS precedemment associee est mise a jour pour refléter la nouvelle classe et/ou le nouveau lien

