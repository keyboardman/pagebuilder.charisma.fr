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

Le système SHALL fournir un service (ex. `ThemeCssGenerator`) qui lit le theme.yaml (contenu ou chemin), génère un fichier CSS contenant : (1) des variables `:root` à partir de `vars` ; (2) des règles pour `body`, `h1`–`h6`, `div`, `p` à partir des blocs correspondants.

Le système SHALL aussi composer le CSS final du thème à partir d'un **socle CSS de base du builder** et des personnalisations ThemeBuilder (overrides), dans un ordre déterministe **base puis overrides**.

Le socle CSS SHALL couvrir tous les nodes enregistrés dans le builder (via le registre des nodes) afin que chaque node dispose d'un style de base modifiable. Lorsqu'un node n'a pas d'override spécifique, le style de base SHALL rester applicable comme fallback.

Le fichier CSS généré SHALL être versionné : le nom du fichier SHALL inclure une version (hash ou timestamp) pour permettre le cache-busting (ex. `theme.abc123.css` ou `theme.v1737700000.css`). À chaque génération, le nouveau fichier est écrit et `Theme.generatedCssPath` SHALL être mis à jour pour refléter le chemin du fichier courant.

#### Scenario: Génération CSS composée base + overrides
- **WHEN** le `ThemeCssGenerator` est invoqué avec un theme.yaml valide et une configuration ThemeBuilder contenant des overrides
- **THEN** le CSS final inclut le socle de base du builder puis les overrides du thème dans cet ordre
- **AND** le fichier de sortie est versionné

#### Scenario: Fallback du style de base sans override
- **WHEN** un node du builder ne possède pas d'override dans la configuration du thème
- **THEN** le style provenant du socle CSS de base reste appliqué pour ce node dans le CSS final

#### Scenario: Mise à jour de generatedCssPath après génération
- **WHEN** une nouvelle version du CSS est générée pour un Theme
- **THEN** `Theme.generatedCssPath` est mis à jour avec le chemin du nouveau fichier ; l’ancien fichier peut être supprimé ou conservé selon la politique configurée

### Requirement: Édition des variables CSS du thème sur /theme/fonts

Le système SHALL permettre de gérer les variables CSS du thème (section `vars` du `theme.yaml`) depuis la page `/theme/fonts`, via une interface affichée sous le sélecteur de polices. L’interface SHALL afficher la liste des variables existantes sous la forme de paires `(nom, valeur)`, SHALL permettre d’ajouter une variable (nom commençant par `--`, valeur string), de modifier la valeur d’une variable existante et de supprimer une variable. Les modifications SHALL être propagées à la structure de données servant à générer le `theme.yaml` afin que le `ThemeCssGenerator` produise les variables correspondantes dans le bloc `:root { … }`.

#### Scenario: Gestion complète des variables sur /theme/fonts
- **WHEN** l’utilisateur ouvre la page `/theme/fonts` pour un Theme existant
- **THEN** sous le sélecteur de polices, une section « Variables du thème » affiche les variables actuelles (nom + valeur) et permet d’ajouter, modifier ou supprimer des variables ; à la sauvegarde, ces changements sont pris en compte dans la génération du `theme.yaml` et du CSS du thème

### Requirement: Initialisation avec des variables Tailwind CSS par défaut

Lorsque le Theme ne possède encore aucune configuration de variables (`vars` vide ou absent), le système SHALL initialiser la liste des variables exposées sur `/theme/fonts` avec un ensemble de variables Tailwind CSS par défaut (par ex. couleurs de base et tailles de police, alignées avec la configuration Tailwind/DaisyUI du projet). Ces variables par défaut SHALL être modifiables et supprimables par l’utilisateur ; une fois persistées, elles SHALL être considérées comme faisant partie des `vars` du `theme.yaml` et utilisées par le `ThemeCssGenerator` pour alimenter le bloc `:root`.

#### Scenario: Pré-remplissage des variables à partir de Tailwind
- **WHEN** l’utilisateur ouvre la page `/theme/fonts` pour un Theme qui n’a encore aucune variable définie
- **THEN** la section « Variables du thème » est pré-remplie avec un ensemble de variables Tailwind CSS par défaut (par ex. couleurs et tailles de police courantes), que l’utilisateur peut ensuite personnaliser avant de sauvegarder

