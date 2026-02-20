## 1. Backend : bundles et configuration

- [x] 1.1 Ajouter les dépôts VCS (keyboardman/filesystem-bundle, keyboardman/filemanager-bundle) dans `composer.json` et installer les deux bundles ; enregistrer dans `config/bundles.php` et charger leurs routes (`/api/filesystem/*`, `/filemanager`, `/filemanager/resolve-url`).
- [x] 1.2 Configurer keyboardman_filesystem : filesystem **default** (adapter local vers `public/media` ou équivalent), filesystem **s3** (adapter S3/MinIO) ; configurer keyboardman_filemanager : `url_route`, `available_filesystems: ['default', 's3']`, `s3_filesystems: ['s3']`.
- [x] 1.3 Créer une route applicative qui sert un fichier par `filesystem` + `path` (lecture local, S3 = URL pré-signée ou redirection selon doc bundle) et la référencer dans `keyboardman_filemanager.url_route`.
- [x] 1.4 Ajouter un service MinIO dans `docker-compose.yml` (ou équivalent) et documenter les variables d’environnement pour S3/MinIO ; optionnel : script ou doc pour créer le bucket.

## 2. Médiathèque standalone

- [x] 2.1 Mettre à jour le lien « Médias » dans `templates/base.html.twig` pour pointer vers `/filemanager` (route du bundle) et adapter l’état actif du lien si le segment de route change.
- [x] 2.2 Désactiver ou supprimer la page `/media` actuelle (MediaController index, template `media/index.html.twig`, entrypoint `fileManager`) ; éventuellement rediriger `/media` vers `/filemanager`.

## 3. Désactivation de l’ancienne API médias

- [x] 3.1 Supprimer ou commenter les routes `/media/api/*` (list, upload, mkdir, delete, etc.) et le MediaController associé, une fois le builder migré vers l’iframe keyboardman. Si besoin de compatibilité temporaire, garder une redirection ou un proxy vers l’API filesystem.

## 4. Builder : iframe et URL absolue

- [x] 4.1 Exposer dans les données du builder (page d’édition / standalone) une URL **absolue** du file manager (ex. `filemanagerUrl: app.request.schemeAndHttpHost ~ path('...')`) pour le mode picker.
- [x] 4.2 Ajouter un type de config filemanager (ex. `iframe` ou `keyboardman`) avec `filemanagerUrl` ; lorsque ce type est utilisé, le composant d’insertion d’image/média ouvre une modale avec une **iframe** dont `src` est cette URL absolue.
- [x] 4.3 Implémenter l’écoute du message postMessage `keyboardman.filemanager.picked` (channel, path, filesystem) ; après réception, appeler si nécessaire la route de résolution (`/filemanager/resolve-url`) pour obtenir l’URL absolue et insérer cette URL dans le contenu du builder (image ou média).
- [x] 4.4 S’assurer que les URLs insérées dans le contenu sont des URLs absolues (pour affichage et preview sans ambiguïté de base).

## 5. Documentation et validation

- [x] 5.1 Mettre à jour AGENTS.md : stockage médias (Flysystem via filesystem-bundle, local + S3), file manager = keyboardman/filemanager-bundle à `/filemanager`, lien menu « Médias », intégration builder = iframe avec URL absolue et postMessage.
- [ ] 5.2 Tester en local : accès à `/filemanager`, bascule default/s3 (MinIO), upload et navigation ; ouvrir le builder, insérer une image via l’iframe, vérifier que l’URL insérée est absolue et que l’image s’affiche en prévisualisation.
