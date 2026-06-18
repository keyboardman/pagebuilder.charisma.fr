## ADDED Requirements

### Requirement: Conservation de la position de défilement lors du basculement Édition/Prévisualisation

Lors du basculement entre le mode **édition** et le mode **prévisualisation**, le builder SHALL conserver la **position de lecture** de l’utilisateur dans le canevas : la région de contenu visible avant le basculement SHALL rester visible après le basculement, sans remonter automatiquement en haut de la page ni sauter vers une autre section non consultée.

La conservation SHALL s’appliquer au conteneur de défilement du canevas (`.admin-layout__main`), que le builder soit monté en contexte standalone (`pageBuilderStandalone.jsx`) ou embarqué dans le formulaire d’édition de page. Le mécanisme SHALL fonctionner dans les deux sens (édition → prévisualisation et prévisualisation → édition).

#### Scenario: Bascule édition → prévisualisation après défilement

- **WHEN** l’utilisateur fait défiler le canevas en mode édition pour consulter une section au milieu ou en bas d’une page longue
- **AND** l’utilisateur active le mode prévisualisation
- **THEN** le canevas affiche la même région de contenu qu’avant le basculement
- **AND** le canevas ne revient pas automatiquement en haut de la page

#### Scenario: Bascule prévisualisation → édition

- **WHEN** l’utilisateur fait défiler le canevas en mode prévisualisation
- **AND** l’utilisateur revient en mode édition
- **THEN** le canevas reste positionné sur la même région de contenu qu’en prévisualisation

#### Scenario: Bascule sans défilement préalable

- **WHEN** l’utilisateur bascule entre édition et prévisualisation sans avoir fait défiler le canevas depuis le chargement ou le dernier basculement
- **THEN** le canevas reste en haut de la page

#### Scenario: Contexte standalone et embarqué

- **WHEN** l’utilisateur bascule entre édition et prévisualisation dans le builder standalone ou dans le builder embarqué du formulaire page
- **THEN** la position de lecture est conservée selon les mêmes règles dans les deux contextes
