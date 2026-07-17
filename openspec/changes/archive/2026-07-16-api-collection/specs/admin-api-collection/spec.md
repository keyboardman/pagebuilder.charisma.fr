## ADDED Requirements

### Requirement: CRUD admin des APIs collection

Le système SHALL fournir un CRUD admin pour les déclarations d’APIs collection, sous le préfixe `/admin/api-collection` (liste, création, édition, suppression avec CSRF), sur le même modèle que les autres CRUDs admin (Pages, Formulaires). Les routes SHALL utiliser un préfixe de nom cohérent (ex. `app_api_collection_*`).

#### Scenario: Liste des APIs

- **WHEN** un administrateur accède à `/admin/api-collection`
- **THEN** la liste affiche au minimum id, label, type, modes supportés et statut enabled, avec actions Modifier et Supprimer

#### Scenario: Création valide

- **WHEN** l’administrateur soumet un formulaire valide (id unique, label, type, au moins un mode, endpointUrl)
- **THEN** la définition est persistée et l’utilisateur est redirigé vers la liste ou l’édition

#### Scenario: Id en collision avec un adapter PHP

- **WHEN** l’administrateur tente de créer une définition dont l’`id` est déjà réservé par un adapter PHP
- **THEN** la validation échoue avec un message d’erreur explicite

### Requirement: Formulaire de déclaration (endpoint et modes)

Le formulaire de création/édition SHALL permettre de renseigner :

- `id` (slug, immutable après création si retenu par le design d’implémentation, sinon éditable avec contrainte d’unicité) ;
- `label`, `type` (`image` | `video` | `article`) ;
- `supportedModes` (au moins un parmi `fixed`, `dynamic`) ;
- `endpointUrl` ;
- optionnellement `itemUrlTemplate`, `queryParams`, `paginationStyle`, `memberPath`, `headers` ;
- `enabled` (booléen).

#### Scenario: Déclaration fixed article

- **WHEN** l’administrateur crée une API `type=article`, modes `[fixed]`, avec une URL Hydra valide
- **THEN** la définition enabled apparaît dans le catalogue builder `type=article&mode=fixed`

#### Scenario: Désactivation

- **WHEN** l’administrateur passe `enabled` à false
- **THEN** l’API disparaît du catalogue builder tout en restant visible dans la liste admin

### Requirement: Mapping de champs dans l’admin

Le formulaire SHALL exposer un mapping vers les champs standard ApiCollection : `id`, `image`, `title`, `description`, `label`, `labels`, `counter`, `like`, `link`, `alt`. Chaque entrée de mapping SHALL être un chemin source (notation pointée, ex. `visuel.url`) ou vide (champ non mappé).

#### Scenario: Mapping title et image

- **WHEN** l’administrateur mappe `title` → `titre` et `image` → `visuel.url` puis sauvegarde
- **THEN** le runtime utilise ces chemins pour produire les items mappés exposés au builder

#### Scenario: Champ non mappé

- **WHEN** le champ `like` est laissé vide dans le formulaire
- **THEN** les items générés n’incluent pas `like` (ou le laissent null)

### Requirement: Test de mapping depuis l’admin

L’écran d’édition SHALL permettre de **tester** la déclaration (bouton ou action dédiée) en récupérant une petite page d’items (ex. 1–3) via le runtime et en affichant le résultat mappé (succès) ou un message d’erreur (échec réseau / JSON / mapping).

#### Scenario: Test réussi

- **WHEN** l’administrateur clique sur « Tester » avec une configuration valide
- **THEN** l’UI affiche au moins un item mappé avec les champs renseignés

#### Scenario: Test en échec

- **WHEN** l’URL distante est invalide ou inaccessible
- **THEN** l’UI affiche une erreur explicite sans corrompre la définition sauvegardée

### Requirement: Entrée de navigation admin

Le layout admin SHALL exposer un lien de navigation vers la liste des APIs collection (ex. libellé « APIs collection ») pointant vers la route de liste.

#### Scenario: Lien sidebar visible

- **WHEN** un administrateur authentifié consulte l’admin
- **THEN** le menu latéral contient un lien vers `/admin/api-collection`
