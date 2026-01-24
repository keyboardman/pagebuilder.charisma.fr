## ADDED Requirements

### Requirement: DaisyUI et thème light

Le projet SHALL inclure DaisyUI (daisyui@latest, compatible Tailwind v4) comme plugin Tailwind. Le fichier `assets/styles/app.css` SHALL déclarer `@plugin "daisyui"` après `@import "tailwindcss"`. Le layout de base SHALL définir `data-theme="light"` sur l’élément `<html>` afin que le thème light s’applique par défaut à l’ensemble de l’application.

#### Scenario: Composants daisyUI avec thème light

- **WHEN** daisyUI est configuré, `data-theme="light"` est défini sur `<html>`, et `npm run build` a été exécuté
- **THEN** une classe daisyUI (ex. `btn btn-primary`) utilisée dans un template est présente dans le CSS compilé et s’affiche avec les styles du thème light
