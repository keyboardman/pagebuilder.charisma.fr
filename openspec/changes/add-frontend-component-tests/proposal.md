# Change: Tests unitaires des composants React du builder

## Why

Le builder (`assets/editeur/`) n'a aucun test automatisé frontend. Les régressions sur les composants récents (NodeEditorLabelField, RichText, etc.) ne sont détectées qu'au build ou manuellement.

## What Changes

- Ajout de Vitest + React Testing Library + jsdom
- Scripts npm `test:frontend` / `test:frontend:run`
- Helpers de test (`renderWithNodeBuilder`, fixtures de nœuds)
- Premiers tests : utils (`nodeLabel`), hooks (`useCanvasNavigation`), composants simples
- Documentation dans `openspec/project.md` et `docs/frontend-testing.md`
- Intégration de `npm run test:frontend:run` dans `composer test`

## Impact

- Affected specs: `page-builder`
- Affected code: `package.json`, `vitest.config.ts`, `assets/test/`, `assets/editeur/**/*.test.ts(x)`, `composer.json`, `docs/frontend-testing.md`
