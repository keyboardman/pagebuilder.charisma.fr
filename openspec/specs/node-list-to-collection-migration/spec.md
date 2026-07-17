# node-list-to-collection-migration Specification

## Purpose

Migration automatique des nœuds builder legacy `node-list-api` et `node-list-image` vers `node-collection` dans le JSON `page.content`.

## Requirements

### Requirement: Migration automatique des nœuds list legacy vers NodeCollection

Le système SHALL fournir une migration Doctrine qui parcourt chaque enregistrement `page` et transforme, dans la colonne JSON `content` (map de nœuds), tout nœud de type `node-list-api` ou `node-list-image` en nœud `node-collection` selon le mapping documenté (design). La migration SHALL être idempotente : les nœuds déjà `node-collection` ne sont pas retraités. Les champs `id`, `parent`, `attributes`, `editorLabel` et `hidden` SHALL être préservés.

#### Scenario: Conversion node-list-api

- **WHEN** une page contient un nœud `{ "type": "node-list-api", "content": { "listMode": "fixed", "apiId": "flashnews_article_home", ... } }`
- **THEN** après migration ce nœud a `type: "node-collection"`, `content.collectionType: "article"`, `content.mode: "fixed"`, `content.apiId` inchangé, `content.display: "list"`, `content.view: "article"`, et `content.dynamicItems` (s’il existait) est déplacé vers `content.dynamicArticleItems`

#### Scenario: Conversion node-list-image

- **WHEN** une page contient un nœud `{ "type": "node-list-image", "content": { "listMode": "dynamic", "dynamicItems": [...], ... } }`
- **THEN** après migration ce nœud a `type: "node-collection"`, `content.collectionType: "image"`, `content.mode: "dynamic"`, `content.display: "list"`, `content.view: "default"`, et `content.dynamicItems` est déplacé vers `content.dynamicImageItems`

#### Scenario: Idempotence

- **WHEN** la migration est exécutée une seconde fois sur les mêmes pages
- **THEN** aucun nœud n’est modifié une nouvelle fois ; le résultat reste valide

#### Scenario: Pages sans nœuds list

- **WHEN** une page ne contient aucun nœud `node-list-api` ni `node-list-image`
- **THEN** son `content` reste inchangé
