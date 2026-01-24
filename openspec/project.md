# Project Context

## Purpose
[Describe your project's purpose and goals]

## Tech Stack
- [List your primary technologies]
- [e.g., TypeScript, React, Node.js]

## Project Conventions

### Code Style
[Describe your code style preferences, formatting rules, and naming conventions]

### Architecture Patterns
[Document your architectural decisions and patterns]

### Testing Strategy
[Explain your testing approach and requirements]

### Git Workflow
[Describe your branching strategy and commit conventions]

## Domain Context
[Add domain-specific knowledge that AI assistants need to understand]

## Initialisation de la base de données

PostgreSQL est utilisé via Docker. Pour initialiser la base :

1. **Démarrer PostgreSQL** : `docker compose up -d` (ou `docker compose up -d database`).
2. **Créer la base** : `php bin/console doctrine:database:create`.
3. **Appliquer les migrations** : `php bin/console doctrine:migrations:migrate --no-interaction`.

La variable **`DATABASE_URL`** doit être définie dans `.env` ou `.env.local` (format Doctrine, ex. `postgresql://user:pass@host:5432/dbname?serverVersion=16&charset=utf8`). Elle doit correspondre au service `database` de `compose.yaml`.

**Environnement de test** : avec `APP_ENV=test`, Doctrine utilise une base dédiée grâce à `dbname_suffix: '_test%env(default::TEST_TOKEN)%'` (`config/packages/doctrine.yaml`, section `when@test`). Le nom de la base devient `{dbname}_test` (ou `_test{token}` si `TEST_TOKEN` est défini, ex. ParaTest). Pour préparer la base des tests : exécuter `doctrine:database:create` et `doctrine:migrations:migrate --no-interaction` avec `APP_ENV=test` (et `DATABASE_URL` / `.env.test` cohérents) avant de lancer PHPUnit ou la CI.

## Important Constraints
[List any technical, business, or regulatory constraints]

## External Dependencies
[Document key external services, APIs, or systems]
