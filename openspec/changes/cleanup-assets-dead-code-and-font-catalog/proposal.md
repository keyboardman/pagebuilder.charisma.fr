# Change: Nettoyage du code mort dans assets et accès au catalogue de polices

## Why

Le builder limite aujourd’hui les sélecteurs `font-family` aux polices du thème et aux polices navigateur intégrées (`typography.ts`), avec un ajout à la demande via **ManagerFont** (`FontFamilySelect` + `GET /api/builder/fonts`). Cette évolution récente coexiste encore avec d’anciens artefacts frontend (entrée Webpack `themeForm`, contrôleur Stimulus autocomplete, composant `ApiManager` non branché) qui encombrent `assets/` et rendent le périmètre fonts / APIs cards difficile à maintenir.

Dans **NodeSlideshow** en mode `api-endpoint`, la sélection d’API repose sur un filtre manuel (`apiRegistry.list()` → type `image` + collection `fixed`) plutôt que sur les filtres standardisés d’`ApiManagerModal`, ce qui accentue la confusion entre APIs cards et autres sources (TODO : « Restructurer Api — séparer fonts, cards »).

Avant d’étendre ou de corriger le flux polices, il faut **auditer et retirer le code mort dans `assets/`** pour réduire le risque de régression et clarifier les points d’entrée réels du builder.

## What Changes

- **Phase 1 — Audit et suppression du code mort dans `assets/`** (prérequis) :
  - Inventorier les fichiers, exports et entrées Webpack non référencés.
  - Supprimer ou fusionner les doublons confirmés (ex. `ApiManager.tsx` vs `ApiManagerModal`, entrée `themeForm` vs `ThemeForm2`, `pageFormWithBuilder.jsx` / `pageBuilder.jsx` hors bundle, exports `@deprecated` sans appelant).
  - Corriger les alias Webpack obsolètes (`@editeur` → `editeur2` inexistant) si impact confirmé.
- **Phase 2 — Clarifier l’accès au catalogue de polices** :
  - Vérifier que `FontFamilySelect` + `ManagerFontModal` fonctionnent lorsque `pageBuilderApiBaseUrl` est fourni (builder, preview, standalone).
  - Retirer les chemins legacy de sélection de polices qui ne passent plus par `ManagerFont` / `FontUsageRegistry`.
  - Documenter dans le code le contrat : builtins + thème + polices de page actives ; catalogue complet uniquement via modale.
- **Phase 3 — Harmoniser la sélection d’API image pour NodeSlideshow** :
  - Aligner le panneau NodeSlideshow (mode `api-endpoint`) sur le pattern `ApiManagerModal` avec `typeFilter="image"` et `collectionModeFilter="fixed"`, comme pour les autres nœuds API.
  - Ne pas mélanger dans ce sélecteur les endpoints du catalogue `Font` (déjà servis par `/api/builder/fonts`).

## Impact

- Affected specs: `page-builder`
- Affected code (indicatif) :
  - `assets/` (audit global, suppressions)
  - `webpack.config.js` (entrées obsolètes)
  - `assets/editeur/ManagerApi/ApiManager.tsx` (candidat suppression)
  - `assets/themeForm.jsx`, `assets/components/ThemeFontPicker.jsx` (candidats suppression)
  - `assets/editeur/components/form/FontFamilySelect.tsx`, `assets/editeur/ManagerFont/*`
  - `assets/editeur/ManagerNode/NodeSlideshow/Settings.tsx`
