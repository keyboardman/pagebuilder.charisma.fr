## ADDED Requirements

### Requirement: Stockage des médias (images, vidéo, audio) avec Flysystem

Le système SHALL fournir un espace de stockage dédié aux fichiers multimédia (images, vidéo, audio) en s’appuyant sur **league/flysystem** (^3.x ou version supérieure). Ce stockage SHALL être distinct du stockage des polices custom (storage/fonts). Les fichiers SHALL être stockés dans un répertoire dédié (ex. `storage/media` ou équivalent). Le système SHALL accepter les types MIME courants pour images (ex. image/*), vidéo (ex. video/*) et audio (ex. audio/*), selon la configuration du bundle de gestion des médias.

#### Scenario: Stockage d’un fichier image
- **WHEN** un utilisateur uploade un fichier image (ex. PNG, JPEG) via le file manager
- **THEN** le fichier est enregistré dans le stockage médias (Flysystem) et reste accessible pour consultation et gestion

#### Scenario: Stockage de fichiers vidéo et audio
- **WHEN** un utilisateur uploade un fichier vidéo ou audio (ex. MP4, WebM, MP3, WAV) via le file manager
- **THEN** le fichier est enregistré dans le même stockage médias et reste accessible pour consultation et gestion

### Requirement: File manager (médiathèque) via JoliCode MediaBundle

Le système SHALL exposer une interface de type file manager (médiathèque) pour parcourir, uploader, organiser et gérer les médias (images, vidéo, audio). Cette interface SHALL être fournie par **jolicode/media-bundle**, en utilisant son intégration avec EasyAdmin (media library : vue grille/liste, dossiers, CRUD). L’utilisateur SHALL pouvoir uploader des fichiers, naviguer dans les dossiers, créer des sous-dossiers, et effectuer les actions de base (consultation, suppression, renommage si supporté par le bundle).

#### Scenario: Accès à la médiathèque et upload
- **WHEN** un utilisateur accède à la page du file manager (médiathèque)
- **THEN** il voit la liste ou la grille des médias existants et peut uploader de nouveaux fichiers (images, vidéo, audio) et organiser les contenus en dossiers

#### Scenario: Navigation et gestion des médias
- **WHEN** un utilisateur navigue dans la médiathèque
- **THEN** il peut ouvrir des dossiers, consulter les médias, et effectuer les actions de gestion (ex. suppression) selon les capacités du bundle

### Requirement: Lien dans le menu vers le file manager

Le système SHALL fournir un lien dans le menu principal de l’application (sidebar, `templates/base.html.twig`) permettant d’accéder au file manager (médiathèque). Ce lien SHALL être visible dans la même zone de navigation que les entrées existantes (Dashboard, Polices, Thèmes, Présentation). Le lien SHALL pointer vers la route de la médiathèque (définie par JoliCode MediaBundle / EasyAdmin). L’état actif du lien (classe ou style « actif ») SHALL être cohérent lorsque la route courante est celle du file manager.

#### Scenario: Accès au file manager depuis le menu
- **WHEN** un utilisateur consulte n’importe quelle page de l’application
- **THEN** il voit dans la sidebar un lien (ex. « Médias » ou « Fichiers ») qui mène au file manager ; en cliquant dessus, il accède à la médiathèque

#### Scenario: État actif du lien menu sur la médiathèque
- **WHEN** un utilisateur est sur la page du file manager (médiathèque)
- **THEN** le lien correspondant dans la sidebar est marqué comme actif (même convention que les autres entrées du menu)
