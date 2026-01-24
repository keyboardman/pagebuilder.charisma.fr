## 1. Intégration DaisyUI et thème light

- [x] 1.1 Ajouter `daisyui@latest` en devDependency (`npm install -D daisyui@latest`)
- [x] 1.2 Dans `assets/styles/app.css`, ajouter `@plugin "daisyui"` après `@import "tailwindcss"` (conserver `@source not "../../public"` si présent)
- [x] 1.3 Dans `templates/base.html.twig`, ajouter `data-theme="light"` sur la balise `<html>`
- [x] 1.4 Exécuter `npm run build` et vérifier l’absence d’erreurs ; ouvrir une page existante et confirmer que les styles daisyUI (ex. `btn`, `card`) sont applicables

## 2. Page de présentation des composants Daisy

- [x] 2.1 Créer `src/Controller/DaisyuiShowcaseController.php` avec une action rendant la page, route dédiée (ex. `/_daisyui` ou `/daisyui`)
- [x] 2.2 Créer `templates/daisyui_showcase/index.html.twig` héritant de `base.html.twig`
- [x] 2.3 Dans le template, ajouter des sections pour : **Boutons** (primary, secondary, accent, neutral, info, success, warning, error ; variantes outline, ghost ; tailles), **Badges**, **Cartes** (card, card-title, card-actions), **Alertes** (info, success, warning, error), **Formulaires** (input, textarea, select, checkbox, toggle, range), **Layout** (divider). Chaque section doit montrer des exemples concrets avec classes daisyUI
- [x] 2.4 Vérifier que la page est accessible et que tous les blocs de composants s’affichent correctement avec le thème light

## 3. Validation

- [x] 3.1 `openspec validate add-daisyui-light-showcase --strict` (déjà fait en amont de l’implémentation)
- [x] 3.2 Test manuel : `npm run watch`, navigation vers la page showcase et une page existante ; pas de régression visuelle sur le layout de base
