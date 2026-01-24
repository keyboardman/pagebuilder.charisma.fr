# daisyui-showcase Specification

## Purpose
TBD - created by archiving change add-daisyui-light-showcase. Update Purpose after archive.
## Requirements
### Requirement: Page de présentation des composants Daisy

Le projet SHALL fournir une page dédiée (route dédiée, ex. `/_daisyui` ou `/daisyui`) qui présente un échantillon représentatif de composants daisyUI. La page SHALL hériter du layout de base et SHALL afficher, au minimum, des exemples des composants suivants : boutons (couleurs sémantiques primary, secondary, accent, neutral, info, success, warning, error ; variantes ; tailles), badges, cartes (card, card-title, card-actions), alertes (info, success, warning, error), champs de formulaire (input, textarea, select, checkbox, toggle), et éléments de layout (divider). L’objectif est de servir de référence visuelle pour les composants daisyUI disponibles avec le thème light.

#### Scenario: Page showcase accessible et complète

- **WHEN** l’utilisateur navigue vers la route de la page de présentation des composants Daisy
- **THEN** la page s’affiche avec le thème light, et chaque section (boutons, badges, cartes, alertes, formulaires, layout) contient au moins un exemple fonctionnel utilisant des classes daisyUI

