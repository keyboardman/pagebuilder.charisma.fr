# Documentation index for Cursor @Docs

Add each URL below in **Cursor Settings > Features > Docs > Add new doc**.
Once indexed, reference them in chat with `@Docs`.

## Symfony 8.0

| Name | URL |
|------|-----|
| Symfony 8.0 | https://symfony.com/doc/8.0/index.html |
| Symfony UX React | https://symfony.com/bundles/ux-react/current/index.html |
| Symfony Stimulus | https://symfony.com/bundles/StimulusBundle/current/index.html |
| Frontend (Webpack Encore) | https://symfony.com/doc/current/frontend.html |

## API Platform 4.3

| Name | URL |
|------|-----|
| API Platform (index) | https://api-platform.com/docs/llms.txt |
| API Platform (full) | https://api-platform.com/docs/llms-full.txt |

Prefer `llms-full.txt` for comprehensive context; use `llms.txt` for lighter indexing.

## Doctrine ORM 3

| Name | URL |
|------|-----|
| Doctrine ORM | https://www.doctrine-project.org/projects/doctrine-orm/en/latest/ |
| Doctrine Migrations | https://www.doctrine-project.org/projects/doctrine-migrations/en/latest/ |

## React 18

| Name | URL |
|------|-----|
| React | https://react.dev/ |

## Lexical 0.42

| Name | URL |
|------|-----|
| Lexical | https://lexical.dev/docs/intro |

## Radix UI

| Name | URL |
|------|-----|
| Radix Primitives | https://www.radix-ui.com/primitives/docs/overview/introduction |

## Flysystem 3

| Name | URL |
|------|-----|
| Flysystem | https://flysystem.thephpleague.com/docs/ |
| Flysystem AWS S3 adapter | https://flysystem.thephpleague.com/docs/adapter/aws-s3-v3/ |

## Tailwind CSS 4

| Name | URL |
|------|-----|
| Tailwind CSS | https://tailwindcss.com/docs |

## CodeMirror 6

| Name | URL |
|------|-----|
| CodeMirror | https://codemirror.net/docs/ |
| uiw/react-codemirror | https://uiwjs.github.io/react-codemirror/ |

## Keyboardman

| Name | URL |
|------|-----|
| FilemanagerBundle (GitHub) | https://github.com/keyboardman/FilemanagerBundle |

Voir aussi la doc projet : `docs/FILEMANAGER_KEYBOARDMAN.md` et `AGENTS.md` (section stockage médias).

## Documentation projet (locale)

Ces fichiers ne passent pas par `@Docs` — les référencer avec `@` ou les ouvrir directement :

| Sujet | Fichier |
|-------|---------|
| Conventions agent | `AGENTS.md` |
| File manager Keyboardman | `docs/FILEMANAGER_KEYBOARDMAN.md` |
| API du builder | `docs/builder-api.md` |
| Ajout d'une API card | `docs/ajout-api-card.md` |
| Soumissions de formulaires | `docs/builder-form-submissions.md` |
| Tests frontend | `docs/frontend-testing.md` |
| Style / UI | `docs/STYLE.md` |

## Onboarding checklist

1. Index all URLs above in **Cursor Settings > Docs**
2. Lire `AGENTS.md` à la racine du projet pour les conventions agent

## Note

`@Docs` sources are currently global in Cursor (not scoped per project). This manifest ensures the team indexes the same references for this stack.
