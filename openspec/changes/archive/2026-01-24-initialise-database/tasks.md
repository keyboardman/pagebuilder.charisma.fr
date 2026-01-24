# Tasks: initialise-database

## 1. Migrations et schéma

- [x] 1.1 Générer une migration Doctrine vide (ou minimale type `SELECT 1`) dans `migrations/` et vérifier qu’elle s’exécute avec `doctrine:migrations:migrate --no-interaction`.

## 2. Documentation et procédure

- [x] 2.1 Documenter dans `openspec/project.md` (ou README) la procédure d’initialisation : démarrage PostgreSQL (ex. `docker compose up -d` ou équivalent), `php bin/console doctrine:database:create`, `php bin/console doctrine:migrations:migrate --no-interaction`.
- [x] 2.2 Préciser la nécessité de `DATABASE_URL` (et `.env`/`.env.local`) et, pour les tests, le comportement de `dbname_suffix` (`_test`).

## 3. Validation

- [x] 3.1 Vérifier en dev : `doctrine:database:create` puis `doctrine:migrations:migrate` aboutissent sans erreur.
- [x] 3.2 Vérifier en `APP_ENV=test` (avec une base `*_test*`) que les mêmes commandes fonctionnent (ou adapter si la CI utilise un autre mécanisme).

**Note (3.1–3.2)** : à exécuter manuellement lorsque PHP 8.4 et PostgreSQL (`docker compose up -d`) sont disponibles.
