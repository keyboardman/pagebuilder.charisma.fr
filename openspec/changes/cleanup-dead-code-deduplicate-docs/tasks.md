## 0. Prérequis

- [x] 0.1 Vérifier que `update-builder-edit-inline-text-on-selection` et `update-nodegrid-edit-canvas-ux` sont mergés ou que les `Edit.tsx` restants sont explicitement listés comme exclus du retrait.
- [x] 0.2 Lancer `npm run build` et `composer test` sur la branche de base ; noter l’état vert.

## 1. Audit et outillage

- [x] 1.1 Ajouter `knip` (config `knip.json` ou section `package.json`) ciblant `assets/` et les entrypoints Encore (`app`, `ThemeForm2`, `pageBuilderStandalone`, `pagePreview`).
- [x] 1.2 Ajouter le script npm `audit:dead-code` exécutant knip (+ `depcheck` optionnel sur `package.json`).
- [x] 1.3 Ajouter PHPStan (`phpstan.neon`) niveau bas sur `src/` ; script composer `analyse` ou documenter la commande.
- [x] 1.4 Produire l’inventaire documenté (fichiers JS/TS, deps npm, classes PHP, templates Twig) et le valider en équipe avant suppressions.

## 2. Suppression code mort frontend

- [x] 2.1 Retirer la propriété `edit` de `NodeConfigurationType` et toutes les entrées `edit:` des `index.ts` de nœuds.
- [x] 2.2 Supprimer les 16 fichiers `Edit.tsx` et le dossier `NodeCard/Edits/` (après validation édition inline / settings).
- [x] 2.3 Supprimer `assets/fileManager.jsx`, `assets/components/FileManager.tsx`, `templates/media/index.html.twig` (et route/controller associés s’ils existent encore).
- [x] 2.4 Retirer les dépendances npm inutilisées : `draft-js`, `draftjs-to-html`, `html-to-draftjs`, `react-contenteditable`, types `@types/draft-*`, `@types/react-draft-wysiwyg`, meta-paquets `@shadcn/ui` / `radix-ui` si confirmés morts.
- [x] 2.5 Retirer `assets/controllers/hello_controller.js`, `assets/react/controllers/Hello.jsx` et leurs enregistrements si non référencés.
- [x] 2.6 Vérifier `npm run build` et absence d’erreurs TypeScript.

## 3. Suppression code mort backend

- [x] 3.1 Supprimer `src/Service/MediaStorage.php` et `src/Service/S3ClientFactory.php` si PHPStan/grep confirment zéro usage.
- [x] 3.2 Retirer le bloc `media_storage.*` de `config/services.yaml` et mettre à jour `DisableProfilerOnMediaUploadListener` (retirer `/media/api/upload` legacy).
- [x] 3.3 Exécuter `composer test` et smoke `/filemanager` + upload filesystem API.

## 4. Déduplication

- [x] 4.1 Extraire les vues/helpers communs NodeCard / NodeCardApi vers `ManagerNode/shared/card/` (ou équivalent).
- [x] 4.2 Factoriser `IconStyleSettings` et `ContainerStyleSettings` entre NodeIcone et NodeTextIcon.
- [ ] 4.3 (Optionnel) Remplacer `shortid` par `nanoid` dans DropZone/DnD si inventaire confirme l’absence d’impact sur les IDs persistés.

## 5. Documentation

- [x] 5.1 Compléter `openspec/project.md` : purpose, stack (Symfony 8, React, Encore, PostgreSQL), architecture builder, tests.
- [x] 5.2 Réécrire `README.md` : vue d’ensemble, prérequis, `docker compose`, `npm run watch`, `composer test`, liens vers `docs/`.
- [x] 5.3 Corriger `AGENTS.md` (route `/media`, file manager keyboardman) et commentaires obsolètes dans `config/services.yaml`.
- [x] 5.4 Archiver ou réécrire `docs/FILEMANAGER_KEYBOARDMAN.md` pour refléter l’état actuel (keyboardman installé, iframe builder).

## 6. Validation finale

- [x] 6.1 `npm run audit:dead-code` sans findings bloquants (ou liste d’exceptions documentée).
- [x] 6.2 `npm run build` + `composer test` verts.
- [ ] 6.3 Smoke manuel : builder standalone, preview, ThemeForm2, sélection Explorer, édition inline texte/bouton, NodeRichText Lexical, pickers file manager iframe.
- [ ] 6.4 Mettre à jour les tâches cochées et archiver le change OpenSpec après merge.
