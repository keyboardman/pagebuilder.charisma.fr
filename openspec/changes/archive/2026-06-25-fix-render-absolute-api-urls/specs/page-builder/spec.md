## ADDED Requirements

### Requirement: URL API absolue en preview et rendu public

Lors du chargement de la **preview admin** ou du **rendu public** d’une page (entrypoint `pagePreview`), le système SHALL injecter une **URL absolue** pour la base API page-builder (ex. `https://pagebuilder.example/api/page-builder`) dans les données passées au frontend (attribut `data-api-cards-base-url` ou équivalent). Les appels HTTP effectués par `registerBackendApis` et les adaptateurs card (`fetchCollection`, `fetchItem`, `fetchCategories`) SHALL cibler cet hôte, de sorte que le rendu fonctionne lorsque la page est affichée depuis un autre domaine, un reverse proxy ou une iframe sans réécrire l’origine des requêtes vers le site hôte.

Le post-traitement serveur du HTML de rendu public (`PageController::renderPageContent` ou équivalent) SHALL absolutiser les attributs `data-*` contenant des chemins relatifs vers l’API page-builder, de la même manière que les attributs `href` et `src` déjà traités.

#### Scenario: Rendu public avec URL API absolue

- **WHEN** un client charge la route GET de rendu public d’une page existante
- **THEN** le HTML renvoyé contient `data-api-cards-base-url` avec une URL absolue pointant vers `/api/page-builder` sur l’hôte du page builder (schéma + host + chemin)

#### Scenario: Appels API depuis une intégration cross-site

- **WHEN** la page de rendu est affichée dans un contexte où l’origine visible diffère de celle du page builder (iframe, reverse proxy, domaine tiers)
- **THEN** les requêtes réseau déclenchées par `pagePreview` vers la liste des cards et les collections/items utilisent l’URL absolue du page builder et non un chemin relatif résolu contre l’origine du site hôte

#### Scenario: Preview admin alignée sur le rendu public

- **WHEN** un éditeur authentifié ouvre la preview admin d’une page contenant des nœuds consommateurs d’API card
- **THEN** `data-api-cards-base-url` est également une URL absolue, avec le même format que sur le rendu public
