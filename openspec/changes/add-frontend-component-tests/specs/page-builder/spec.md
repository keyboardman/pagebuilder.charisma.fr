## ADDED Requirements

### Requirement: Tests unitaires frontend du builder

Le projet SHALL fournir une infrastructure de tests unitaires pour le code React/TypeScript sous `assets/editeur/`, exécutable via `npm run test:frontend:run`, indépendamment du build Webpack Encore.

#### Scenario: Exécution locale

- **WHEN** un développeur lance `npm run test:frontend:run`
- **THEN** Vitest exécute les fichiers `assets/**/*.{test,spec}.{ts,tsx}` et retourne un code de sortie 0 si tous les tests passent

#### Scenario: Couverture minimale des utilitaires

- **WHEN** les tests frontend sont exécutés
- **THEN** les fonctions de libellé de nœuds (`getNodeDisplayLabel`, `getNodeTypeLabel`) sont couvertes par au moins un test par cas nominal

### Requirement: Documentation des tests frontend

La documentation du dépôt SHALL décrire comment écrire et lancer un test de composant React (utilitaires, hooks, composants avec contexte mocké).

#### Scenario: Guide contributeur

- **WHEN** un développeur consulte `docs/frontend-testing.md` ou la section Testing de `openspec/project.md`
- **THEN** il trouve les commandes npm, la convention de nommage des fichiers de test et un exemple avec `NodeBuilderContext`
