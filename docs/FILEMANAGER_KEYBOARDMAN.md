# File manager Keyboardman (optionnel)

Le change OpenSpec `replace-filemanager-keyboardman` prévoit d’utiliser [keyboardman/filemanager-bundle](https://github.com/keyboardman/filemanager-bundle) et [keyboardman/filesystem-bundle](https://github.com/keyboardman/filesystem-bundle). Les bundles officiels exigent **Symfony ^6.4|^7.0**, alors que ce projet est en **Symfony 8.0**. Ils ne sont donc pas dans `composer.json` pour l’instant, afin que `composer install` fonctionne.

## Réactiver les bundles (quand Symfony 8 sera supporté)

1. **Ajouter les dépendances** dans `composer.json` (section `require`) :
   ```json
   "keyboardman/filesystem-bundle": "dev-main@dev",
   "keyboardman/filemanager-bundle": "dev-main@dev"
   ```
   Les dépôts VCS sont déjà déclarés dans `repositories`.

2. **Mettre à jour le lock file** (avec PHP 8.4 recommandé) :
   ```bash
   composer update keyboardman/filesystem-bundle keyboardman/filemanager-bundle --with-all-dependencies
   ```

3. **Réactiver l’intégration** dans le projet :
   - Dans `config/bundles.php` : ajouter `Keyboardman\FilesystemBundle\KeyboardmanFilesystemBundle::class` et `Keyboardman\FilemanagerBundle\KeyboardmanFilemanagerBundle::class`.
   - Dans `config/routes.yaml` : réimporter les routes des deux bundles (voir `openspec/changes/replace-filemanager-keyboardman/`).
   - Recréer le contrôleur `App\Controller\FilemanagerServeController` (route `app_filemanager_serve`, voir proposition du change).
   - Dans `templates/base.html.twig` : lier « Médias » à `path('keyboardman_filemanager')`.
   - Dans `templates/page/builder.html.twig` : réajouter `filemanagerUrl` dans les données JSON du builder.
   - Adapter ou supprimer les routes/actions média dans `MediaController` selon la proposition (redirection `/media` → `/filemanager`, suppression des routes `/media/api/*`).

## Utiliser un fork compatible Symfony 8

Si vous maintenez (ou trouvez) un fork des bundles compatible avec Symfony ^8.0 :

1. Dans `composer.json`, remplacer les URLs des dépôts par celles de vos forks.
2. Exécuter `composer update keyboardman/filesystem-bundle keyboardman/filemanager-bundle`.
3. Appliquer les étapes 3 ci‑dessus pour réactiver l’intégration.
