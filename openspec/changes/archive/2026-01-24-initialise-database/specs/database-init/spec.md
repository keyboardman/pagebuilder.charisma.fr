# database-init – Delta

## ADDED Requirements

### Requirement: Connexion et création de la base

Le projet SHALL utiliser `DATABASE_URL` pour la connexion Doctrine. La commande `php bin/console doctrine:database:create` SHALL créer la base de données PostgreSQL si elle n’existe pas. La variable SHALL être définie dans `.env` (ou `.env.local`) et cohérente avec le service `database` du `compose.yaml`.

#### Scenario: Création de la base en dev

- **WHEN** PostgreSQL est démarré (ex. `docker compose up -d`), `DATABASE_URL` est configuré et `php bin/console doctrine:database:create` est exécuté en `APP_ENV=dev`
- **THEN** la base cible existe et la commande se termine sans erreur (ou avec un message indiquant qu’elle existait déjà)

### Requirement: Exécution des migrations

Le projet SHALL disposer d’au moins une migration dans `migrations/` (namespace `DoctrineMigrations`). La commande `php bin/console doctrine:migrations:migrate --no-interaction` SHALL appliquer les migrations en attente et SHALL initialiser la table `doctrine_migration_versions` si nécessaire.

#### Scenario: Application des migrations en dev

- **WHEN** la base existe, des migrations sont présentes dans `migrations/` et `php bin/console doctrine:migrations:migrate --no-interaction` est exécuté
- **THEN** les migrations sont exécutées sans erreur et leur statut est enregistré dans `doctrine_migration_versions`

### Requirement: Environnement de test

En `APP_ENV=test`, Doctrine SHALL utiliser une base dédiée via `dbname_suffix: '_test%env(default::TEST_TOKEN)%'` (config `when@test` dans `doctrine.yaml`). La procédure d’initialisation (création de la base et migrations) SHALL pouvoir être exécutée avec `APP_ENV=test` afin de préparer la base pour les tests (ex. PHPUnit, CI).

#### Scenario: Migrations en environnement test

- **WHEN** `APP_ENV=test` est défini, `DATABASE_URL` (ou le suffix) pointe vers une base de test et `doctrine:database:create` puis `doctrine:migrations:migrate --no-interaction` sont exécutés
- **THEN** la base de test existe, les migrations sont appliquées et les tests peuvent s’exécuter sans échec de connexion ou de schéma manquant

### Requirement: Procédure documentée

La procédure d’initialisation de la base (démarrage de PostgreSQL, `doctrine:database:create`, `doctrine:migrations:migrate`) et la dépendance à `DATABASE_URL` SHALL être documentée dans `openspec/project.md` ou un README à la racine du projet.

#### Scenario: Démarrage depuis zéro

- **WHEN** un développeur suit la procédure documentée (PostgreSQL démarré, `DATABASE_URL` défini, `doctrine:database:create`, `doctrine:migrations:migrate`)
- **THEN** la base est créée, les migrations sont à jour et l’application peut fonctionner avec Doctrine sans erreur de schéma ou de connexion
