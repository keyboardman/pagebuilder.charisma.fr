# Design: Champ render et API de contenu

## Context

L'entité Page dispose déjà de `content` (JSON des nœuds du builder). Le rendu final (HTML complet avec head, body, CSS et JS inline ou référencés) doit être stocké séparément pour être servi tel quel (ex. API, iframe, cache) sans régénération côté serveur.

## Goals / Non-Goals

- **Goals** : Champ `render` sur Page ; API GET retournant ce contenu en `text/html` ; possibilité de mettre à jour `render` (côté backend) lorsque le client envoie un export complet.
- **Non-Goals** : Génération serveur du HTML à partir de `content` (hors scope de ce change) ; authentification spécifique de l’API (reste alignée avec les conventions du projet).

## Decisions

- **Champ `render`** : Type `text` (Doctrine) / LONGTEXT en base, nullable. Contient un document HTML complet (DOCTYPE, `<html>`, `<head>`, `<body>`, scripts).
- **Remplissage** : Le champ est renseigné lorsque le client (builder ou outil d’export) envoie le HTML complet au backend (ex. endpoint PATCH/PUT existant ou dédié). Pas de génération automatique côté serveur dans ce change.
- **API de lecture** : Une route GET (ex. `app_page_render` ou `app_page_api_render`) prenant l’identifiant de la page (id ou slug). Réponse : corps = contenu de `render`, `Content-Type: text/html`. Si `render` est null ou vide, réponse 404.

## Risks / Trade-offs

- Taille en base : documents HTML complets peuvent être lourds → LONGTEXT suffit ; pas de limite stricte dans ce change.
- Double source de vérité (content vs render) : le rendu peut être désynchronisé ; accepté car l’usage est « export / affichage figé ».

## Migration Plan

- Migration Doctrine : ajout de la colonne `render` (nullable, type text) sur la table `page`. Pas de rétro-remplissage des pages existantes (render reste null jusqu’à un premier export).

## Open Questions

- Aucun pour ce change minimal.
