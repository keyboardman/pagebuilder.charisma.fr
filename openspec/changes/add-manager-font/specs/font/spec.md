## ADDED Requirements

### Requirement: API builder pour lister et résoudre les polices

Le système SHALL exposer des endpoints HTTP dédiés au builder pour consommer le catalogue `Font` sans charger toutes les entités au démarrage. L’endpoint de liste SHALL supporter la pagination (`page`, `limit`), la recherche textuelle (`search` sur le nom) et un filtre optionnel par type (`native`, `google`, `custom`). L’endpoint de détail SHALL retourner pour une police donnée un payload compatible avec `registerFont` : `id`, `name`, `fontFamily` (nom + fallback), `href` (URL stylesheet Google, URL fichier custom, ou identifiant builtin pour native), et `type`. Un endpoint de résolution SHALL permettre de retrouver une police à partir d’une valeur CSS `fontFamily` (nom primaire de la famille).

#### Scenario: Liste paginée avec recherche

- **WHEN** le builder appelle `GET /api/builder/fonts?search=roboto&page=1&limit=20`
- **THEN** la réponse contient au plus 20 polices dont le nom correspond à la recherche, avec `total` pour la pagination ; chaque item inclut `id`, `name`, `type` et les champs nécessaires au chargement

#### Scenario: Détail d’une police custom

- **WHEN** le builder appelle `GET /api/builder/fonts/{id}` pour une Font custom ayant au moins une variante
- **THEN** la réponse inclut `href` pointant vers le fichier servi (`app_font_file`) et `fontFamily` au format `"{name}, {fallback}"`

#### Scenario: Résolution par fontFamily

- **WHEN** le scanner de nodes du builder appelle l’endpoint de résolution avec `fontFamily=Ma Police, sans-serif`
- **THEN** si une Font avec le nom `Ma Police` existe, la réponse retourne son `id` et le payload de chargement ; sinon une réponse vide ou 404 indique qu’aucune police catalogue n’est associée
