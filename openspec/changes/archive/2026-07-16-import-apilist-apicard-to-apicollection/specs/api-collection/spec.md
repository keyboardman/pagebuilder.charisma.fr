## ADDED Requirements

### Requirement: Définitions seedées dans le catalogue

Le catalogue ApiCollection SHALL traiter les définitions `api_collection_definition` seedées (enabled) au même titre que les définitions créées manuellement : elles SHALL apparaître dans `GET /api/page-builder/collections` et servir `fetchItems` / `fetchItem` via le runtime configurable, sans exiger d’adapter PHP pour ces `api_id`.

#### Scenario: Source seedée visible sans adapter

- **WHEN** une définition seedée `flashnews_article_home` est enabled et qu’aucun adapter PHP ne porte cet id
- **THEN** elle apparaît dans le catalogue filtré `type=article&mode=fixed` et expose des items via `/collections/flashnews_article_home/items`

#### Scenario: Priorité anti-doublon

- **WHEN** un `api_id` est à la fois présent en définition enabled et en adapter PHP
- **THEN** le système MUST empêcher ce doublon (validation admin / ids réservés / désenregistrement adapter) plutôt que d’exposer deux entrées

## MODIFIED Requirements

### Requirement: Adapters de compatibilité

Le registre ApiCollection SHALL inclure des **adapters** exposant les sources PHP encore non migrées en définition seedée (notamment ApiListImage bannières à pagination custom, ApiCard video, et tout ApiList/ApiCard hors set seed v1) sous le contrat ApiCollection. Les sources déjà seedées en base SHALL NOT nécessiter d’adapter PHP actif pour le même `api_id`.

#### Scenario: Liste image legacy visible

- **WHEN** une ApiListImage bannière existante (ex. `charisma_evenement_home`) est encore enregistrée via adapter
- **THEN** elle apparaît dans `GET /collections?type=image&mode=fixed` avec le même `id`

#### Scenario: Source seedée sans adapter

- **WHEN** une ApiListArticle historique a été importée en `api_collection_definition` et son tag DI retiré
- **THEN** elle reste visible dans le catalogue via la définition DB uniquement
