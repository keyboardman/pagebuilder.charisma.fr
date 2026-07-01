## Context

Le page builder affiche les vidéos Charisma sous forme de card poster + modale de lecture. Aujourd’hui, les modales utilisent un élément `<video controls autoPlay>` natif dans :

- `NodeVideoApi/View.tsx` (`ModalPlayer`)
- `NodeVideoHome/View.tsx` (dialog de lecture)
- `NodeVideo/View.tsx` (`ModalPlayer`)

Le rendu statique prévoit un script Twig (`templates/page/_render_video_modal_script.html.twig`) qui crée aussi un `<video>` natif à partir d’attributs `data-video-src` / `data-video-poster`.

Sur le site de production [charisma.fr](https://www.charisma.fr/fr/), Video.js est utilisé avec un player customisé, un bouton favori (`PUT /api/media/{id}/favori`, **1 like/heure**) et un **compteur de vues** déclenché au play (`/api/media/{id}/compteur`). Les médias API Charisma exposent un identifiant stable (`itemId` côté builder, `id` dans les réponses `CharismaVideosApiCard` et l’API home).

## Goals / Non-Goals

**Goals:**

- Remplacer le lecteur natif par **Video.js** dans toutes les modales vidéo du builder (preview + rendu public).
- Fournir un **plugin Video.js réutilisable** ajoutant un bouton favori (cœur rouge) dans la control bar.
- Envoyer `PUT` vers `https://content.charisma.fr/api/media/{mediaId}/favori` au clic, avec `mediaId` issu du contenu nœud.
- Appliquer la limite **un like par heure** sur le favori (mémorisation `localStorage` + rejet API).
- Incrémenter le **compteur de lecture** via `/api/media/{mediaId}/compteur` au premier démarrage effectif de la lecture (événement `play` Video.js), une fois par instance de lecteur.
- Masquer le bouton favori et ne pas appeler les endpoints média si aucun identifiant Charisma n’est disponible.
- Partager la même logique entre React (modales builder) et le script de rendu statique Twig.

**Non-Goals:**

- Bouton favori sur les vidéos YouTube (`NodeYoutube`, entrées `youtube` de `NodeVideoHome`).
- Bouton favori sur `NodeVideo` sans identifiant média API (fichier médiathèque local seul).
- Reproduire l’intégralité des customisations Video.js du legacy charisma.fr (skins, plugins tiers) au-delà du bouton favori et des contrôles standards.
- Persistance locale de l’état « déjà liké dans l’heure » au-delà du cooldown minimal (le plugin gère le délai 1 h via `localStorage`).

## Decisions

### 1. Dépendance `video.js` via npm / Webpack Encore

Ajouter `video.js` (et ses types `@types/video.js` en dev) comme dépendance npm, importée depuis un module partagé `assets/editeur/components/video/`.

**Alternatives :**

| Approche | Avantage | Inconvénient |
|---|---|---|
| **npm + module partagé** (retenu) | Version figée, typings, bundling Encore | Taille bundle accrue |
| CDN script tag | Pas de build | Incohérence versions builder / rendu statique |
| Garder `<video>` natif | Léger | Pas de parité avec charisma.fr, pas d’emplacement control bar pour le favori |

### 2. Plugin Video.js `charismaFavoriButton`

Créer un plugin Video.js enregistré via `videojs.registerPlugin('charismaFavoriButton', …)` qui :

1. Ajoute un `ClickableComponent` dans la control bar (position `before` le fullscreen ou en fin de barre).
2. Affiche un glyphe cœur **rouge** (SVG inline ou classe CSS `color: #e00` / `#dc2626`).
3. Au clic : si le cooldown 1 h n’est pas expiré pour ce `mediaId`, ne pas appeler l’API et laisser le bouton désactivé.
4. Sinon : `fetch(FAVORI_URL.replace('{id}', mediaId), { method: 'PUT', credentials: 'include' })`.
5. En cas de succès : enregistrer le timestamp en `localStorage`, désactiver le bouton pour 1 h, retour visuel (cœur plein / opacité réduite).
6. En cas d’erreur (réseau ou HTTP 429) : désactiver le bouton et conserver l’état cooldown si l’API signale un like déjà effectué dans l’heure.

Options du player passées à l’initialisation :

```ts
{
  sources: [{ src, type: 'video/mp4' }],
  poster,
  autoplay: true,
  controls: true,
  charismaFavoriButton: { mediaId: '…' } // absent → plugin no-op
}
```

### 3. Plugin Video.js `charismaMediaCompteur`

Plugin léger (ou logique intégrée au composant player) qui :

1. Écoute l’événement Video.js `play` sur le player.
2. Si `mediaId` est absent → no-op.
3. Si le compteur n’a pas encore été envoyé pour cette instance → `fetch(COMPTEUR_URL.replace('{id}', mediaId), { method: 'POST', credentials: 'include' })` (méthode à confirmer si l’API legacy diffère).
4. Pose un flag `compteurSent = true` pour ne pas recompter les reprises après pause dans la même modale.

L’**autoplay** à l’ouverture de la modale déclenche aussi `play` → le compteur est bien incrémenté sans clic supplémentaire, comme sur charisma.fr.

### 4. Composant React `CharismaVideoPlayer`

Wrapper React monté dans les modales existantes :

- Props : `src`, `poster`, `mediaId?: string`, `onReady?`.
- Monte Video.js sur un `<video ref>` avec les plugins `charismaFavoriButton` et `charismaMediaCompteur` si `mediaId` est fourni.
- Cleanup `player.dispose()` au démontage.

### 5. Propagation de l’identifiant média

| Nœud | Source `mediaId` |
|---|---|
| `NodeVideoApi` | `content.itemId` |
| `NodeVideoHome` | `video.id` si `type === 'charisma'` |
| `NodeVideo` | _(aucun — pas de bouton)_ |

Le rendu statique SHALL exposer `data-media-id` sur les déclencheurs modale lorsque l’identifiant est connu, en plus de `data-video-src` et `data-video-poster`.

### 6. Rendu statique (Twig)

Deux options retenues en combinaison :

1. **Entry Encore** `videoPlayer` (JS + CSS Video.js) chargé sur les pages publiées qui incluent des vidéos Charisma.
2. Mise à jour de `_render_video_modal_script.html.twig` pour instancier Video.js + plugin au lieu de `document.createElement('video')`, en lisant `data-media-id`.

Cela évite de dupliquer la logique favori en vanilla pur.

### 7. URLs API média configurables

Constantes partagées :

```ts
export const CHARISMA_MEDIA_FAVORI_URL =
  'https://content.charisma.fr/api/media/{id}/favori';

export const CHARISMA_MEDIA_COMPTEUR_URL =
  'https://content.charisma.fr/api/media/{id}/compteur';

export const CHARISMA_FAVORI_COOLDOWN_MS = 60 * 60 * 1000; // 1 heure
```

Pas de proxy Symfony : l’appel est cross-origin comme sur charisma.fr ; `credentials: 'include'` si les cookies de session content.charisma.fr doivent accompagner la requête.

## Risks / Trade-offs

- **[CORS / cookies]** → Si les appels PUT/POST échouent hors domaine charisma.fr, vérifier les en-têtes CORS côté `content.charisma.fr` et l’usage de `credentials`. Mitigation : tests manuels sur page publiée et preview builder.
- **[Cooldown 1 h favori]** → Le délai est appliqué côté client (`localStorage`) et côté API. Mitigation : traiter 429 / erreur métier sans spam de requêtes.
- **[Compteur multiple]** → Pause/reprise ne doit pas renvoyer le compteur. Mitigation : flag `compteurSent` par instance player.
- **[Compteur silencieux]** → L’échec réseau du compteur ne doit pas bloquer la lecture. Mitigation : fire-and-forget, pas de feedback utilisateur.
- **[Taille bundle]** → Video.js ajoute ~200–300 Ko gzip. Mitigation : import ciblé, chargement lazy du module player uniquement à l’ouverture de modale si nécessaire.
- **[Double initialisation]** → Ouvrir/fermer la modale rapidement peut laisser des instances Video.js. Mitigation : `dispose()` systématique dans `useEffect` cleanup React et à la fermeture modale Twig.
- **[YouTube inchangé]** → `NodeVideoHome` conserve `<iframe>` pour `type === 'youtube'`.

## Migration Plan

1. Ajouter dépendance `video.js` et module plugin + composant React.
2. Migrer les trois vues React une par une ; vérifier preview builder.
3. Mettre à jour le rendu HTML statique (`data-media-id`) et le script Twig / entry Encore.
4. Tests manuels : play → compteur ; clic favori ; cooldown 1 h ; absence d’appels sur `NodeVideo` local.
5. Rollback : restaurer `<video>` natif et retirer l’entry Encore Video.js.

## Open Questions

- Faut-il un feedback utilisateur explicite (toast « Merci ») ou seulement le changement visuel du cœur, comme sur charisma.fr ?
- Le cooldown 1 h du favori est-il global ou par `mediaId` ? **Hypothèse retenue : par `mediaId`**.
- Quelle méthode HTTP pour `/compteur` (`POST`, `PUT` ou `GET`) ? **Hypothèse retenue : `POST`** — à confirmer avec l’API legacy.
