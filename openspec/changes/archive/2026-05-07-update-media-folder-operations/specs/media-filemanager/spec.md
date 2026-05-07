## MODIFIED Requirements
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
