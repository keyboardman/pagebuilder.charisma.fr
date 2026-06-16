## 1. Audit code mort dans assets (prérequis)

- [x] 1.1 Lancer un inventaire automatisé (`knip`, `ts-prune`, ou script grep) sur `assets/` et croiser avec `webpack.config.js` + templates Twig (`encore_entry_*`)
- [x] 1.2 Valider manuellement les candidats listés dans `design.md` (zéro import / zéro entrée Encore)
- [x] 1.3 Produire une checklist finale des suppressions approuvées avant toute modification fonctionnelle

## 2. Suppression du code mort confirmé

- [x] 2.1 Retirer `ApiManager.tsx` si aucune référence résiduelle
- [x] 2.2 Retirer `themeForm.jsx`, entrée Webpack `themeForm`, et `ThemeFontPicker.jsx` si `ThemeForm2` couvre tous les cas
- [x] 2.3 Retirer `pageFormWithBuilder.jsx` et `pageBuilder.jsx` si hors bundle et sans usage documenté
- [x] 2.4 Retirer exports `@deprecated` sans appelant (`sanitizeSlideshowContentForPersistence`, `getNodeLabel`) et fonctions orphelines (`fetchFontById`, `clearFontResolveCache`) ou les brancher si nécessaire
- [x] 2.5 Retirer `font_family_autocomplete_controller.js` si non enregistré et non référencé en Twig
- [x] 2.6 Corriger ou supprimer l’alias Webpack `@editeur` → `editeur2`
- [x] 2.7 Exécuter `npm run build` (ou `encore dev`) et smoke test : builder, preview, `/theme/fonts`, filemanager

## 3. Catalogue de polices — vérification et consolidation

- [x] 3.1 Vérifier que `pageBuilderApiBaseUrl` est injecté dans `builder.html.twig` et `pageBuilderStandalone.jsx`
- [x] 3.2 Tester `FontFamilySelect` → « Ajouter une police… » → sélection Google/custom → police visible dans le sélecteur et l’iframe
- [x] 3.3 Vérifier `syncFontUsageFromNodes` au chargement d’une page avec `fontFamily` catalogue existante
- [x] 3.4 Supprimer tout résidu UI legacy de sélection de polices non aligné sur ManagerFont

## 4. NodeSlideshow — sélection d’API harmonisée

- [x] 4.1 Remplacer le sélecteur API manuel dans `NodeSlideshow/Settings.tsx` par `ApiManagerModal` avec `typeFilter="image"` et `collectionModeFilter="fixed"`
- [x] 4.2 Conserver la persistance `slidesMode` + `apiId` sans réintroduire la sérialisation des slides API
- [x] 4.3 Test manuel : mode `api-endpoint`, changement d’API, preview et rendu avec données fraîches

## 5. Validation OpenSpec

- [x] 5.1 Exécuter `openspec validate cleanup-assets-dead-code-and-font-catalog --strict`
