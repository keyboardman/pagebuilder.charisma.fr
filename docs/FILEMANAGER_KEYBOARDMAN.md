# File manager Keyboardman

Le projet utilise les bundles **keyboardman** pour le stockage et la médiathèque.

## État actuel

- **Dépendances** : `keyboardman/filesystem-bundle` et `keyboardman/filemanager-bundle` dans `composer.json`
- **Stockage** : Flysystem — filesystem `default` (local, `public/media`), optionnel `s3` (MinIO / AWS)
- **API** : `/api/filesystem/*` (list, upload, rename, move, delete, create-directory)
- **Interface** : `/filemanager` (bundle keyboardman)
- **Serving** : route `app_filemanager_serve` — `/serve/{filesystem}/{path}` (voir `keyboardman_filemanager.url_route`)

## Intégration builder

Le builder n’embarque pas de page médias React dédiée. Il ouvre le file manager en **iframe** :

1. URL absolue fournie par le backend (`filemanagerUrl` dans les données du builder)
2. Sélection reçue via **postMessage** : `keyboardman.filemanager.picked`
3. URL résolue via `/filemanager/resolve-url` puis insérée dans le contenu

Composants concernés : `FileManagerIframePicker`, `AppProvider` (`fileManagerConfig`).

## Legacy retiré

L’ancienne stack React (`fileManager` entrypoint, `MediaController`, `/media/api/*`, `MediaStorage`) a été supprimée au profit de keyboardman. Le lien « Médias » dans la sidebar (`templates/base.html.twig`) pointe vers `/filemanager`.

## Références

- Change archivé : `openspec/changes/archive/2026-03-05-replace-filemanager-keyboardman/`
- Spec : `openspec/specs/media-filemanager/spec.md`
