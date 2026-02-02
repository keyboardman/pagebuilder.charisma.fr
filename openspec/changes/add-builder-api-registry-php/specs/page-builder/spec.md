# page-builder (delta)

## ADDED Requirements

### Requirement: APIs card fournies par Symfony et disponibles dans le builder

Le builder SHALL consommer les APIs « card » exposées par Symfony (voir capacité `builder-api-registry`) plutôt que de dépendre uniquement d’un enregistrement côté JavaScript. Au chargement du builder (page standalone ou formulaire d’édition), la liste des APIs disponibles SHALL être obtenue depuis le backend (injection dans les données de la page ou appel à l’endpoint de liste). Le builder SHALL utiliser les endpoints backend pour récupérer les collections et les items (fetchCollection, fetchItem) lorsqu’un utilisateur choisit une API et sélectionne un contenu pour un bloc card API.

#### Scenario: Affichage des APIs enregistrées en PHP dans le sélecteur du builder

- **WHEN** l’utilisateur ouvre le sélecteur d’API (ex. modale pour choisir une card API) dans le builder
- **THEN** les APIs listées sont celles exposées par le registre Symfony (liste fournie par le backend) ; l’utilisateur peut en choisir une sans avoir appelé `CharismaPageBuilder.registerApi()` en JS

#### Scenario: Sélection d’un item depuis une API backend

- **WHEN** l’utilisateur sélectionne une API puis recherche ou parcourt les items (collection) et choisit un item
- **THEN** les appels de liste (collection) et de détail (item) sont effectués vers les endpoints Symfony ; le résultat mappé est utilisé pour remplir la card dans le builder
