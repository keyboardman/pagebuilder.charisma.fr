## 1. Bootstrap et contexte

- [x] 1.1 Exposer `themeNodeOverrides` et `themeVars` (config normalisée) dans `PageController::builder` et `builder.html.twig` (`page-builder-data`)
- [x] 1.2 Propager dans `PageBuilderEmbed` / `AppProvider` / `AppContext`
- [x] 1.3 Créer `themeStyleHints.ts` : normalisation legacy (`stringCssToMap`), mapping camelCase ↔ kebab-case, résolution `var(--…)` via `themeVars`, `getThemeStylePlaceholder(selector, property, fallback?)`

## 2. Composants *2Settings

- [x] 2.1 Ajouter la prop `themeOverrideSelector?: string` à l’interface commune des `*2Settings`
- [x] 2.2 `Text2Settings` : placeholders dynamiques (`font-size`, `font-weight`, `line-height`, `color`, etc.)
- [x] 2.3 `Background2Settings` : placeholders dynamiques (`background-color`, `background-image`, etc.)
- [x] 2.4 `Border2Settings` : placeholders dynamiques (`border-color`, `border-width`, `border-radius`, etc.)
- [x] 2.5 `Spacing2Settings` : placeholders dynamiques (margin/padding par côté)
- [x] 2.6 `Size2Settings` et `Object2Settings` : placeholders dynamiques si overrides thème pertinents

## 3. Propagation par nœud

- [x] 3.1 Nœuds simples : `NodeText`, `NodeButton`, `NodeHtml`, `NodeHeader`, `NodeImage`, `NodeContainer`, etc.
- [x] 3.2 Nœuds à sous-parties : `NodeCard` (card/image/title/text/label selon position), `NodeCardApi`, `NodeFormInput`, `NodeFormSelect`, `NodeNav`, `NodeVideoHome`, `NodePureMusicTopSemaine`, `NodeAnniversaire`
- [x] 3.3 Documenter ou centraliser le tableau sélecteur ↔ contexte (réutiliser les sélecteurs ThemeForm / `NODE_OVERRIDE_TARGETS`)

## 4. Validation

- [x] 4.1 Test manuel : thème avec `font-size` sur `.ce-text` → champ vide dans NodeText affiche la valeur en placeholder
- [x] 4.2 Test manuel : valeur saisie sur le nœud → placeholder thème masqué (champ rempli)
- [x] 4.3 Test manuel : propriété absente du thème → placeholder générique inchangé (ex. `ex: 1.5rem`)
- [x] 4.4 Test manuel : NodeCard titre (position top) → hint depuis `.ce-card-position-top .ce-card-title`
- [x] 4.5 Test manuel : override `color: var(--color-primary)` avec `--color-primary: #3b82f6` → placeholder `#3b82f6` (pas `var(--color-primary)`)
