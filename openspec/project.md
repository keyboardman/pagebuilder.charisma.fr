# Project Context

## Purpose

**Page Builder Charisma** : CMS interne pour composer des pages (layout, contenu riche, cards API Charisma, formulaires) avec un thème DaisyUI personnalisable et un rendu public Symfony/Twig.

## Tech Stack

- **Backend** : Symfony 8, Doctrine ORM, PostgreSQL, API Platform (`/api/page-builder/*`)
- **Frontend** : React 18, TypeScript, Webpack Encore, Tailwind CSS 4, Lexical (rich text)
- **Médias** : keyboardman/filesystem-bundle + filemanager-bundle (Flysystem local `public/media`, S3 optionnel)
- **Tests** : PHPUnit 12 ; PHPStan niveau 3 sur `src/` ; Vitest + React Testing Library pour `assets/editeur/`

## Project Conventions

### Code Style

- TypeScript strict ; composants builder sous `assets/editeur/`
- Nœuds : un dossier `ManagerNode/Node*` avec `View.tsx` (canevas WYSIWYG), `Settings.tsx`, `index.ts`
- Pas de couche `Edit.tsx` séparée : le canevas monte uniquement `view`

### Architecture Patterns

- **Builder** : `pageBuilderStandalone` → `PageBuilderEmbed` → registre `NodeRegistry`
- **Sélection** : Explorer (`ManagerExplorer`) + canevas ; menu de bloc visible à la sélection
- **API cards** : `App\PageBuilder\ApiCard\*` tagués `app.builder_api_card`, exposés via API Platform
- **Thème** : `ThemeCssGenerator` produit le CSS ; variables injectées dans le builder et la preview

### Testing Strategy

```bash
composer test              # DB test + migrations + PHPUnit + tests frontend
composer analyse           # PHPStan
npm run test:frontend      # Vitest (mode watch)
npm run test:frontend:run  # Vitest (CI, une passe)
npm run build              # Encore production
npm run audit:dead-code    # knip + depcheck (assets/)
```

**Frontend** : placer les tests à côté du code (`*.test.ts(x)` sous `assets/`). Voir `docs/frontend-testing.md` pour les helpers (`createTestNode`, `renderWithNodeBuilder`) et les conventions (utils → hooks → composants avec contexte).

Les exports des `ManagerNode/*/index.ts` sont chargés dynamiquement via `NodeRegistry` : knip peut les signaler comme non utilisés ; les ignorer sauf après vérification grep.

### Git Workflow

Branches feature ; changes OpenSpec dans `openspec/changes/` avant implémentations significatives.

## Domain Context

- **Nœuds** : conteneurs (Flex, Grid, Nav), contenu (Text, Button, RichText, Card, CardApi), custom Charisma (Vidéos home, PureMusic, Anniversaires)
- **File manager** : iframe + `postMessage` (`keyboardman.filemanager.picked`) ; URL via `/filemanager/resolve-url`
- **Polices** : catalogue `ManagerFont` + `FontUsageRegistry` pour Google Fonts hors thème

## Initialisation de la base de données

PostgreSQL est utilisé via Docker. Pour initialiser la base :

1. **Démarrer PostgreSQL** : `docker compose up -d` (ou `docker compose up -d database`).
2. **Créer la base** : `symfony console doctrine:database:create`.
3. **Appliquer les migrations** : `symfony console doctrine:migrations:migrate --no-interaction`.

La variable **`DATABASE_URL`** doit être définie dans `.env` ou `.env.local` (format Doctrine, ex. `postgresql://user:pass@host:5432/dbname?serverVersion=16&charset=utf8`). Elle doit correspondre au service `database` de `compose.yaml`.

**Environnement de test** : avec `APP_ENV=test`, Doctrine utilise une base dédiée grâce à `dbname_suffix: '_test%env(default::TEST_TOKEN)%'` (`config/packages/doctrine.yaml`, section `when@test`). Le nom de la base devient `{dbname}_test` (ou `_test{token}` si `TEST_TOKEN` est défini, ex. ParaTest). Pour préparer la base des tests : exécuter `symfony console doctrine:database:create` et `symfony console doctrine:migrations:migrate --no-interaction` avec `APP_ENV=test` (et `DATABASE_URL` / `.env.test` cohérents) avant de lancer PHPUnit ou la CI.

## Important Constraints

- PHP 8.4 minimum (Symfony 8)
- Le builder ne doit pas charger de code mort : maintenir `npm run audit:dead-code` après changements majeurs dans `assets/`

## External Dependencies

- **keyboardman/filemanager-bundle** : UI médiathèque `/filemanager`
- **keyboardman/filesystem-bundle** : API `/api/filesystem/*`
- APIs Charisma (cards builder) : configurées dans `services.yaml` via tags `app.builder_api_card`
