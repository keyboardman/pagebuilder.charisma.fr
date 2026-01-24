# Design: Générateur de thèmes (Font + Theme)

## Context

- Symfony 8, Doctrine ORM, PostgreSQL. Aucune entité métier existante dans `src/Entity/`.
- Besoin de polices réutilisables (natives, Google, custom) et de thèmes CSS produits à partir d’un fichier YAML, avec formulaire dynamique et CSS versionné.

## Goals / Non-Goals

- **Goals** : entité Font (3 types, variantes pour custom, stockage Flysystem) ; entité Theme et format theme.yaml ; formulaire construit depuis le schéma YAML ; génération et versioning du CSS.
- **Non-Goals** : éditeur WYSIWYG, prévisualisation en temps réel, support de polices variables (variable fonts) dans ce change.

## Decisions

### 1. Entité Font

- **Types** : `native` (aucun fichier/URL), `google` (champ `googleFontUrl`), `custom` (fichiers uploadés).
- **Champs obligatoires** : `name`, `type` (enum), `fallback` (chaîne, ex. `sans-serif`), `slug` (unique, pour chemins et URLs).
- **Variantes custom** : une entité `FontVariant` (ou table `font_variant`) liée à `Font` : `weight` (thin|extra_light|light|regular|medium|semi_bold|bold|extra_bold|black), `style` (normal|italic|oblique), `width` (normal|condensed|expanded|extra_condensed|extra_expanded), `path` (chemin relatif dans le Filesystem, ex. `{slug}/Regular.woff2`). Combinaisons possibles (ex. `bold`+`italic` → un enregistrement `weight=bold, style=italic, width=normal`). Chaque upload produit un enregistrement avec les métadonnées de variante et le `path` du fichier.
- **Stockage custom** : `league/flysystem` avec `LocalFilesystemAdapter` pointant vers `%kernel.project_dir%/storage/fonts`. Le préfixe par police est `{slug}/`. Un service `FontStorage` (ou `FontFilesystem`) encapsule l’accès et l’écriture.

### 2. Entité Theme

- **Champs** : `name`, `slug` (optionnel, pour identification), `generatedYamlPath` (chemin relatif ou absolu du YAML généré, ex. `storage/themes/{slug}/theme.yaml`), `generatedCssPath` (idem pour le CSS, ex. `storage/themes/{slug}/theme.{version}.css`).
- **Format theme.yaml** (schéma cible) :
  - `nom` : string
  - `vars` : `--color-white`, `--color-black`, `--color-blue`, `--color-yellow`, `--color-red` (hex), `--font-size-base` (px)
  - `body`, `h1`–`h6`, `div`, `p` : chaque bloc avec `font-family`, `font-size`, `font-weight`, `line-height`, `background-color` (si pertinent), `padding`, `margin`. Tous les sous-champs sont optionnels dans le schéma ; le formulaire peut les proposer avec des valeurs par défaut.

### 3. Formulaire dynamique

- Un `ThemeFormType` (ou builder) lit le schéma theme.yaml (fichier de référence ou structure codée en dur pour la v1) et construit un `FormBuilder` : sections vars, body, h1–h6, div, p ; champs text, choice, number selon le type. `font-family` peut être un `EntityType` vers `Font` ou une chaîne libre.
- Le schéma YAML sert de « contrat » ; une première version peut être un tableau PHP/YAML codé en dur, une évolution ultérieure peut charger un YAML externe.

### 4. Génération CSS

- Service `ThemeCssGenerator` : entrée = contenu ou chemin du theme.yaml ; sortie = CSS (variables `:root` + règles `body`, `h1`–`h6`, `div`, `p`). Le fichier est écrit dans `generatedCssPath`.
- **Versioning** : le nom du fichier CSS inclut une version (ex. `theme.{hash}.css` ou `theme.v{timestamp}.css`) pour cache-busting. `Theme.generatedCssPath` stocke le chemin du fichier courant (avec la version). À chaque régénération, on recalcule la version, on écrit un nouveau fichier et on met à jour `generatedCssPath`. L’ancien fichier peut être supprimé ou gardé selon une politique (v1 : suppression de l’ancien).

### 5. Dépendances

- **league/flysystem** : `league/flysystem` + `League\Flysystem\Local\LocalFilesystemAdapter` pour `storage/fonts`. Pas d’obligation d’utiliser `league/flysystem-bundle` dans ce change ; un service manuel peut suffire.

## Risks / Trade-offs

- **Volume de variantes custom** : beaucoup de combinaisons poids × style × largeur. Mitigation : on ne crée des enregistrements que pour les variantes effectivement uploadées ; le formulaire d’upload limite les choix aux valeurs du spec.
- **Synchronisation YAML / CSS** : si on édite le YAML à la main, le CSS doit être régénéré. Mitigation : considérer le formulaire comme source principale ; une commande ou un listener peut régénérer le CSS à la sauvegarde du thème.

## Migration Plan

1. Ajouter `league/flysystem` dans `composer.json` ; créer `storage/fonts` et `storage/themes` (avec `.gitignore` pour les binaires si besoin).
2. Migrations : tables `font`, `font_variant`, `theme`.
3. Entités, services (FontStorage, ThemeCssGenerator), formulaire dynamique, contrôleurs.
4. Tests : persistance Font/Theme, écriture Flysystem, génération CSS.

## Open Questions

- Politique de rétention des anciens fichiers CSS versionnés : supprimer l’ancien à chaque génération ou garder N dernières versions ?
- Faut-il un `slug` obligatoire sur `Theme` pour les chemins `storage/themes/{slug}/` ?
