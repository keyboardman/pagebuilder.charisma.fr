# Design: add-tailwind-bundle (Encore + Tailwind + React-ready)

## Context

- Symfony 8, AssetMapper, Importmap, Stimulus, UX Turbo. Pas de Node/npm pour le build actuel.
- CSS : `assets/styles/app.css` importé depuis `assets/app.js`. Le bloc `{% block stylesheets %}` de `base.html.twig` est vide ; le JS et le CSS passent par `importmap('app')`.

## Goals / Non-Goals

- **Goals :** avoir un build Webpack (Encore) avec Tailwind CSS (PostCSS) et une configuration prête pour React, en remplaçant AssetMapper/Importmap pour le bundle principal.
- **Non-Goals :** migrer immédiatement des écrans en React ; ajouter un thème de formulaires Tailwind (possible plus tard).

## Decisions

- **Webpack Encore au lieu du SymfonyCasts Tailwind Bundle :** Encore permet `.enableReactPreset()` et un écosystème npm (Tailwind via PostCSS, React, etc.) cohérent pour l’évolution du front.
- **Tailwind via PostCSS :** `Encore.enablePostCssLoader()` et `postcss.config.mjs` avec `@tailwindcss/postcss`, conformément au guide officiel Tailwind pour Symfony. `assets/styles/app.css` utilise `@import "tailwindcss"` et `@source not "../../public"` pour Tailwind v4.
- **Remplacement d’AssetMapper et Importmap :** un seul outil de build (Encore) pour le bundle principal. Stimulus et UX Turbo sont chargés via l’entrypoint Encore et `enableStimulusBridge`, en s’appuyant sur les paquets npm correspondants.
- **React :** `.enableReactPreset()` activé dès maintenant ; `react` et `react-dom` seront installés au moment d’introduire les premiers composants .jsx/.tsx.
- **Déploiement :** `npm run build` (ou `encore production`) produit `public/build/` ; le serveur sert ces fichiers. L’ordre avec d’éventuelles autres tâches (cache, etc.) reste à préciser dans le pipeline.

## Alternatives considered

- **SymfonyCasts Tailwind Bundle ( AssetMapper ) :** rejeté pour ce change car il n’intègre pas React ; une migration ultérieure vers Encore serait nécessaire.
- **Vite :** possible, mais Encore est la stack recommandée dans la doc Symfony et s’intègre via WebpackEncoreBundle ; on privilégie Encore pour rester aligné avec l’écosystème Symfony.

## Risks / Trade-offs

- **Node/npm obligatoires :** le build front nécessite Node et `npm install` / `npm run build` en CI et en local. `node_modules/` et `public/build/` sont à gérer dans `.gitignore` et le pipeline.
- **Migration des assets :** les chemins et le format des entrypoints changent (plus d’importmap ni d’asset). Les contrôleurs Stimulus et la structure `assets/` doivent être compatibles `enableStimulusBridge` (controllers.json, bootstrap).

## Migration Plan

1. Installer Encore et les deps npm (dont Tailwind/PostCSS).
2. Créer `webpack.config.js` et `postcss.config.mjs`, adapter `assets/styles/app.css`.
3. Adapter `assets/app.js` et le bootstrap Stimulus pour Encore ; configurer `enableStimulusBridge`.
4. Remplacer dans `base.html.twig` `importmap('app')` par `encore_entry_link_tags('app')` et `encore_entry_script_tags('app')`.
5. Supprimer AssetMapper, importmap, `asset_mapper.yaml` et `importmap.php` ; retirer `importmap:install` des scripts Composer.
6. Exécuter `npm run build` et vérifier que les pages chargent correctement le CSS et le JS.
7. **Rollback :** réintroduire asset-mapper, importmap et les anciens templates, et retirer Encore/npm (recommandé de faire la migration dans une branche dédiée).

## Open Questions

- Aucun. Si un besoin de cohabitation partielle AssetMapper + Encore apparaît (assets séparés), à traiter dans un changement ultérieur.
