## MODIFIED Requirements

### Requirement: Intégration avec la médiathèque

Le builder SHALL permettre l'insertion d'images et de médias provenant de la médiathèque fournie par keyboardman/filemanager-bundle. Pour ce faire, le builder SHALL ouvrir le file manager dans une **iframe** dont l’URL est une **URL absolue** fournie par le backend (ex. `app.request.schemeAndHttpHost` + route du file manager). La communication entre la page parente (builder) et l’iframe SHALL s’effectuer via **postMessage** (événement `keyboardman.filemanager.picked` avec channel, path, filesystem). Après réception de la sélection, le builder SHALL obtenir l’**URL absolue** du fichier (via la route de résolution du bundle, ex. `/filemanager/resolve-url`) et insérer cette URL absolue dans le contenu (image ou média).

#### Scenario: Insertion d'une image depuis la médiathèque

- **WHEN** l'utilisateur insère une image dans le builder (ex. bouton « Insérer image »)
- **THEN** une modale s’ouvre contenant une iframe chargée avec l’URL absolue du file manager ; l’utilisateur parcourt la médiathèque, sélectionne une image ; le builder reçoit la sélection par postMessage, résout l’URL absolue et insère cette URL dans le contenu

#### Scenario: URL absolue insérée

- **WHEN** l'utilisateur choisit un fichier dans le file manager (iframe) et valide
- **THEN** l’URL insérée dans le contenu du builder est une URL absolue (ex. `https://.../serve/default/...` ou équivalent), de sorte que l’image ou le média s’affiche correctement en prévisualisation et en rendu sans ambiguïté de base

#### Scenario: Upload depuis le file manager en iframe

- **WHEN** l’utilisateur ouvre le file manager en iframe et uploade un nouveau fichier depuis l’interface du bundle
- **THEN** le fichier est envoyé via l’API du bundle (filesystem) ; l’utilisateur peut ensuite sélectionner ce fichier ; le builder reçoit la sélection et insère l’URL absolue résolue dans le contenu
