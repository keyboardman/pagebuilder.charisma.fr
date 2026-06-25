# Change: Duplication de thème

## Why

Les éditeurs peuvent créer, modifier et prévisualiser des thèmes, mais doivent repartir de zéro pour tester une variante (couleurs, overrides, icônes). Dupliquer un thème depuis la liste permet d'explorer une variante sans risquer le thème source, sur le même modèle que la duplication de pages déjà en place.

## What Changes

- Ajout d'une action « Dupliquer » dans la liste des thèmes (`/theme`).
- Ajout d'une route backend `POST /theme/duplicate/{id}` (préfixe `app_theme_*`) protégée par jeton CSRF.
- La copie reçoit un identifiant propre, un nom suffixé « (copie) », un slug unique et une configuration clonée (vars, overrides, icônes, custom CSS, polices référencées).
- Régénération YAML/CSS dans un répertoire dédié `storage/themes/theme-{id}/` via le listener existant.
- Redirection vers l'édition du thème dupliqué pour ajuster la variante ; la prévisualisation reste accessible via la page showcase.

## Impact

- Affected specs: `theme-generator`
- Affected code: `ThemeController`, `templates/theme/index.html.twig`, tests fonctionnels du CRUD thème
