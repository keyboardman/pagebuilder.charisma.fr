# api-collection-seed Specification

## Purpose

Seed SQL des sources ApiList / ApiCard historiques vers `api_collection_definition`, avec préservation des `api_id`, labels suffixés Collection, mapping fidèle, exclusions hors runtime et retrait des adapters PHP redondants.

## Requirements

### Requirement: Seed SQL des sources ApiList et ApiCard

Le système SHALL fournir une migration Doctrine qui insère dans `api_collection_definition` les sources production ApiList* / ApiCard exprimables en configuration HTTP + mapping DotPath, avec les `api_id` historiques préservés.

#### Scenario: Migration appliquée sur base vide

- **WHEN** la migration de seed est exécutée sur une table `api_collection_definition` vide
- **THEN** toutes les définitions du set seedé (articles Charisma/Flashnews fixed et dynamic, thèmes Flashnews, ApiCard flashnews / témoignage / evenement / auteur, et `videos`) sont présentes avec `enabled=true`

#### Scenario: Migration idempotente

- **WHEN** la migration de seed est ré-exécutée alors qu’une ligne avec le même `api_id` existe déjà
- **THEN** la ligne existante n’est pas écrasée et aucune erreur fatale n’est levée

### Requirement: Préservation des identifiants builder

Le seed SHALL utiliser les `api_id` déjà exposés par les classes PHP (y compris les suffixes `_home` pour les listes fixed), sans renommer ni fusionner des ids distincts.

#### Scenario: Id fixed home conservé

- **WHEN** la définition correspondant à `CharismaArticleEnactionHomeApiListArticle` est seedée
- **THEN** son `api_id` est `charisma_article_enaction_home` et `supported_modes` contient `fixed`

#### Scenario: Id dynamic distinct conservé

- **WHEN** la définition correspondant à `CharismaArticleEnactionApiListArticleDynamique` est seedée
- **THEN** son `api_id` est `charisma_article_enaction` et `supported_modes` contient `dynamic`

### Requirement: Libellé suffixé Collection

Chaque définition seedée SHALL avoir un `label` égal au libellé historique de la source PHP suivi du suffixe ` — Collection`, afin de distinguer les entrées ApiCollection des sources legacy ApiList / ApiCard.

#### Scenario: Label En Action home

- **WHEN** la définition `charisma_article_enaction_home` est seedée
- **THEN** son `label` est `En Action (home) — Collection`

#### Scenario: Label visible catalogue

- **WHEN** le builder charge le catalogue des collections
- **THEN** le libellé affiché pour une API seedée se termine par ` — Collection`

### Requirement: Mapping et endpoint fidèles

Chaque définition seedée SHALL reproduire l’endpoint, les query params fixes, le style de pagination, le `member_path`, le `field_mapping` et le cas échéant `item_url_template` / `image_prefix` de la classe PHP source, dans les limites du runtime `ConfigurableApiCollection`.

#### Scenario: Flashnews home

- **WHEN** la définition `flashnews_article_home` est chargée
- **THEN** `endpoint_url` pointe vers l’API articles Flashnews, `query_params` inclut `order[publication]=desc`, `pagination_style` est `hydra`, et le mapping inclut `title←titre`, `description←viewResume`, `counter←compteur`, `like←likes`

#### Scenario: Dynamic Charisma avec item template

- **WHEN** la définition `charisma_article_enaction` est chargée
- **THEN** `item_url_template` vaut `{endpoint}/{id}` (ou équivalent documenté) et `supported_modes` inclut `dynamic`

#### Scenario: Videos Hydra JSON-LD

- **WHEN** la définition `videos` est chargée
- **THEN** `endpoint_url` pointe vers `media.jsonld`, `member_path` vaut `hydra:member`, `supported_modes` contient `fixed` et `dynamic`, et les filtres de picking mappent `search`→`title` et `category`→`viewCategorie`

### Requirement: Exclusions hors runtime

Les sources dont le comportement PHP n’est pas reproductible par `ConfigurableApiCollection` (pagination custom bannières, stubs) SHALL NOT être seedées et SHALL rester exposées via adapters PHP.

#### Scenario: Bannières non seedées

- **WHEN** la migration de seed est appliquée
- **THEN** `charisma_evenement_home` et `charisma_evenement_retrospective` sont absents de `api_collection_definition` et restent disponibles via adapters PHP

#### Scenario: Videos seedées

- **WHEN** la migration de seed videos est appliquée
- **THEN** l’api `videos` est présente dans `api_collection_definition` avec type `video` et n’est plus enregistrée via tag DI ApiCard

### Requirement: Retrait des adapters PHP redondants

Après application du seed, les services PHP dont l’`api_id` est couvert par une définition enabled SHALL être désenregistrés du registre (retrait des tags DI) afin qu’il n’y ait pas de collision d’identifiant entre adapter et définition.

#### Scenario: Catalogue sans doublon

- **WHEN** le seed est migré et les tags des classes seedées sont retirés
- **THEN** `GET /api/page-builder/collections` liste chaque `api_id` seedé une seule fois

#### Scenario: Adapters restants

- **WHEN** les tags des classes seedées (y compris `videos`) sont retirés
- **THEN** les adapters pour bannières restent enregistrés
