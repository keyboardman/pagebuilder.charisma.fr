# encore-tailwind Specification

## Purpose
TBD - created by archiving change add-tailwind-bundle. Update Purpose after archive.
## Requirements
### Requirement: Webpack Encore et build des assets

Le projet SHALL inclure `symfony/webpack-encore-bundle`. Un fichier `webpack.config.js` et un `package.json` SHALL exister à la racine. Le projet SHALL ne plus utiliser `symfony/asset-mapper` ni `importmap.php` pour le bundle principal ; la commande `npm run build` (ou `encore production`) SHALL produire les assets dans `public/build/`.

#### Scenario: Build Encore

- **WHEN** `composer require symfony/webpack-encore-bundle`, `npm install` et `npm run build` sont exécutés
- **THEN** les fichiers `public/build/app.css` et `public/build/app.js` (ou leurs variantes avec hash) existent et `importmap` ainsi que la configuration `asset_mapper` ne sont plus utilisés pour l’entrypoint principal

### Requirement: Tailwind CSS via PostCSS

Encore SHALL activer le loader PostCSS (`Encore.enablePostCssLoader()`). Un fichier `postcss.config.mjs` SHALL configurer le plugin `@tailwindcss/postcss`. Le fichier `assets/styles/app.css` SHALL importer Tailwind via `@import "tailwindcss"` (et `@source not "../../public"` si nécessaire pour le mode watch).

#### Scenario: Classes Tailwind compilées

- **WHEN** la configuration PostCSS et Tailwind est en place et `npm run build` est exécuté
- **THEN** une classe utilitaire Tailwind utilisée dans un template ou un composant est présente dans le CSS compilé et appliquée à l’affichage

### Requirement: Entrypoints Encore dans les templates

Le layout de base SHALL charger les assets via `encore_entry_link_tags('app')` et `encore_entry_script_tags('app')` pour l’entrypoint `app`, et SHALL ne plus utiliser `importmap()` pour le bundle principal.

#### Scenario: Chargement des assets en page

- **WHEN** une page hérite du layout de base et que le build Encore a été exécuté
- **THEN** le CSS et le JS de l’entrypoint `app` sont chargés depuis `public/build/` via les tags Encore

### Requirement: Préparation React

La configuration Webpack Encore SHALL activer le preset React (`.enableReactPreset()`). Le projet pourra installer `react` et `react-dom` lorsque les premiers composants React seront ajoutés.

#### Scenario: Compilation de composants React

- **WHEN** `enableReactPreset()` est activé, `react` et `react-dom` sont installés, et un fichier `.jsx` est importé dans l’entrypoint `app`
- **THEN** le build Encore compile ce fichier sans erreur et le composant est exécutable dans le navigateur

### Requirement: DaisyUI et thème light

Le projet SHALL inclure DaisyUI (daisyui@latest, compatible Tailwind v4) comme plugin Tailwind. Le fichier `assets/styles/app.css` SHALL déclarer `@plugin "daisyui"` après `@import "tailwindcss"`. Le layout de base SHALL définir `data-theme="light"` sur l’élément `<html>` afin que le thème light s’applique par défaut à l’ensemble de l’application.

#### Scenario: Composants daisyUI avec thème light

- **WHEN** daisyUI est configuré, `data-theme="light"` est défini sur `<html>`, et `npm run build` a été exécuté
- **THEN** une classe daisyUI (ex. `btn btn-primary`) utilisée dans un template est présente dans le CSS compilé et s’affiche avec les styles du thème light

