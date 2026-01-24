# theme-generator Specification

## Purpose
TBD - created by archiving change add-theme-generator. Update Purpose after archive.
## Requirements
### Requirement: Entité Theme et chemins des fichiers générés

Le système SHALL fournir une entité `Theme` avec : `name` (string), `generatedYamlPath` (string, chemin du fichier YAML du thème généré), `generatedCssPath` (string, chemin du fichier CSS généré). Optionnellement `slug` pour identification et construction des chemins (ex. `storage/themes/{slug}/`). Les chemins SHALL pointer vers les fichiers produits par le générateur (YAML de config, CSS compilé).

#### Scenario: Création d’un Theme et enregistrement des chemins

- **WHEN** un Theme est créé et la génération YAML/CSS est exécutée
- **THEN** `generatedYamlPath` et `generatedCssPath` contiennent les chemins des fichiers produits ; les fichiers existent sur le disque (ou dans le stockage configuré)

#### Scenario: Mise à jour du chemin CSS après régénération

- **WHEN** le CSS d’un Theme est régénéré (versioning)
- **THEN** `generatedCssPath` est mis à jour avec le chemin du nouveau fichier CSS (incluant la version)

### Requirement: Format theme.yaml

Le système SHALL utiliser un fichier `theme.yaml` dont la structure SHALL inclure : `nom` (string) ; `vars` avec au moins `--color-white`, `--color-black`, `--color-blue`, `--color-yellow`, `--color-red` (couleurs hex) et `--font-size-base` (en px) ; des blocs `body`, `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `div`, `p`. Chaque bloc SHALL pouvoir contenir : `font-family`, `font-size`, `font-weight`, `line-height`, `background-color` (où pertinent), `padding`, `margin`. Les champs sont optionnels ; des valeurs par défaut peuvent être définies. Ce schéma SHALL servir de base au formulaire dynamique et à la génération CSS.

#### Scenario: Thème valide avec vars et body

- **WHEN** un theme.yaml contient `nom`, `vars` (couleurs + font-size-base) et `body` avec font-family, font-size, font-weight, line-height, background-color, padding, margin
- **THEN** le fichier est valide ; le générateur CSS peut produire `:root` et `body { … }`

#### Scenario: Blocs h1 à h6, div, p

- **WHEN** un theme.yaml contient les blocs h1, h2, h3, h4, h5, h6, div, p avec des sous-propriétés (font-family, font-size, etc.)
- **THEN** le générateur CSS produit les règles correspondantes pour ces sélecteurs

### Requirement: Formulaire dynamique à partir du schéma theme.yaml

Le système SHALL générer un formulaire d’édition de thème à partir de la structure du theme.yaml : sections pour `vars`, `body`, `h1`–`h6`, `div`, `p` ; types de champs adaptés (texte pour couleurs/font-family, nombre pour font-size/line-height, etc.). Le champ `font-family` SHALL pouvoir être lié à l’entité `Font` (sélection) ou accepter une chaîne libre. La soumission du formulaire SHALL produire une structure de données écrite dans le fichier YAML du thème (ou en base) et SHALL permettre de déclencher la génération CSS.

#### Scenario: Affichage du formulaire avec sections vars, body, h1–h6, div, p

- **WHEN** l’utilisateur ouvre l’édition d’un Theme
- **THEN** le formulaire affiche les sections vars, body, h1–h6, div, p avec les champs définis dans le schéma theme.yaml

#### Scenario: Sauvegarde et écriture du YAML

- **WHEN** l’utilisateur soumet le formulaire avec des valeurs valides
- **THEN** les données sont écrites dans le fichier theme.yaml (ou structure équivalente) à l’emplacement `generatedYamlPath` ; la génération CSS peut être déclenchée

### Requirement: Génération du CSS et versioning

Le système SHALL fournir un service (ex. `ThemeCssGenerator`) qui lit le theme.yaml (contenu ou chemin), génère un fichier CSS contenant : (1) des variables `:root` à partir de `vars` ; (2) des règles pour `body`, `h1`–`h6`, `div`, `p` à partir des blocs correspondants. Le fichier CSS généré SHALL être versionné : le nom du fichier SHALL inclure une version (hash ou timestamp) pour permettre le cache-busting (ex. `theme.abc123.css` ou `theme.v1737700000.css`). À chaque génération, le nouveau fichier est écrit et `Theme.generatedCssPath` SHALL être mis à jour pour refléter le chemin du fichier courant.

#### Scenario: Génération CSS à partir d’un theme.yaml

- **WHEN** le `ThemeCssGenerator` est invoqué avec un theme.yaml valide (vars, body, h1–h6, div, p)
- **THEN** un fichier CSS est produit avec `:root { … }` et les règles pour body, h1–h6, div, p ; le chemin de sortie contient une version dans le nom de fichier

#### Scenario: Mise à jour de generatedCssPath après génération

- **WHEN** une nouvelle version du CSS est générée pour un Theme
- **THEN** `Theme.generatedCssPath` est mis à jour avec le chemin du nouveau fichier ; l’ancien fichier peut être supprimé ou conservé selon la politique configurée

