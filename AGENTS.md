
## Stockage médias et file manager

- **Stockage** : les fichiers médias (images, vidéo, audio) sont gérés par **keyboardman/filesystem-bundle** avec Flysystem : filesystem **default** (local, `public/media`), optionnel **s3** (MinIO en dev, S3 en prod). L’API est exposée sous `/api/filesystem/*` (list, upload, rename, move, delete, create-directory).
- **Médiathèque** : interface fournie par **keyboardman/filemanager-bundle** à l’URL **`/filemanager`**. Les fichiers sont servis via la route `app_filemanager_serve` (`/serve/{filesystem}/{path}`), configurée dans `keyboardman_filemanager.url_route`.
- **Conventions d’upload** : un mémo « Conventions médias » est affiché sur la **liste des pages** (`/admin/page`, template `templates/page/index.html.twig`). Le contenu est configurable dans **`config/packages/media_upload_guidelines.yaml`** (paramètre `app.media_upload_guidelines`, global Twig `media_upload_guidelines`). Recommandations indicatives uniquement — les uploads ne sont pas bloqués si non respectées.
- **Menu** : le lien « Médias » dans la sidebar (`templates/base.html.twig`) pointe vers `/filemanager`.
- **Builder** : pour l’insertion d’images/médias, le builder ouvre le file manager en **iframe** (URL absolue fournie par le backend). La sélection est reçue via **postMessage** (`keyboardman.filemanager.picked`) ; l’URL absolue est obtenue via `/filemanager/resolve-url` puis insérée dans le contenu.
