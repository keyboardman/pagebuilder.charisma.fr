## MODIFIED Requirements

### Requirement: Chargement du CSS du thème dans le contexte d'édition

Lors de l'édition d'une page, le builder SHALL bénéficier du CSS du thème associé à la page (chargé via `app_theme_css`), afin que le rendu dans l'éditeur reflète les styles du thème choisi.

Le CSS chargé SHALL correspondre au CSS final généré par le pipeline de thème (socle CSS de base + overrides ThemeBuilder), et ce CSS SHALL couvrir tous les nodes enregistrés afin de garantir la cohérence visuelle de l'éditeur.

#### Scenario: Édition avec styles du thème
- **WHEN** l'utilisateur édite une page avec un thème ayant un fichier CSS généré
- **THEN** la feuille de style du thème est chargée dans la page d'édition et le contenu affiché dans le builder utilise ces styles

#### Scenario: Couverture des styles pour tous les nodes en édition
- **WHEN** la page contient plusieurs types de nodes pris en charge par le registre du builder
- **THEN** l'éditeur applique les styles du CSS de thème généré à chacun de ces nodes (base et overrides éventuels) avec un rendu cohérent avec la preview et le rendu final
