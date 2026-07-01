## 1. Dépendances et module partagé Video.js

- [x] 1.1 Ajouter `video.js` (et `@types/video.js` en dev) dans `package.json`
- [x] 1.2 Créer `assets/editeur/components/video/constants.ts` avec les URLs API (`/favori`, `/compteur`) et `CHARISMA_FAVORI_COOLDOWN_MS` (1 h)
- [x] 1.3 Implémenter le plugin Video.js `charismaFavoriButton` (bouton cœur rouge + `PUT` favori + cooldown 1 h via `localStorage`)
- [x] 1.4 Implémenter le plugin Video.js `charismaMediaCompteur` (appel `/compteur` au premier `play`, une fois par instance)
- [x] 1.5 Créer le composant React `CharismaVideoPlayer` (init Video.js, plugins favori + compteur, options `mediaId`, cleanup `dispose`)

## 2. Modales builder (React)

- [x] 2.1 Remplacer `<video>` par `CharismaVideoPlayer` dans `NodeVideoApi/View.tsx` (`ModalPlayer`, passer `content.itemId`)
- [x] 2.2 Remplacer `<video>` par `CharismaVideoPlayer` dans `NodeVideoHome/View.tsx` pour `type === 'charisma'` (passer `video.id`)
- [x] 2.3 Remplacer `<video>` par `CharismaVideoPlayer` dans `NodeVideo/View.tsx` sans `mediaId` (pas de bouton favori)
- [x] 2.4 Vérifier que les modales YouTube de `NodeVideoHome` restent en `<iframe>`

## 3. Rendu statique public

- [x] 3.1 Ajouter une entry Encore `videoPlayer` (JS + CSS Video.js) ou réutiliser un bundle existant du rendu public
- [x] 3.2 Émettre `data-media-id` sur les déclencheurs modale dans le HTML statique des nœuds vidéo API / home Charisma
- [x] 3.3 Mettre à jour `templates/page/_render_video_modal_script.html.twig` pour initialiser Video.js + plugins favori et compteur (lecture de `data-media-id`)
- [x] 3.4 Inclure le bundle Video.js et le script modale dans le template de rendu page publique

## 4. Styles et tests

- [x] 4.1 Ajouter les styles du bouton cœur rouge (control bar Video.js, état hover/disabled)
- [x] 4.2 Ajouter des tests unitaires sur les plugins favori et compteur (URLs, cooldown 1 h, un seul appel compteur par instance)
- [x] 4.3 Test manuel : play → compteur ; clic favori ; bouton désactivé après like ; pas de second `PUT` dans l’heure ; pas de double compteur après pause/reprise
