## ADDED Requirements

### Requirement: Dépréciation des nœuds NodeListApi et NodeListImage dans la palette

Après la migration des contenus, le registre des nœuds du builder SHALL cesser d’exposer **NodeListApi** (`node-list-api`) et **NodeListImage** (`node-list-image`) dans le panneau des composants. Les nouvelles insertions de ces types SHALL être impossibles via l’UI. Le nœud **NodeCollection** (`node-collection`) demeure le moyen supporté pour les listes article et image.

#### Scenario: Palette sans Liste Articles / Liste Image

- **WHEN** l’utilisateur ouvre le panneau des composants catégorie API
- **THEN** les boutons « Liste Articles » (`node-list-api`) et « Liste Image » (`node-list-image`) sont absents ; le bouton « Collection » reste disponible

#### Scenario: Chargement d’une page migrée

- **WHEN** une page dont les nœuds list ont été convertis en `node-collection` est chargée dans le builder
- **THEN** les nœuds s’affichent via le view NodeCollection sans erreur de type inconnu

## MODIFIED Requirements

### Requirement: Liste d'items pilotée par API (NodeListApi)

Le nœud **NodeListApi** (`node-list-api`) est **déprécié** au profit de **NodeCollection** (`node-collection` avec `collectionType=article`, `display=list`). Le builder SHALL ne plus proposer ce type dans le panneau des composants. Les pages existantes SHALL être migrées automatiquement vers `node-collection` (voir capacité `node-list-to-collection-migration`). Tant que le code module reste présent pour d’autres dépendances éventuelles, il SHALL ne plus être enregistré comme composant ajoutable.

#### Scenario: Insertion legacy impossible

- **WHEN** l’utilisateur cherche à ajouter un bloc « Liste Articles » depuis la palette
- **THEN** l’option n’est plus disponible ; il utilise NodeCollection (article)

#### Scenario: Contenu historique migré

- **WHEN** une page contenait un `node-list-api` avant migration
- **THEN** le nœud correspondant est un `node-collection` article après migration et reste éditable
