## ADDED Requirements
### Requirement: Interfaces builder compatibles endpoints API Platform

Le builder SHALL pouvoir consommer les donnees card API depuis des operations API Platform, tout en restant compatible avec les endpoints legacy `/page-builder/api/*` pendant la migration. La couche d'acces HTTP frontend SHALL encapsuler cette compatibilite pour les noeuds et composants qui recuperent des APIs, collections ou items.

#### Scenario: Selection d'API dans le builder apres migration
- **WHEN** l'utilisateur ouvre un selecteur d'API dans le builder
- **THEN** la liste des APIs est chargee via la couche HTTP compatible API Platform, sans casser les ecrans existants

#### Scenario: Chargement d'items pour un noeud consommateur
- **WHEN** un noeud builder consommateur d'API demande une collection ou un item
- **THEN** la couche HTTP utilise l'operation API Platform ou son endpoint de compatibilite et retourne un format uniforme au noeud

### Requirement: Adaptation explicite des interfaces critiques

Les interfaces critiques du builder (notamment NodeCard, NodeNavApi et tout noeud consommant des endpoints builder API) SHALL etre adaptees et validees contre la nouvelle couche API Platform-compatible avant suppression d'un endpoint legacy.

#### Scenario: Validation fonctionnelle NodeCard
- **WHEN** l'utilisateur configure un bloc card base sur une API puis selectionne un item
- **THEN** la recherche, la pagination et la selection d'item fonctionnent avec la couche API Platform-compatible

#### Scenario: Validation fonctionnelle NodeNavApi
- **WHEN** l'utilisateur configure un NodeNavApi relie a une API de type `list`
- **THEN** le menu affiche correctement les liens mappes (`title`, `link`) via la couche API Platform-compatible
