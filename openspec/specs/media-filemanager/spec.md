# media-filemanager Specification

## Purpose
TBD - created by archiving change add-media-filemanager. Update Purpose after archive.
## Requirements
### Requirement: Stockage des médias (images, vidéo, audio) avec Flysystem

Le système SHALL fournir un espace de stockage dédié aux fichiers multimédia (images, vidéo, audio) en s’appuyant sur **league/flysystem** (^3.x ou version supérieure), exposé via **keyboardman/filesystem-bundle** avec au moins deux filesystems nommés : un stockage **local** (ex. `default`, répertoire dédié type `public/media` ou équivalent) et un stockage **S3** (ex. MinIO en dev, S3 en prod). Ce stockage SHALL être distinct du stockage des polices custom (storage/fonts). Le système SHALL accepter les types MIME courants pour images (ex. image/*), vidéo (ex. video/*) et audio (ex. audio/*), selon la configuration du bundle.

#### Scenario: Stockage d’un fichier image
- **WHEN** un utilisateur uploade un fichier image (ex. PNG, JPEG) via le file manager (interface keyboardman)
- **THEN** le fichier est enregistré dans le stockage médias (filesystem local ou S3 selon choix) et reste accessible pour consultation et gestion

#### Scenario: Stockage de fichiers vidéo et audio
- **WHEN** un utilisateur uploade un fichier vidéo ou audio (ex. MP4, WebM, MP3, WAV) via le file manager
- **THEN** le fichier est enregistré dans le même filesystem choisi et reste accessible pour consultation et gestion

#### Scenario: Stockage S3 (MinIO) disponible en local
- **WHEN** l’environnement est configuré avec MinIO (ex. docker-compose) et un filesystem S3
- **THEN** l’utilisateur peut sélectionner le filesystem S3 dans le file manager et uploader / consulter des fichiers dans ce stockage

### Requirement: Lien dans le menu vers le file manager

Le système SHALL fournir un lien dans le menu principal de l'application (sidebar, `templates/base.html.twig`) permettant d'accéder au file manager (médiathèque). Ce lien SHALL être visible dans la même zone de navigation que les entrées existantes (Dashboard, Pages, Thèmes, Médias, Polices, Formulaires). Le lien SHALL pointer vers la route du file manager fournie par keyboardman/filemanager-bundle (URL `/filemanager`). L'accès au file manager SHALL requérir une authentification (hors exceptions publiques globales). L'état actif du lien (classe ou style « actif ») SHALL être cohérent lorsque la route courante est celle du file manager.

#### Scenario: Accès au file manager depuis le menu
- **WHEN** un utilisateur authentifié consulte une page du back-office sous `/admin`
- **THEN** il voit dans la sidebar un lien (ex. « Médias ») qui mène au file manager ; en cliquant dessus, il accède à la médiathèque à l'URL `/filemanager`

#### Scenario: État actif du lien menu sur la médiathèque
- **WHEN** l'utilisateur est sur la route du file manager
- **THEN** le lien « Médias » dans la sidebar est marqué actif

#### Scenario: Accès refusé sans authentification
- **WHEN** un visiteur non authentifié tente d'accéder à `/filemanager`
- **THEN** il est redirigé vers `/login`

### Requirement: File manager (médiathèque) via keyboardman/filemanager-bundle

Le système SHALL exposer une interface de type file manager (médiathèque) pour parcourir, uploader, organiser et gérer les médias (images, vidéo, audio). Cette interface SHALL être fournie par **keyboardman/filemanager-bundle**, qui consomme l’API **keyboardman/filesystem-bundle** (GET/POST sous `/api/filesystem/*`). L’interface SHALL être accessible à l’URL `/filemanager`. L’utilisateur SHALL pouvoir choisir le filesystem (local, S3), uploader des fichiers, naviguer dans les dossiers, créer des sous-dossiers, renommer des dossiers existants, et effectuer les actions de base (renommer, déplacer, supprimer). Le bundle SHALL exposer une route de résolution d’URL (ex. `/filemanager/resolve-url`) pour convertir une valeur `filesystem:path` en URL absolue de fichier.

#### Scenario: Accès à la médiathèque et upload
- **WHEN** un utilisateur accède à la page `/filemanager`
- **THEN** il voit la liste des médias existants, peut sélectionner le filesystem (default, s3), uploader de nouveaux fichiers (images, vidéo, audio) et organiser les contenus en dossiers

#### Scenario: Navigation et gestion des médias
- **WHEN** un utilisateur navigue dans la médiathèque
- **THEN** il peut ouvrir des dossiers, consulter les médias, et effectuer les actions de gestion (renommer, déplacer, supprimer) selon les capacités du bundle

#### Scenario: Création d’un sous-dossier dans la médiathèque
- **WHEN** un utilisateur crée un nouveau dossier depuis un dossier parent dans `/filemanager`
- **THEN** le sous-dossier est créé dans le filesystem sélectionné, visible immédiatement dans l’interface, et disponible pour y déposer des médias

#### Scenario: Renommage d’un dossier existant
- **WHEN** un utilisateur renomme un dossier existant depuis `/filemanager`
- **THEN** le dossier est affiché avec son nouveau nom dans l’interface, tout en conservant son contenu et son emplacement parent

