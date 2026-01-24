# Tasks: add-theme-generator

## 1. Dépendances et stockage

- [x] 1.1 Ajouter `league/flysystem` dans `composer.json` ; configurer un `LocalFilesystemAdapter` pour `%kernel.project_dir%/storage/fonts`.
- [x] 1.2 Créer les dossiers `storage/fonts` et `storage/themes` ; ajouter `storage/fonts/*` (et exclusion des binaires) dans `.gitignore` si nécessaire.

## 2. Entité Font et variantes

- [x] 2.1 Créer l’entité `Font` : `name`, `type` (enum native|google|custom), `fallback`, `slug` (unique) ; pour `google` : `googleFontUrl` (nullable).
- [x] 2.2 Créer l’entité `FontVariant` : `font` (ManyToOne), `weight`, `style`, `width`, `path` ; énumérations ou chaînes contraintes selon le design.
- [x] 2.3 Migration Doctrine pour `font` et `font_variant`.
- [x] 2.4 Service `FontStorage` (ou équivalent) utilisant Flysystem : écriture dans `{slug}/…` pour les uploads custom ; suppression des fichiers d’une variante supprimée.

## 3. Entité Theme et schéma theme.yaml

- [x] 3.1 Créer l’entité `Theme` : `name`, `slug` (optionnel), `generatedYamlPath`, `generatedCssPath`.
- [x] 3.2 Définir le schéma de référence `theme.yaml` (nom, vars, body, h1–h6, div, p) en PHP/YAML ou fichier ; documenter la structure dans le spec.
- [x] 3.3 Migration Doctrine pour `theme`.

## 4. Formulaire et génération

- [x] 4.1 Implémenter le builder de formulaire dynamique à partir du schéma theme.yaml (vars, body, h1–h6, div, p) ; `font-family` relié à l’entité `Font` ou en texte libre.
- [x] 4.2 Service `ThemeCssGenerator` : lecture du theme.yaml (contenu ou chemin), génération du CSS (`:root` + sélecteurs) ; écriture dans le chemin de sortie avec version (hash ou timestamp) dans le nom de fichier.
- [x] 4.3 Mise à jour de `Theme.generatedCssPath` après chaque génération ; politique de l’ancien fichier (suppression ou conservation) selon le design.

## 5. Contrôleurs et UX (minimal)

- [x] 5.1 CRUD (ou création/édition) pour `Font` : formulaire selon le type (native / google / custom) ; pour custom, upload de variantes (poids, style, largeur) via `FontStorage`.
- [x] 5.2 CRUD (ou création/édition) pour `Theme` : formulaire dynamique, sauvegarde du YAML, déclenchement de la génération CSS.

## 6. Validation

- [x] 6.1 Tests : persistance Font et FontVariant ; écriture/suppression dans Flysystem pour custom.
- [x] 6.2 Tests : persistance Theme ; génération CSS à partir d’un YAML de test ; présence de la version dans le nom du fichier CSS.
