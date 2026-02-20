# Change: Remplacer le file manager actuel par keyboardman/filemanager-bundle

## Why

Remplacer l’interface file manager custom actuelle (React shadcn, API `/media/api/*`) par le bundle [keyboardman/filemanager-bundle](https://github.com/keyboardman/filemanager-bundle), qui s’appuie sur [keyboardman/filesystem-bundle](https://github.com/keyboardman/filesystem-bundle). Cela permet d’avoir une médiathèque unifiée (local + S3/MinIO), une UI maintenue par le bundle, et dans le builder d’ouvrir le file manager en iframe via une **URL absolue** pour choisir des fichiers et récupérer des URLs absolues.

## What Changes

- **Backend** : installer et configurer `keyboardman/filesystem-bundle` et `keyboardman/filemanager-bundle` ; configurer le stockage **local** (ex. `public/media` ou équivalent) et un filesystem **S3** (MinIO en local) ; exposer l’API sous `/api/filesystem/*` et l’interface sous `/filemanager` ; route de résolution d’URL pour `filesystem:path` → URL absolue.
- **Médiathèque standalone** : la page « Médias » du menu pointe vers `/filemanager` (interface du bundle) à la place de l’actuelle page React `/media`.
- **Builder** : au lieu du file manager React intégré (CustomService, appels directs à `/media/api/*`), le builder ouvre le file manager en **iframe** en passant une **URL absolue** (ex. `{{ app.request.schemeAndHttpHost }}{{ path('keyboardman_filemanager_index') }}` ou équivalent) ; communication parent ↔ iframe via postMessage (`keyboardman.filemanager.picked`) pour récupérer le fichier sélectionné (path ou URL absolue selon configuration).
- **Suppression / migration** : retirer ou désactiver l’ancien MediaController (routes `/media`, `/media/api/*`), l’entrypoint `fileManager` et le composant React de la page `/media` ; conserver le stockage Flysystem existant en le branchant sur le filesystem-bundle si possible, ou migrer les fichiers vers le nouveau stockage.
- **Documentation** : mettre à jour AGENTS.md (stockage médias, file manager = keyboardman, lien menu, intégration builder iframe + URL absolue).

## Impact

- **Affected specs** : `media-filemanager`, `page-builder`
- **Affected code** :
  - `config/` (bundles, routes, packages keyboardman_filemanager, keyboardman_filesystem, MinIO/S3)
  - `composer.json` (dépôts VCS, require keyboardman/filemanager-bundle, keyboardman/filesystem-bundle)
  - `templates/base.html.twig` (lien Médias → `/filemanager`)
  - `templates/media/` (suppression ou redirection vers `/filemanager`)
  - `src/Controller/MediaController.php` (suppression ou déléguer au bundle)
  - `assets/` : entrypoint fileManager, composants FileManager React (page médias) ; builder : config filemanager en mode « iframe + URL absolue », écoute postMessage
  - `docker-compose` ou équivalent pour MinIO (optionnel en dev)
  - AGENTS.md
