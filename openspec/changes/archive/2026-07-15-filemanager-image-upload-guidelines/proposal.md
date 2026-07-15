# Change: Mémo de conventions d'upload d'images dans le file manager

## Why

Les éditeurs et contributeurs uploadent des images dans la médiathèque sans référence centralisée sur les tailles, formats et conventions attendus pour l'optimisation du site. Les bonnes pratiques (dimensions max, formats recommandés, nommage, poids cible) ne sont documentées nulle part dans l'interface ; il faut les retenir ou les retrouver ailleurs, ce qui entraîne des fichiers trop lourds, mal dimensionnés ou incohérents avec le rendu page builder.

Un petit mémo visible directement dans le file manager (`/filemanager`) permet de rappeler en permanence ce qui est attendu, même après plusieurs mois sans y revenir.

## What Changes

- Ajouter un panneau discret « Conventions médias » dans l'interface `/filemanager`, visible en permanence (sidebar ou zone sous la dropzone), avec un texte court et structuré.
- Centraliser le contenu des conventions dans un fichier de configuration applicatif (YAML) pour pouvoir les ajuster sans toucher aux templates.
- Couvrir au minimum : formats recommandés (WebP/JPEG/PNG), dimensions cibles par usage (hero, carte, vignette, etc.), poids maximal conseillé, conventions de nommage et rappels d'optimisation (compression, ratio, éviter les PNG pour photos).
- Surcharger les templates Twig du bundle `keyboardman/filemanager-bundle` pour injecter ce mémo sans modifier le bundle vendor.
- Le mémo reste visible en mode standalone (`/filemanager`) et en mode iframe (picker du builder).

## Capabilities

### New Capabilities

_Aucune — extension de la capacité médiathèque existante._

### Modified Capabilities

- `media-filemanager`: ajout d'un mémo de conventions d'upload d'images (et médias associés) affiché dans l'interface file manager, alimenté par configuration projet.

## Impact

- Affected specs: `media-filemanager`
- Affected code:
  - `config/packages/keyboardman_filemanager.yaml` (ou fichier dédié importé) — contenu des guidelines
  - `templates/bundles/KeyboardmanFilemanagerBundle/` — surcharge Twig (sidebar et/ou dropzone)
  - Service ou paramètre Symfony pour exposer les guidelines aux templates
  - `AGENTS.md` — mention du mémo et de l'emplacement de la configuration
