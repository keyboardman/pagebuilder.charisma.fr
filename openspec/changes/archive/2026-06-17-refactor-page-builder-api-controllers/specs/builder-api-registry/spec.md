## MODIFIED Requirements
### Requirement: Endpoints HTTP pour le builder (liste, collection, item)

Le systeme SHALL exposer des endpoints HTTP permettant au builder de recuperer la liste des APIs card et les donnees (collection paginee, item) pour chaque API. Au minimum : `GET` liste des cards (reponse JSON : id, label, type, category) ; `GET` collection pour une API donnee (parametres de requete : page, limit, search, sort, category) ; `GET` item par API et ID d’item. Optionnellement : `GET` categories pour une API. Les reponses SHALL etre en JSON. Les endpoints SHALL etre proteges avec la meme politique d’acces que l’edition de pages.

L’implementation Symfony de ces endpoints SHALL etre organisee dans un repertoire dedie `src/Controller/Api/` avec une separation par responsabilite fonctionnelle (ex. cards APIs, polices, catalogue de formulaires), plutot qu’un controller unique regroupant tous les domaines.

La restructuration SHALL conserver strictement les routes publiques existantes du builder (`/page-builder/api/*`), les parametres supportes, les payloads JSON et les statuts HTTP attendus.

#### Scenario: Recuperation de la liste des APIs depuis le frontend

- **WHEN** le builder ou la page d’edition appelle l’endpoint de liste des APIs (authentifie comme pour l’edition de page)
- **THEN** la reponse JSON contient un tableau d’objets avec id, label, type et optionnellement category pour chaque API enregistree

#### Scenario: Recuperation d’une collection paginee pour une API

- **WHEN** le frontend appelle l’endpoint de collection pour un identifiant d’API valide avec page, limit et optionnellement search, sort, category
- **THEN** le serveur delegue a l’implementation ApiCard correspondante et retourne un JSON du type `{ items: [...], total: number }`, les items etant au format mappe (id, title, description, image, etc.)

#### Scenario: Recuperation d’un item par ID

- **WHEN** le frontend appelle l’endpoint item pour un identifiant d’API et un identifiant d’item valides
- **THEN** le serveur delegue a l’implementation ApiCard et retourne l’item au format mappe en JSON

#### Scenario: Responsabilites separees dans Controller Api

- **WHEN** un developpeur inspecte le code backend des endpoints builder API
- **THEN** les actions sont reparties dans des controllers specialises sous `src/Controller/Api/` selon leur domaine fonctionnel
- **AND** aucun endpoint `/page-builder/api/*` n’est perdu ou renomme uniquement a cause de cette refactorisation
