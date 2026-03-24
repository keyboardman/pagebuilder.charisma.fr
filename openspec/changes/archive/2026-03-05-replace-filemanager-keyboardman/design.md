# Design: File manager keyboardman (local + S3 MinIO, iframe builder)

## Context

- Projet : pagebuilder.charisma.fr (Symfony 8, React builder, médiathèque actuelle en React + API `/media/api/*`).
- Objectif : remplacer par [keyboardman/filemanager-bundle](https://github.com/keyboardman/filemanager-bundle) avec stockage **local** et **S3 (MinIO)** en dev, et dans le builder ouvrir le file manager en **iframe** avec une **URL absolue**, en récupérant la sélection via postMessage (URL absolue ou `filesystem:path` selon besoin).

## Goals / Non-Goals

- **Goals** : (1) Backend : filesystem-bundle + filemanager-bundle, config local + S3 (MinIO). (2) Page « Médias » = `/filemanager`. (3) Builder : picker = iframe chargée avec URL absolue du file manager ; réception de la sélection (path ou URL) via postMessage. (4) Option MinIO en local pour tester S3.
- **Non-Goals** : Ne pas modifier le format de contenu des pages (HTML/JSON) ; ne pas changer les APIs card du builder.

## Decisions

### 1. Stack backend

- **keyboardman/filesystem-bundle** : expose `/api/filesystem/*` (list, upload, rename, move, delete, create-directory). Déclare des filesystems (adapters Flysystem).
- **keyboardman/filemanager-bundle** : UI à `/filemanager`, consomme l’API filesystem ; option `url_route` pour résoudre `filesystem:path` en URL absolue ; picker = iframe + postMessage.
- **Adapters** : un filesystem **default** (local, ex. `public/media` ou `var/storage/media`) et un filesystem **s3** (MinIO en dev, même API pour prod S3). Le projet a déjà `league/flysystem` et un service `MediaStorage` / `media_storage.filesystem` ; on peut soit réutiliser cet adapter pour le filesystem `default`, soit définir un nouvel adapter pointant vers le même répertoire.

### 2. Local et S3 (MinIO)

- **Local** : filesystem nommé `default`, adapter `LocalFilesystemAdapter` vers `%kernel.project_dir%/public/media` (ou `var/storage/media` si on ne veut pas exposer directement).
- **S3 / MinIO** : filesystem nommé `s3`, adapter S3 (ex. `league/flysystem-aws-s3-v3` ou équivalent MinIO). En dev : `docker compose` avec service MinIO ; variables d’environnement pour endpoint, bucket, clés. Config bundle : `available_filesystems: ['default', 's3']`, `s3_filesystems: ['s3']`.
- **Route de service des fichiers** : une route applicative (ex. `app_media_file` ou dédiée) avec paramètres `filesystem` et `path` pour servir les fichiers (local = lecture du fichier, S3 = redirection ou URL pré-signée selon doc bundle). Cette route est configurée dans `keyboardman_filemanager.url_route` pour la résolution d’URL et le picker en mode URL absolue.

### 3. Builder : iframe avec URL absolue

- Le builder ne contient plus le composant React FileManager intégré (CustomService + list/upload) pour la médiathèque. À la place :
  - **Config** : le backend fournit une URL absolue du file manager en mode picker, ex. `filemanagerUrl: "https://.../filemanager"` (ou chemin absolu avec `app.request.schemeAndHttpHost` + path).
  - **Comportement** : au clic « Parcourir » / « Insérer image », le builder ouvre une modale contenant une **iframe** dont `src` est cette URL absolue.
  - **Sélection** : l’iframe (file manager bundle) envoie un message `keyboardman.filemanager.picked` (channel, path, filesystem). Le parent (builder) écoute ce message ; si on souhaite des **URLs absolues** dans le contenu, le parent appelle la route de résolution (ex. `/filemanager/resolve-url?filesystem=...&path=...`) ou le backend fournit déjà l’URL dans le message (selon capacité du bundle). Sinon on stocke `filesystem:path` et on résout côté serveur à l’affichage.
- **Valeur insérée** : objectif = « URLs absolues » dans le builder ; donc soit le picker est configuré en `value_type: url` côté formulaire (si on utilisait le FormType), soit le builder en iframe reçoit path + filesystem et le parent demande l’URL absolue via `/filemanager/resolve-url` puis insère cette URL dans le contenu.

### 4. Migration de l’existant

- **Routes** : supprimer ou rediriger `/media` et `/media/api/*` vers le nouveau système. Si on garde `public/media` comme stockage local, les anciennes URLs `/media/{path}` peuvent rester valides si on conserve une route qui sert `public/media/{path}` ; sinon, prévoir une redirection ou une période de compatibilité.
- **Assets** : supprimer l’entrypoint `fileManager` (page médias React) et le rendu React sur `/media`. Le lien « Médias » pointe vers `/filemanager` (page Twig/JS du bundle).
- **Builder** : ajouter un mode `iframe` (ou type `keyboardman`) dans la config filemanager : `{ type: 'iframe', filemanagerUrl: 'https://...' }`. Le composant qui ouvre le picker affiche une iframe au lieu d’utiliser CustomService/S3/base64.

## Risks / Trade-offs

- **CORS / origin** : l’iframe est sur le même origin si le file manager est servi par la même app ; pas de problème. Si un jour le file manager était sur un sous-domaine, il faudrait configurer postMessage et éventuellement CORS.
- **Compatibilité anciennes URLs** : les pages déjà éditées peuvent contenir des URLs `/media/...`. Il faut soit garder une route qui sert `public/media` en lecture, soit migrer les références vers la nouvelle route (filesystem + path) ou URLs résolues.
- **Double stockage** : pendant la transition, éviter d’avoir deux écritures (ancienne API `/media/api/upload` et nouvelle `/api/filesystem/upload`). Décider d’un cut-over et désactiver l’ancienne API après migration.

## Migration Plan

1. Installer filesystem-bundle + filemanager-bundle ; configurer filesystems default (local) et s3 (MinIO) ; exposer routes et `url_route`.
2. Ajouter MinIO dans docker-compose (optionnel) ; documenter les variables d’env.
3. Changer le lien « Médias » vers `/filemanager` ; supprimer ou rediriger `/media` (page) et désactiver les routes `/media/api/*` une fois le builder migré.
4. Adapter le builder : config `filemanager: { type: 'iframe', filemanagerUrl: '<absolute url>' }` ; composant picker = iframe ; listener postMessage ; résolution URL si besoin ; insérer URL absolue dans le contenu.
5. Mettre à jour AGENTS.md et tests manuels (local + MinIO, insertion image depuis le builder).

## Open Questions

- Le bundle filemanager expose-t-il un paramètre d’URL pour ouvrir directement en mode picker (query string) ? (Doc form-picker : picker_url = '/filemanager'.)
- Pour `value_type: url`, la résolution est faite côté serveur (resolve-url) ; le parent peut appeler cette route après réception de path/filesystem pour obtenir l’URL absolue à insérer.
