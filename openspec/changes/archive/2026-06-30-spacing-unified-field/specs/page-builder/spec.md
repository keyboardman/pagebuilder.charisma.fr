## ADDED Requirements

### Requirement: Mode unifié ou par côté pour margin et padding dans Spacing2Settings

Le panneau partagé `Spacing2Settings` SHALL proposer, pour **margin** et pour **padding** indépendamment, deux modes de saisie :

1. **Mode unifié** : un seul champ texte dont la valeur s'applique aux quatre côtés en une fois.
2. **Mode par côté** : les quatre champs existants (`top`, `right`, `bottom`, `left`).

L'utilisateur SHALL pouvoir basculer entre ces deux modes pour chaque propriété (margin et padding) via un contrôle visible à côté du titre de section (`Margin` / `Padding`).

En **mode unifié**, la saisie SHALL persister la valeur via la propriété CSS shorthand (`margin` ou `padding`) et SHALL effacer les propriétés longhand correspondantes (`marginTop`, `marginRight`, `marginBottom`, `marginLeft` ou `paddingTop`, etc.) pour éviter les conflits.

En **mode par côté**, la saisie SHALL persister via les propriétés longhand et SHALL effacer la propriété shorthand correspondante (`margin` ou `padding`).

Lors de l'ouverture du panneau, le mode affiché par défaut SHALL être déterminé automatiquement :
- **Mode unifié** si seule la propriété shorthand est définie, ou si les quatre côtés longhand ont la même valeur non vide.
- **Mode par côté** si au moins deux côtés longhand ont des valeurs différentes, ou si seules des valeurs longhand asymétriques sont définies.

Lors du passage du mode unifié au mode par côté, si une valeur unifiée est définie, elle SHALL être répartie sur les quatre champs longhand.

Lors du passage du mode par côté au mode unifié, si les quatre côtés ont la même valeur non vide, le champ unifié SHALL afficher cette valeur ; sinon le champ unifié SHALL être vide jusqu'à une nouvelle saisie.

Les placeholders thème existants SHALL continuer de fonctionner : en mode unifié, le placeholder SHALL provenir de la propriété shorthand (`margin` / `padding`) du thème ; en mode par côté, les placeholders par côté existants SHALL être conservés.

#### Scenario: Saisie margin unifiée sur un conteneur
- **WHEN** l'utilisateur ouvre les réglages de style d'un `NodeContainer` en mode unifié pour margin
- **AND** saisit `1rem` dans le champ unique
- **THEN** le style du nœud contient `margin: 1rem`
- **AND** les propriétés `marginTop`, `marginRight`, `marginBottom`, `marginLeft` ne sont pas définies

#### Scenario: Saisie padding par côté asymétrique
- **WHEN** l'utilisateur bascule padding en mode par côté
- **AND** saisit `2rem` en top et `1rem` en bottom
- **THEN** le style contient `paddingTop: 2rem` et `paddingBottom: 1rem`
- **AND** la propriété shorthand `padding` n'est pas définie

#### Scenario: Bascule unifié vers par côté avec valeur existante
- **WHEN** le nœud a `margin: 1.5rem` en style inline
- **AND** l'utilisateur bascule margin en mode par côté
- **THEN** les quatre champs affichent `1.5rem`
- **AND** `margin` shorthand est retiré au profit des quatre propriétés longhand

#### Scenario: Détection automatique mode par côté
- **WHEN** le nœud a `paddingTop: 1rem` et `paddingBottom: 2rem` sans shorthand
- **THEN** `Spacing2Settings` ouvre padding en mode par côté
- **AND** les champs top et bottom affichent leurs valeurs respectives

#### Scenario: Détection automatique mode unifié (valeurs égales)
- **WHEN** le nœud a `marginTop`, `marginRight`, `marginBottom` et `marginLeft` tous à `1rem`
- **THEN** `Spacing2Settings` ouvre margin en mode unifié
- **AND** le champ unique affiche `1rem`

#### Scenario: Placeholder thème en mode unifié
- **WHEN** l'utilisateur ouvre `Spacing2Settings` pour un nœud sans margin inline
- **AND** le thème définit `margin: 1rem` pour le sélecteur d'override correspondant
- **AND** le panneau est en mode unifié pour margin
- **THEN** le champ unique affiche `1rem` en placeholder indicatif

#### Scenario: Placeholder thème en mode par côté inchangé
- **WHEN** l'utilisateur ouvre `Spacing2Settings` en mode par côté pour margin
- **AND** le thème définit `margin-top: 1rem` pour le sélecteur correspondant
- **AND** `margin-top` n'a pas de valeur inline sur le nœud
- **THEN** le champ `top` affiche `1rem` en placeholder indicatif
