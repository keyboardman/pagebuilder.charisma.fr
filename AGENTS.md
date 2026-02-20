<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

## Stockage médias et file manager

- **Stockage** : les fichiers médias (images, vidéo, audio) sont gérés par **keyboardman/filesystem-bundle** avec Flysystem : filesystem **default** (local, `public/media`), optionnel **s3** (MinIO en dev, S3 en prod). L’API est exposée sous `/api/filesystem/*` (list, upload, rename, move, delete, create-directory).
- **Médiathèque** : interface fournie par **keyboardman/filemanager-bundle** à l’URL **`/filemanager`**. La route `/media` redirige vers `/filemanager`. Les fichiers sont servis via la route `app_filemanager_serve` (`/serve/{filesystem}/{path}`), configurée dans `keyboardman_filemanager.url_route`.
- **Menu** : le lien « Médias » dans la sidebar (`templates/base.html.twig`) pointe vers `/filemanager`.
- **Builder** : pour l’insertion d’images/médias, le builder ouvre le file manager en **iframe** (URL absolue fournie par le backend). La sélection est reçue via **postMessage** (`keyboardman.filemanager.picked`) ; l’URL absolue est obtenue via `/filemanager/resolve-url` puis insérée dans le contenu.