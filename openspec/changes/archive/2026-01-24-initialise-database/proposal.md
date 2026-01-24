# Change: Initialiser la base de données

## Why

Le projet utilise Doctrine (DBAL, ORM, Migrations) et PostgreSQL via Docker, mais la base n’est pas initialisée : `migrations/` est vide et aucune procédure documentée n’existe pour créer le schéma et exécuter les migrations. Il faut définir un flux reproductible (dev, test, CI) pour créer la base et appliquer les migrations.

## What Changes

- Nouvelle capacité **database-init** : procédure et commandes pour créer la base (si nécessaire), exécuter les migrations et vérifier la connectivité.
- Documentation dans `openspec/specs/database-init/spec.md` des exigences (connexion, migrations, env test, schéma vide initial).
- Tâches pour : vérifier `DATABASE_URL`, ajouter une migration vide initiale (ou squelettes), documenter `bin/console doctrine:database:create` et `doctrine:migrations:migrate`, et l’env test (`dbname_suffix`).

## Impact

- Affected specs: **database-init** (nouvelle capacité)
- Affected code: `migrations/`, `config/packages/doctrine*.yaml`, `.env` / `.env.test`, `composer.json` (scripts optionnels), `openspec/project.md` ou README (procédure de démarrage)
