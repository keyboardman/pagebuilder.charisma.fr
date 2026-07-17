# admin-api-collection Specification

## Purpose

CRUD admin pour déclarer et gérer les APIs collection (métadonnées, endpoint distant, mapping de champs, activation, test de mapping).

## Requirements

### Requirement: CRUD admin des APIs collection

Le système SHALL fournir un CRUD admin pour les déclarations d’APIs collection, sous le préfixe `/admin/api-collection` (liste, création, édition, suppression avec CSRF), sur le même modèle que les autres CRUDs admin (Pages, Formulaires). Les routes SHALL utiliser un préfixe de nom cohérent (ex. `app_api_collection_*`).

#### Scenario: Liste des APIs

- **WHEN** un administrateur accède à `/admin/api-collection`
- **THEN** la liste affiche au minimum id, label, type, modes supportés et statut enabled, avec actions Modifier et Supprimer

#### Scenario: Création valide

- **WHEN** l’administrateur soumet un formulaire valide (id unique, label, type, au moins un mode, endpointUrl)
- **THEN** la définition est persistée et l’utilisateur est redirigé vers la liste ou l’édition

#### Scenario: Id en collision avec un adapter PHP

- **WHEN** l’administrateur tente de créer une définition dont l’`id` est déjà réservé par une API PHP existante
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

### Requirement: Formulaire structuré en sections lisibles

Le formulaire de création/édition d’une API collection SHALL présenter les champs en **sections distinctes**, chacune avec un titre visible et une courte description si utile. Les sections SHALL au minimum couvrir :

1. **Identité** — apiId, libellé, type, modes supportés, activation ;
2. **Source HTTP** — URL collection, template item, préfixe image, query params, headers ;
3. **Pagination & parsing** — style de pagination, chemin liste (memberPath) ;
4. **Mapping des champs** — chemins pointés vers les champs standard ApiCollection.

Le rendu SHALL suivre le pattern admin existant (cartes / blocs séparés), et non une liste plate unique de tous les champs.

#### Scenario: Création — sections visibles

- **WHEN** un administrateur ouvre `/admin/api-collection/new`
- **THEN** le formulaire affiche au moins les quatre sections ci-dessus avec leurs titres, et les champs d’identité ne sont pas mélangés visuellement avec le mapping

#### Scenario: Édition — même structure

- **WHEN** un administrateur ouvre l’édition d’une définition existante
- **THEN** le formulaire conserve la même structure en sections, et le bloc « Tester le mapping » reste distinct du formulaire principal

#### Scenario: Contenu métier inchangé

- **WHEN** l’administrateur remplit et soumet un formulaire valide après la refonte UI
- **THEN** tous les champs existants (identité, endpoint, pagination, mapping, enabled) restent disponibles et persistés comme avant

### Requirement: Définitions seedées éditables dans l’admin

Après application de la migration de seed, l’admin `/admin/api-collection` SHALL lister les définitions importées comme toute autre déclaration. L’administrateur SHALL pouvoir les modifier (label, mapping, enabled, etc.) sans que la re-exécution de la migration n’écrase ces modifications.

#### Scenario: Liste admin après seed

- **WHEN** un administrateur ouvre `/admin/api-collection` après la migration de seed
- **THEN** les `api_id` seedés (ex. `charisma_article_enaction_home`, `flashnews_article`) apparaissent dans la liste avec type, modes et statut enabled

#### Scenario: Édition post-seed préservée

- **WHEN** l’administrateur modifie le label d’une définition seedée puis que la migration de seed est ré-exécutée (ou un environnement déjà peuplé)
- **THEN** le label modifié est conservé (insert idempotent sans overwrite)
