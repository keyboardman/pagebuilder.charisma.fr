# Change: Installer Webpack Encore avec Tailwind CSS (préparation React)

## Why

Le projet prévoit d’utiliser React.js. Webpack Encore est adapté à React (`.enableReactPreset()`) et à un pipeline CSS (PostCSS, Tailwind). Il remplace AssetMapper/Importmap par un build npm (Webpack) qui produit des assets dans `public/build/`, ce qui permet d’intégrer Tailwind via PostCSS et de rendre le projet prêt pour des composants React sans changer à nouveau d’outil.

## What Changes

- **Remplacement d’AssetMapper/Importmap par Encore :**
  - Retrait de `symfony/asset-mapper`, de `importmap.php`, de `config/packages/asset_mapper.yaml` et du script `importmap:install` dans `composer.json`.
  - Ajout de `symfony/webpack-encore-bundle`, création de `webpack.config.js` et `package.json` (avec `tailwindcss`, `@tailwindcss/postcss`, `postcss`, `postcss-loader`).
- **Tailwind via PostCSS :** `Encore.enablePostCssLoader()`, `postcss.config.mjs` avec `@tailwindcss/postcss`, et `assets/styles/app.css` contenant `@import "tailwindcss"` (et `@source not "../../public"` pour éviter les boucles en watch).
- **Préparation React :** `.enableReactPreset()` dans `webpack.config.js` ; `react` et `react-dom` pourront être installés plus tard lors de l’ajout des premiers composants.
- **Templates et entrypoints :** `base.html.twig` utilise `encore_entry_link_tags('app')` et `encore_entry_script_tags('app')` à la place de `importmap('app')`. L’entrypoint `assets/app.js` importe `./styles/app.css` et le bootstrap Stimulus ; `enableStimulusBridge('./assets/controllers.json')` est configuré. Les contrôleurs Stimulus et UX Turbo existants sont conservés et alimentés via Encore.
- **Build et déploiement :** `npm run watch` en dev, `npm run build` (ou `encore production`) avant déploiement ; les assets sont servis depuis `public/build/`.

## Impact

- **Specs affectées :** la capacité `tailwind-bundle` (SymfonyCasts) est remplacée par `encore-tailwind`.
- **Code affecté :**
  - `composer.json` / `composer.lock` : retrait asset-mapper, ajout webpack-encore-bundle ; retrait `importmap:install`, ajout éventuel de scripts `encore` si absents du recipe.
  - `config/bundles.php` : ajout WebpackEncoreBundle, possible retrait ou non d’AssetMapper selon le recipe.
  - Suppression : `importmap.php`, `config/packages/asset_mapper.yaml`.
  - Nouveaux : `webpack.config.js`, `package.json`, `package-lock.json`, `postcss.config.mjs`.
  - `assets/app.js` : adapter les imports (bootstrap Stimulus compatible Encore, `import './styles/app.css'`).
  - `assets/styles/app.css` : `@import "tailwindcss"` et `@source not "../../public"` ; le CSS personnalisé existant peut être conservé.
  - `templates/base.html.twig` : `encore_entry_link_tags('app')`, `encore_entry_script_tags('app')`, retrait de `importmap('app')`.
  - `.gitignore` : conserver `node_modules/` ; les entrées `asset_mapper` peuvent être retirées.
- **Nouveaux répertoires/fichiers :** `public/build/` (généré, à ignorer ou à déployer selon la convention).
