# Change: Ajouter un générateur de thèmes (Font + Theme)

## Why

Le pagebuilder doit permettre de définir des polices (native, Google, custom) et de générer des thèmes CSS à partir d’un schéma YAML. Les thèmes sont éditables via un formulaire dynamique et produisent un fichier CSS versionné pour le cache.

## What Changes

- **Nouvelle capacité font** : entité `Font` avec types `native`, `google`, `custom` ; champs obligatoires `name`, `type`, `fallback`, `slug` ; pour `google` un champ `googleFontUrl` ; pour `custom`, upload de variantes (poids, inclinaison, largeur, combinaisons) stockées via Flysystem dans `/storage/fonts/{slug}`.
- **Nouvelle capacité theme-generator** : entité `Theme` (`name`, chemin fichier YAML généré, chemin fichier CSS généré) ; schéma `theme.yaml` (nom, `vars`, `body`, `h1`–`h6`, `div`, `p`) ; formulaire généré dynamiquement à partir de ce schéma ; génération du CSS à partir du YAML ; CSS versionné (hash ou numéro de version dans le nom ou le contenu pour cache-busting).
- **Design** : choix d’architecture (Font, variantes custom, Flysystem, format theme.yaml, versioning CSS), dépendance `league/flysystem`.

## Impact

- Affected specs: **font** (nouvelle), **theme-generator** (nouvelle)
- Affected code: `src/Entity/`, `migrations/`, `composer.json` (league/flysystem), `config/`, `storage/fonts/`, contrôleurs et formulaires pour Font et Theme, service de génération CSS.
