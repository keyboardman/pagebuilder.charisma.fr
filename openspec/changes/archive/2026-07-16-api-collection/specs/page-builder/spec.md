## ADDED Requirements

### Requirement: Endpoints page-builder collections

Le backend page-builder SHALL exposer les endpoints ApiCollection sous le préfixe API existant (ex. `/api/page-builder/collections`, `/api/page-builder/collections/{apiId}/items`, `/api/page-builder/collections/resolve`) de façon consommable par le builder (authentification / exposition alignées sur les endpoints cards et lists actuels).

#### Scenario: Catalogue accessible au builder

- **WHEN** le frontend builder demande le catalogue collections avec les credentials habituels page-builder
- **THEN** il reçoit la liste JSON des APIs actives filtrables par type et mode

#### Scenario: Resolve accessible au rendu

- **WHEN** la preview ou le rendu public résout des items dynamic via collections/resolve
- **THEN** la requête cible la base API page-builder absolue déjà injectée pour les cards/lists

### Requirement: Navigation admin APIs collection

L’interface d’administration du page-builder SHALL inclure un accès à la gestion des APIs collection (lien de menu vers le CRUD `/admin/api-collection`).

#### Scenario: Accès depuis le menu

- **WHEN** un utilisateur authentifié ouvre l’admin
- **THEN** il peut naviguer vers la gestion des APIs collection depuis le menu latéral
