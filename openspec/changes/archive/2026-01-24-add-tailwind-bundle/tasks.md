# Tasks: add-tailwind-bundle (Encore + Tailwind + React-ready)

## 1. Remplacer AssetMapper par Webpack Encore

- [x] 1.1 `composer remove symfony/asset-mapper`
- [x] 1.2 `composer require symfony/webpack-encore-bundle` (conserver `symfony/ux-turbo` et `symfony/stimulus-bundle` ; le recipe Encore peut créer ou adapter `webpack.config.js` et `assets/`)
- [x] 1.3 Supprimer `importmap.php` et retirer `importmap:install` des scripts dans `composer.json` ; supprimer `config/packages/asset_mapper.yaml`
- [x] 1.4 `npm install` pour installer les dépendances Encore (créées ou mises à jour par le recipe)

## 2. Tailwind via PostCSS

- [x] 2.1 `npm install tailwindcss @tailwindcss/postcss postcss postcss-loader`
- [x] 2.2 Dans `webpack.config.js`, appeler `Encore.enablePostCssLoader()`
- [x] 2.3 Créer `postcss.config.mjs` avec le plugin `@tailwindcss/postcss`
- [x] 2.4 Dans `assets/styles/app.css` : `@import "tailwindcss";` et `@source not "../../public";` ; conserver ou fusionner le CSS personnalisé existant

## 3. Préparation React

- [x] 3.1 Dans `webpack.config.js`, activer `Encore.enableReactPreset()` (décommenter ou ajouter)
- [x] 3.2 Documenter que `npm install react react-dom` (et éventuellement `prop-types`) sera à exécuter lors de l'ajout des premiers composants React

## 4. Entrypoints, Stimulus et templates

- [x] 4.1 Adapter `assets/app.js` : `import './styles/app.css'` et import du bootstrap Stimulus (ex. `import './bootstrap'` si `bootstrap.js` existe, ou adapter `stimulus_bootstrap.js` pour Encore) ; s'assurer que `enableStimulusBridge('./assets/controllers.json')` est configuré et que `assets/controllers/` et `controllers.json` sont cohérents
- [x] 4.2 Dans `templates/base.html.twig` : `{% block stylesheets %}{{ encore_entry_link_tags('app') }}{% endblock %}` et remplacer `{% block importmap %}{{ importmap('app') }}{% endblock %}` par `{{ encore_entry_script_tags('app') }}` (dans `javascripts` ou au bon endroit)

## 5. Build et validation

- [x] 5.1 Exécuter `npm run build` (ou `encore production`) et vérifier la présence de `public/build/app.css` et `public/build/app.js` (ou variantes avec hash)
- [x] 5.2 Tester en dev : `npm run watch`, modifier une classe Tailwind dans un template, recharger la page et confirmer le style
- [x] 5.3 Vérifier que Stimulus et UX Turbo fonctionnent (controllers existants, comportement Turbo)

## 6. Déploiement et .gitignore

- [x] 6.1 S'assurer que `node_modules/` et `public/build/` sont dans `.gitignore` (ou selon la convention : déployer `public/build/` si le build est fait en CI)
- [x] 6.2 Documenter ou automatiser dans le pipeline : `npm run build` (ou `encore production`) avant mise en production
- [x] 6.3 Retirer les blocs `###> symfony/asset-mapper ###` / `###< symfony/asset-mapper ###` dans `.gitignore` si présents
