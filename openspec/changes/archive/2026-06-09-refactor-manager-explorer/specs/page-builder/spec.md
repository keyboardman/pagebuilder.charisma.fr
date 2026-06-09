## ADDED Requirements

### Requirement: Organisation du module ManagerExplorer

Le code source du **navigateur de composants** (Explorer) SHALL être regroupé sous `assets/editeur/ManagerExplorer/`, sur le modèle du module `ManagerNode`. Ce dossier SHALL contenir au minimum le composant principal `Explorer`, les composants UI spécifiques au navigateur (ex. zones de dépôt dans l’arbre) et les utilitaires dédiés à la construction de l’arbre et à la synchronisation avec le canevas (`explorerTree`, `scrollCanvasToNode`). Les utilitaires partagés avec d’autres domaines du builder (ex. libellés de nœuds via `nodeLabel`) MAY rester dans `assets/editeur/utils/`.

Le point d’entrée public du module SHALL être exposé via `ManagerExplorer/index.ts` pour les consommateurs (ex. `Builder.tsx`).

#### Scenario: Localisation du code Explorer

- **WHEN** un développeur cherche l’implémentation du navigateur de composants
- **THEN** les fichiers UI et utilitaires propres à l’Explorer se trouvent sous `assets/editeur/ManagerExplorer/` et non sous `app/layout/` ni dans `utils/` (hors dépendances partagées)

#### Scenario: Import depuis le builder

- **WHEN** le builder intègre le navigateur dans la sidebar gauche
- **THEN** il importe le composant `Explorer` depuis `ManagerExplorer` (point d’entrée public du module)
