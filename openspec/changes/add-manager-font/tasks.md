## 1. Backend — API polices builder

- [x] 1.1 Factoriser `ThemeFontBuilderService` pour exposer `buildFontPayload(Font $font): ?array` réutilisable
- [x] 1.2 Créer `PageBuilderFontController` avec `GET /api/builder/fonts` (search, page, limit, type filter) et `GET /api/builder/fonts/{id}`
- [x] 1.3 Ajouter endpoint `GET /api/builder/fonts/resolve?family=...` pour résoudre une `fontFamily` CSS vers une entité Font
- [x] 1.4 Créer `PageFontResolverService` pour extraire et résoudre les polices d'un contenu JSON de page (preview/rendu)
- [x] 1.5 Injecter les polices résolues dans `render_view.html.twig` et la preview standalone

## 2. Frontend — Registre d'usage et typography

- [x] 2.1 Créer `assets/editeur/ManagerFont/FontUsageRegistry.ts` (compteurs, sync, subscribe)
- [x] 2.2 Créer `assets/editeur/ManagerFont/scanNodeFonts.ts` (extraction récursive des `fontFamily` dans les nodes)
- [x] 2.3 Ajouter `unregisterFont` dans `typography.ts` et distinguer polices builtin/thème/page
- [x] 2.4 Brancher la sync du registre dans `BuilderProvider` à chaque changement de `nodes`

## 3. Frontend — ManagerFont UI

- [x] 3.1 Créer `ManagerFontModal.tsx` (recherche, pagination, sélection) sur le modèle de `ApiManagerModal`
- [x] 3.2 Créer `backendFontAdapter.ts` pour les appels API
- [x] 3.3 Adapter `FontFamilySelect` : options page + bouton « Ajouter une police… » ouvrant ManagerFontModal
- [x] 3.4 Passer `fontsApiBaseUrl` dans `builder.html.twig` et `pageBuilderStandalone.jsx`

## 4. Validation

- [x] 4.1 Test manuel : sélectionner une police Google hors thème → visible dans le sélecteur et rendue dans l'iframe
- [x] 4.2 Test manuel : retirer la police de tous les nodes → police absente du sélecteur et non rechargée
- [x] 4.3 Test manuel : page existante avec `fontFamily` custom → police résolue et chargée au boot
- [x] 4.4 Test manuel : preview/rendu public affiche correctement les polices hors thème
