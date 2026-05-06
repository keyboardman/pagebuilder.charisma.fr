# Change: Extraire le CSS de thème de base pour ThemeBuilder (tous les nodes)

## Why
Le CSS de base du builder est actuellement dispersé dans des fichiers statiques côté éditeur et n'est pas piloté de manière explicite par ThemeBuilder. Cela limite la personnalisation globale et empêche d'avoir une base unique, versionnée et modifiable pour tous les nodes.

## What Changes
- Définir un CSS de base de thème comme source explicite (socle commun) pour le rendu du builder.
- Permettre à ThemeBuilder de modifier ce socle via des overrides structurés (variables et règles par node).
- Générer un CSS final versionné en composant le socle de base et les personnalisations ThemeBuilder.
- Exiger la couverture de tous les nodes enregistrés dans le builder afin d'éviter les zones non stylables.
- Garantir le même résultat visuel entre éditeur, preview et rendu final.

## Impact
- Affected specs: `theme-generator`, `page-builder`
- Affected code: `assets/editeur/assets/themes/base/css/*`, pipeline de génération de thème (`ThemeCssGenerator` et persistance YAML), intégration du CSS de thème dans le builder (`app_theme_css`, rendu édition/preview)
