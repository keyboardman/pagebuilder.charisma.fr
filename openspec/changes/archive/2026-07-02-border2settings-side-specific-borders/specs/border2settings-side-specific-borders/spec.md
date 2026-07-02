## ADDED Requirements

### Requirement: Mode unifie ou par cote pour Border2Settings
Le composant `Border2Settings` SHALL proposer deux modes de saisie exclusifs:
1. **Mode unifie**: une valeur globale appliquee a la bordure complete.
2. **Mode par cote**: valeurs independantes pour `top`, `right`, `bottom` et `left`.

La bascule entre les deux modes SHALL etre disponible dans l'interface des reglages de bordure et SHALL rester explicite pour l'utilisateur.

#### Scenario: Application d'une bordure uniquement en bas
- **WHEN** l'utilisateur bascule `Border2Settings` en mode par cote
- **AND** renseigne une valeur de bordure sur `bottom` uniquement
- **THEN** le style persiste uniquement la propriete de bordure basse
- **AND** les autres cotes ne recoivent pas de valeur implicite

#### Scenario: Application d'une bordure uniforme
- **WHEN** l'utilisateur utilise le mode unifie et saisit une valeur de bordure globale
- **THEN** la valeur est appliquee uniformement aux quatre cotes
- **AND** la persistence ne conserve pas de valeurs asymetriques par cote

### Requirement: Exclusivite de persistence shorthand et longhands
La persistence SHALL maintenir une source de verite unique pour la bordure:
- en mode unifie, la propriete shorthand globale SHALL etre conservee et les proprietes longhand par cote SHALL etre supprimees;
- en mode par cote, les proprietes longhand SHALL etre conservees et la shorthand globale SHALL etre supprimee.

#### Scenario: Passage du mode unifie au mode par cote
- **WHEN** un noeud possede une valeur globale de bordure
- **AND** l'utilisateur bascule en mode par cote
- **THEN** la valeur globale est repartie sur les quatre cotes
- **AND** la propriete shorthand est retiree lors de la premiere edition par cote

#### Scenario: Passage du mode par cote au mode unifie avec valeurs differentes
- **WHEN** un noeud possede des valeurs de bordure differentes selon les cotes
- **AND** l'utilisateur bascule en mode unifie
- **THEN** le champ unifie reste vide tant qu'aucune nouvelle valeur globale n'est saisie
- **AND** aucune valeur asymetrique n'est silently ecrasee avant action utilisateur
