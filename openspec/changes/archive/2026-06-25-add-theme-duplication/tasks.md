## 1. Backend

- [x] 1.1 Ajouter dans `ThemeController` une action `duplicate` (`POST /theme/duplicate/{id}`) qui crée un nouveau `Theme` à partir d'un thème existant.
- [x] 1.2 Copier la configuration (`config` / `ThemeConfigDTO`) en profondeur ; mettre à jour le nom dans l'entité et dans la config avec le suffixe « (copie) ».
- [x] 1.3 Générer un slug unique (même logique que la duplication de pages : base `{slug-source}-copie`, suffixe numérique si collision).
- [x] 1.4 Laisser `generatedYamlPath` et `generatedCssPath` vides à la création ; s'appuyer sur `ThemeCssGeneratorListener` pour produire les fichiers dans `storage/themes/theme-{nouvel-id}/`.
- [x] 1.5 Valider le jeton CSRF (`duplicate{id}`) et rediriger vers `app_theme_edit` avec un message flash de succès.

## 2. Interface

- [x] 2.1 Ajouter un bouton « Dupliquer » (formulaire POST + CSRF) dans `templates/theme/index.html.twig`, à côté des actions existantes.

## 3. Validation

- [x] 3.1 Ajouter un test fonctionnel couvrant la duplication (nouvel id, nom/slug, config identique à la source, chemins CSS régénérés distincts).
- [x] 3.2 Ajouter un test refusant une requête avec jeton CSRF invalide.
- [x] 3.3 Vérifier manuellement : dupliquer un thème, modifier la variante, prévisualiser via showcase sans impacter le thème source.
