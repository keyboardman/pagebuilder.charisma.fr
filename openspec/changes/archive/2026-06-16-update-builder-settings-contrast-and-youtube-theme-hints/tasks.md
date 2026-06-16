## 1. Titres de section Settings (contraste light/dark)

- [x] 1.1 Créer `SettingsSectionTitle` dans `assets/editeur/ManagerNode/Settings/` avec les classes sémantiques (`text-center text-sm py-0 leading-tight text-muted-foreground bg-muted` ou équivalent validé visuellement).
- [x] 1.2 Remplacer les `<div>` titres dans `Text2Settings`, `Spacing2Settings`, `Background2Settings`, `Border2Settings`, `Size2Settings` et `Object2Settings`.
- [x] 1.3 Vérifier visuellement en mode clair et mode sombre du panneau latéral droit que les libellés (`Margin`, `Padding`, `Text`, etc.) restent lisibles.

## 2. Placeholders thème NodeYoutube

- [x] 2.1 Confirmer que `NodeYoutube/Settings.tsx` transmet `themeOverrideSelector={THEME_SELECTORS.youtube}` à `Spacing2Settings` et `Border2Settings`.
- [x] 2.2 Vérifier manuellement qu’un thème avec overrides `.ce-youtube` (ex. `margin-top`, `border-radius`) affiche ces valeurs en placeholder lorsque les champs du nœud sont vides.

## 3. Validation

- [x] 3.1 Compilation Encore / build frontend sans erreur.
- [x] 3.2 Contrôle visuel rapide du panneau réglages `NodeYoutube` avec un thème contenant des overrides `.ce-youtube`.
