# Change: Renforcer la gestion des dossiers dans la médiathèque

## Why
La médiathèque doit garantir explicitement les opérations de gestion des dossiers attendues par les utilisateurs, en particulier la création de sous-dossiers et le renommage de dossiers existants.

## What Changes
- Modifie la capacité `media-filemanager` pour expliciter la création de sous-dossiers depuis l’interface `/filemanager`.
- Modifie la capacité `media-filemanager` pour expliciter le renommage des dossiers existants dans la médiathèque.
- Ajoute des scénarios d’acceptation dédiés pour ces deux comportements.

## Impact
- Affected specs: `media-filemanager`
- Affected code: intégration UI du `keyboardman/filemanager-bundle` et routes API `/api/filesystem/*` utilisées pour les opérations sur dossiers
