# Change: Refactor builder API vers API Platform

## Why
Les endpoints backend du page builder reposent actuellement sur des controllers Symfony custom qui complexifient l'evolution des contrats HTTP et l'integration avec les outils API-first. Nous devons rendre l'API compatible API Platform tout en conservant les integrations existantes des interfaces du builder.

## What Changes
- Introduire des ressources API Platform pour exposer les donnees du registre builder API (liste d'APIs, collections, item detail, ressources utilitaires).
- Definir une couche de compatibilite pour conserver les routes publiques attendues par les interfaces (`/page-builder/api/*`) et permettre une migration progressive.
- Standardiser les parametres de requete (pagination, recherche, tri, categorie) et les payloads de reponse entre les endpoints historiques et les operations API Platform.
- Documenter les adaptations requises cote interfaces builder (NodeCard, NodeNavApi, NodeYoutube et futurs noeuds consommateurs d'API).

## Impact
- Affected specs: `builder-api-registry`, `page-builder`
- Affected code: `src/Controller/Api/`, `src/PageBuilder/Api/`, configuration API Platform, consommateurs frontend des endpoints builder API
