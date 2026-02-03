<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

## Stockage médias et file manager

- **Stockage** : les fichiers médias (images, vidéo, audio) sont stockés via Flysystem dans `public/media` (service `MediaStorage`, `media_storage.filesystem`), distinct de `storage/fonts`. Les fichiers sont servis directement par le serveur web (URL `/media/{path}`), sans passer par PHP.
- **Médiathèque** : file manager custom avec shadcn/ui (React) : liste, upload, création de dossiers, suppression. Page `/media` ; API `/media/api/list`, `/media/api/upload`, `/media/api/mkdir`, `/media/api/delete` ; accès direct aux fichiers via `/media/{path}`.
- **Menu** : le lien « Médias » dans la sidebar (`templates/base.html.twig`) mène à `/media`.