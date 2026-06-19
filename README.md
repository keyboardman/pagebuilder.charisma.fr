# Page Builder Charisma

Application Symfony 8 + React pour créer et éditer des pages web via un **page builder** visuel (grille, flex, cards API, formulaires, thèmes DaisyUI).

## Prérequis

- PHP 8.4+, Composer
- Node.js 20.19+ (recommandé pour knip / outils récents)
- Docker (PostgreSQL)

## Démarrage rapide

```bash
# Base de données
docker compose up -d
symfony console doctrine:database:create
symfony console doctrine:migrations:migrate --no-interaction

# Frontend
npm install
npm run watch   # ou npm run build

# Serveur
symfony serve
# ou npm run start  # symfony + webpack en parallèle
```

## Entrypoints Webpack (Encore)

| Entry | Rôle |
|-------|------|
| `app` | Back-office Symfony (Stimulus, UX React) |
| `ThemeForm2` | Éditeur de thème |
| `pageBuilderStandalone` | Builder de page |
| `pagePreview` | Prévisualisation standalone |

## Tests et qualité

```bash
composer test              # PHPUnit (base test + migrations)
composer analyse           # PHPStan (niveau 3, src/)
npm run audit:dead-code    # knip + depcheck sur assets/
npm run build              # Compilation production Encore
```

## Documentation

- [OpenSpec / conventions](openspec/AGENTS.md)
- [Contexte projet](openspec/project.md)
- [API cards du builder](docs/builder-api.md)
- [Soumissions de formulaires](docs/builder-form-submissions.md)
- [File manager keyboardman](docs/FILEMANAGER_KEYBOARDMAN.md)

## Base de données PostgreSQL (manuel)

Voir aussi `openspec/project.md` pour l’initialisation via Docker.

```bash
psql -U postgres
CREATE USER {DB_USER} WITH PASSWORD '{DB_PASSWORD}';
CREATE DATABASE {DB_NAME} OWNER {DB_USER};
```

Variables : `DATABASE_URL` dans `.env` / `.env.local` (format Doctrine, service `database` de `compose.yaml`).
