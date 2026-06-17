## ADDED Requirements
### Requirement: Endpoints builder API compatibles API Platform

Le systeme SHALL exposer les endpoints du domaine builder API via des operations API Platform documentees et consommables par les interfaces du builder. Les operations SHALL couvrir au minimum:
- la liste des APIs card disponibles,
- la collection d'une API donnee avec pagination et filtres,
- le detail d'un item mappe.

Les operations API Platform SHALL reutiliser la logique metier existante du registre ApiCard et du mapping d'items afin d'eviter toute divergence fonctionnelle.

#### Scenario: Recuperation de la liste des APIs via API Platform
- **WHEN** une interface builder appelle l'operation API Platform de listing des APIs card
- **THEN** la reponse JSON contient les metadonnees attendues (`id`, `label`, `type`, `category`) pour chaque API enregistree

#### Scenario: Recuperation d'une collection via API Platform
- **WHEN** une interface builder appelle l'operation API Platform de collection avec `page`, `limit`, `search`, `sort` ou `category`
- **THEN** le backend retourne un payload JSON compatible avec le contrat builder (`items`, `total`) en s'appuyant sur l'implementation ApiCard correspondante

#### Scenario: Recuperation d'un item via API Platform
- **WHEN** une interface builder appelle l'operation API Platform de detail avec un `apiId` et un `itemId` valides
- **THEN** le backend retourne l'item mappe au format standardise du registre builder API

### Requirement: Compatibilite descendante des routes publiques builder API

La migration vers API Platform SHALL conserver les routes publiques existantes du builder sous `/page-builder/api/*` pendant la phase de transition. Ces routes SHALL deleguer vers la meme logique applicative que les operations API Platform afin de garantir la parite de comportement (parametres supportes, payload JSON, statuts HTTP, gestion des erreurs).

#### Scenario: Appel legacy pendant la transition
- **WHEN** une interface existante appelle un endpoint historique `/page-builder/api/*`
- **THEN** la reponse obtenue reste compatible avec le contrat actuel, sans rupture fonctionnelle visible cote frontend

#### Scenario: Parite entre route legacy et operation API Platform
- **WHEN** la meme requete metier est executee via route legacy puis via operation API Platform equivalente
- **THEN** les deux reponses presentent les memes donnees metier et des statuts HTTP cohérents
