# Design: Initialisation de la base de données

## Context

- Symfony avec `doctrine/doctrine-bundle`, `doctrine/doctrine-migrations-bundle`, `doctrine/orm`.
- PostgreSQL 16 via Docker (`compose.yaml`), `DATABASE_URL` dans `.env`.
- `doctrine.yaml` : `dbname_suffix: '_test%env(default::TEST_TOKEN)%'` en `when@test`.
- Dossier `migrations/` vide ; pas d’entités dans `src/Entity/` pour l’instant.

## Goals / Non-Goals

- **Goals** : avoir un flux clair pour créer la base, exécuter les migrations, et faire tourner les tests avec une base dédiée ; supporter un schéma vide au départ.
- **Non-Goals** : outil de seed/fixtures, migration de données existantes, support de MySQL/SQLite dans ce change.

## Decisions

- **Migration initiale vide** : une migration Doctrine vide (ou ne faisant que `SELECT 1`) évite l’erreur “No migrations to execute” et initialise la table `doctrine_migration_versions`. Alternative : ne pas en créer et accepter que la première migration “réelle” remplisse ce rôle ; on choisit une migration minimale pour figer le processus dès maintenant.
- **Commandes cibles** : `doctrine:database:create` (création de la base), `doctrine:migrations:migrate --no-interaction` (application). En CI/test : idem avec `APP_ENV=test` et `DATABASE_URL`/suffix cohérents.
- **Pas de `doctrine:schema:create`** : on s’appuie uniquement sur les migrations pour le schéma (aligné avec Doctrine Migrations).

## Risks / Trade-offs

- **PostgreSQL requis** : le flux suppose PostgreSQL. Mitigation : `DATABASE_URL` et `compose.yaml` sont déjà en PostgreSQL ; documenter la dépendance.
- **Migration vide inutile plus tard** : une fois des entités et des migrations réelles en place, la migration vide reste sans impact. Si besoin, on pourra l’archiver dans un dossier `migrations/legacy` ou la marquer comme exécutée sans la supprimer.

## Migration Plan

1. Ajouter la migration initiale dans `migrations/`.
2. Mettre à jour la doc (project.md ou équivalent) avec la séquence : `compose up -d`, `doctrine:database:create`, `doctrine:migrations:migrate`.
3. Pour les tests : s’assurer que `.env.test` (ou `DATABASE_URL` en test) et `dbname_suffix` permettent une base `_test` distincte ; exécuter `doctrine:database:create` et `doctrine:migrations:migrate` avant les tests si la CI le requiert.

## Open Questions

- Aucune pour ce change minimal.
