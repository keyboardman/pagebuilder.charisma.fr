## 1. Modèle et settings

- [x] 1.1 Étendre `NodeRootType` et `NodeRoot.default` dans `index.ts` avec le type `NodeRootBackground` et la valeur par défaut `{ type: 'default' }`.
- [x] 1.2 Refactoriser `Settings.tsx` : `NodeSettingsWrapper` + onglets **Général**, **Arrière-plan**, **Typographie** (migration du code typographie existant sans régression).
- [x] 1.3 Implémenter l’onglet **Arrière-plan** : sélecteur de type, champs couleur, réutilisation/adaptation de `Background2Settings` pour l’image (URL, position, size, repeat), picker médiathèque vidéo (`FileManagerIframePicker` `type="video"`), champs `objectFit` / `objectPosition` / poster optionnel pour la vidéo.

## 2. Rendu

- [x] 2.1 Mettre à jour `Content.tsx` (ou composant `PageBackground`) pour appliquer couleur, image CSS ou `<video>` selon `content.background`.
- [x] 2.2 Ajuster la colonne interne : ne pas masquer le fond personnalisé (retrait conditionnel de `bg-background` fixe).
- [x] 2.3 Vérifier le rendu identique en modes **EDIT** (iframe), **PREVIEW** et **VIEW** (page publiée / `pagePreview`).

## 3. Validation

- [x] 3.1 Page sans `background` : comportement visuel inchangé.
- [x] 3.2 Couleur seule, image avec position `cover`/`center`, vidéo muette en boucle : persistance après sauvegarde et rechargement.
- [x] 3.3 En mode édition : la vidéo de fond n’intercepte pas les clics sur le canevas (`pointer-events: none`).
- [x] 3.4 Typographie et titre de page : réglages existants toujours fonctionnels.
