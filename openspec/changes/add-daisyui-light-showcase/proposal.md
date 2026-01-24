# Change: Installer DaisyUI (thème light) et page de présentation des composants

## Why

Le projet utilise déjà Tailwind CSS v4 via Encore et PostCSS. DaisyUI apporte des composants sémantiques (boutons, cartes, badges, etc.) qui accélèrent le développement d’interfaces. Une page de présentation des composants Daisy permet de les découvrir, de vérifier le rendu avec le thème light et de les réutiliser comme référence.

## What Changes

- **DaisyUI dans le pipeline CSS :**
  - Ajout de `daisyui@latest` (v5, compatible Tailwind v4) en devDependency.
  - Dans `assets/styles/app.css` : `@plugin "daisyui"` après `@import "tailwindcss"`.
- **Thème light par défaut :**
  - `data-theme="light"` sur l’élément `<html>` dans `templates/base.html.twig` pour forcer le thème light sur l’ensemble de l’application.
- **Page de présentation des composants Daisy :**
  - Nouveau controller Symfony avec une route (ex. `/_daisyui` ou `/daisyui`) pour une page showcase.
  - Template Twig dédié qui affiche un échantillon représentatif de composants : boutons (couleurs, tailles), badges, cartes, alertes, champs de formulaire (input, textarea, select, checkbox, toggle), et éléments de layout (divider, etc.).
  - La page hérite du layout de base et utilise uniquement des classes daisyUI pour démontrer le rendu avec le thème light.

## Impact

- **Specs affectées :** `encore-tailwind` (MODIFIED), nouvelle capacité `daisyui-showcase` (ADDED).
- **Code affecté :**
  - `package.json` : ajout `daisyui` en devDependency.
  - `assets/styles/app.css` : `@plugin "daisyui"`.
  - `templates/base.html.twig` : `data-theme="light"` sur `<html>`.
  - Nouveaux : `src/Controller/DaisyuiShowcaseController.php`, `templates/daisyui_showcase/index.html.twig`.
  - Routes : la route de la page showcase est enregistrée via l’attribut `#[Route]` du controller (aucun fichier de routes à modifier si `routing.controllers` charge déjà `src/Controller/`).
