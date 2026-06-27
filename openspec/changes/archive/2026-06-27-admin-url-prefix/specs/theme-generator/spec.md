## ADDED Requirements

### Requirement: Service public du CSS de thème

Le système SHALL exposer une route publique `GET /assets/theme/{id}/css` (nom de route `app_theme_css` ou équivalent) servant le fichier CSS généré d'un thème. Cette route SHALL être distincte des routes d'administration sous `/admin/theme/*` et SHALL rester accessible sans authentification pour permettre le rendu public des pages et la preview admin.

#### Scenario: Chargement CSS sans authentification

- **WHEN** un visiteur non authentifié accède à `/assets/theme/{id}/css` pour un thème avec CSS généré
- **THEN** le contenu CSS est retourné avec `Content-Type: text/css` et le statut 200

#### Scenario: Thème sans CSS généré

- **WHEN** un client accède à `/assets/theme/{id}/css` pour un thème sans `generatedCssPath`
- **THEN** la réponse est 404

## MODIFIED Requirements

### Requirement: Édition des variables CSS du thème sur /theme/fonts

Le système SHALL permettre de gérer les variables CSS du thème (section `vars` du `theme.yaml`) depuis la page d'édition du thème (`/admin/theme/edit/{id}`), via une interface affichée sous le sélecteur de polices. L'interface SHALL afficher la liste des variables existantes sous la forme de paires `(nom, valeur)`, SHALL permettre d'ajouter une variable (nom commençant par `--`, valeur string), de modifier la valeur d'une variable existante et de supprimer une variable. Les modifications SHALL être propagées à la structure de données servant à générer le `theme.yaml` afin que le `ThemeCssGenerator` produise les variables correspondantes dans le bloc `:root { … }`.

#### Scenario: Gestion complète des variables sur l'édition de thème

- **WHEN** l'utilisateur ouvre la page `/admin/theme/edit/{id}` pour un Theme existant
- **THEN** sous le sélecteur de polices, une section « Variables du thème » affiche les variables actuelles (nom + valeur) et permet d'ajouter, modifier ou supprimer des variables ; à la sauvegarde, ces changements sont pris en compte dans la génération du `theme.yaml` et du CSS du thème

### Requirement: Initialisation avec des variables Tailwind CSS par défaut

Lorsque le Theme ne possède encore aucune configuration de variables (`vars` vide ou absent), le système SHALL initialiser la liste des variables exposées sur la page d'édition du thème (`/admin/theme/edit/{id}`) avec un ensemble de variables Tailwind CSS par défaut (par ex. couleurs de base et tailles de police, alignées avec la configuration Tailwind/DaisyUI du projet). Ces variables par défaut SHALL être modifiables et supprimables par l'utilisateur ; une fois persistées, elles SHALL être considérées comme faisant partie des `vars` du `theme.yaml` et utilisées par le `ThemeCssGenerator` pour alimenter le bloc `:root`.

#### Scenario: Pré-remplissage des variables à partir de Tailwind

- **WHEN** l'utilisateur ouvre la page `/admin/theme/edit/{id}` pour un Theme qui n'a encore aucune variable définie
- **THEN** la section « Variables du thème » est pré-remplie avec un ensemble de variables Tailwind CSS par défaut (par ex. couleurs et tailles de police courantes), que l'utilisateur peut ensuite personnaliser avant de sauvegarder

### Requirement: Duplication de thème depuis la liste

Le système SHALL permettre de dupliquer un thème existant depuis la liste d'administration (`/admin/theme`), sur le même modèle que la duplication de pages. L'action SHALL être exposée via une route `POST /admin/theme/duplicate/{id}` (nom de route `app_theme_duplicate` ou équivalent) protégée par un jeton CSRF. La copie SHALL recevoir une identité propre (id et slug uniques) et SHALL conserver la configuration visuelle du thème source (section `vars`, blocs typographiques, `node_overrides`, `custom_css`, icônes et références de polices).

Le nom du thème dupliqué SHALL être le nom source suffixé par « (copie) ». Le champ `nom` de la configuration SHALL être aligné sur ce nouveau nom. Les chemins `generatedYamlPath` et `generatedCssPath` du thème source SHALL NOT être recopiés : le système SHALL régénérer YAML et CSS dans `storage/themes/theme-{nouvel-id}/` après persistance.

Après duplication réussie, l'utilisateur SHALL être redirigé vers l'édition du thème dupliqué (`/admin/theme/edit/{id}`) afin d'ajuster la variante. Le thème source SHALL rester inchangé.

#### Scenario: Duplication depuis la liste

- **WHEN** l'utilisateur déclenche l'action « Dupliquer » sur un thème existant avec un jeton CSRF valide
- **THEN** un nouveau thème est créé avec un id distinct, un nom « {nom source} (copie) », un slug unique et une configuration équivalente à celle du thème source
- **AND** le YAML et le CSS sont générés dans le répertoire du nouveau thème
- **AND** l'utilisateur est redirigé vers la page d'édition du thème dupliqué

#### Scenario: Variante indépendante du thème source

- **WHEN** l'utilisateur modifie ou prévisualise le thème dupliqué
- **THEN** les changements n'affectent pas le thème source
- **AND** le thème dupliqué possède ses propres fichiers générés sous `storage/themes/theme-{id}/`

#### Scenario: Jeton CSRF invalide

- **WHEN** une requête de duplication est soumise avec un jeton CSRF invalide ou absent
- **THEN** aucun thème n'est créé
- **AND** l'utilisateur est redirigé vers la liste des thèmes avec un message d'erreur
