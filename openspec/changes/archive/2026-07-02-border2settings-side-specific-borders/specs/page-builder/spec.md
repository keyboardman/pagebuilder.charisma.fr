## ADDED Requirements

### Requirement: Mode unifie ou par cote pour border dans Border2Settings
Le panneau partage `Border2Settings` du builder SHALL proposer deux modes de saisie de la bordure:

1. **Mode unifie**: un champ global applique la meme bordure sur tous les cotes.
2. **Mode par cote**: des champs dedies permettent de configurer `borderTop`, `borderRight`, `borderBottom` et `borderLeft` independamment.

L'utilisateur SHALL pouvoir basculer entre ces modes via un controle visible dans la section `Border`.

En **mode unifie**, la saisie SHALL persister la propriete shorthand `border` et SHALL effacer les proprietes longhand par cote pour eviter les conflits.

En **mode par cote**, la saisie SHALL persister les proprietes longhand et SHALL effacer la shorthand `border`.

A l'ouverture du panneau, le mode affiche SHALL etre detecte automatiquement:
- **Mode unifie** si seule `border` est definie, ou si les quatre cotes longhand ont la meme valeur non vide.
- **Mode par cote** si au moins deux cotes portent des valeurs differentes, ou si une configuration asymetrique existe.

#### Scenario: Saisie d'une bordure basse uniquement
- **WHEN** l'utilisateur ouvre `Border2Settings` pour un noeud en mode par cote
- **AND** saisit une valeur sur `bottom` uniquement
- **THEN** le style du noeud contient `borderBottom` avec cette valeur
- **AND** `border`, `borderTop`, `borderRight` et `borderLeft` ne sont pas definies

#### Scenario: Saisie d'une bordure globale
- **WHEN** l'utilisateur bascule en mode unifie et saisit `1px solid #000`
- **THEN** le style du noeud contient `border: 1px solid #000`
- **AND** les proprietes `borderTop`, `borderRight`, `borderBottom`, `borderLeft` ne sont pas definies

#### Scenario: Detection automatique du mode par cote
- **WHEN** le noeud a `borderTop: 1px solid #000` et `borderBottom: 2px solid #000` sans shorthand
- **THEN** `Border2Settings` s'ouvre en mode par cote
- **AND** les champs `top` et `bottom` affichent les valeurs correspondantes
