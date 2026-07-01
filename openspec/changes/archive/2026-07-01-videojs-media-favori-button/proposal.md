## Why

Sur [charisma.fr](https://www.charisma.fr/fr/), les vidéos sont lues via **Video.js** avec un lecteur personnalisé incluant un bouton « favori » (cœur rouge, `PUT /api/media/{id}/favori`, limite **1 like/heure**) et un **compteur de lecture** déclenché au play (`/api/media/{id}/compteur`). Le page builder utilise aujourd’hui un lecteur HTML5 natif dans les modales (`NodeVideoApi`, `NodeVideoHome`, `NodeVideo`), sans parité avec le site de production.

## What Changes

- Introduire **Video.js** comme lecteur vidéo partagé pour les modales de lecture des nœuds vidéo du builder (remplacement du `<video>` natif).
- Ajouter un **composant / plugin Video.js** « favori » : bouton en forme de **cœur rouge** dans la barre de contrôles du player.
- Au clic sur le bouton, envoyer une requête **`PUT`** vers `https://content.charisma.fr/api/media/{mediaId}/favori`, où `{mediaId}` est l’identifiant média Charisma (ex. `itemId` de `NodeVideoApi`, `id` des vidéos home de type Charisma).
- Respecter la règle métier **un like par heure** : désactiver le bouton après un like réussi et empêcher un nouvel envoi avant expiration du délai (gestion côté client + réponse API en cas de rejet).
- Au **démarrage de la lecture** (clic play ou autoplay à l’ouverture de la modale), envoyer une requête vers `https://content.charisma.fr/api/media/{mediaId}/compteur` — **une seule fois par ouverture** du lecteur.
- Ne pas afficher le bouton favori ni appeler les endpoints média lorsque l’identifiant média est absent (ex. `NodeVideo` avec fichier local uniquement).
- Aligner le rendu **statique** des pages publiées (script modale vidéo Twig / assets de rendu) sur le même lecteur Video.js et le même bouton favori lorsqu’un `data-media-id` est disponible.
- Conserver le comportement existant : ouverture en modale au clic sur le poster, lecture auto, fermeture, pastille play sur les cards.

## Capabilities

### New Capabilities

_(aucune)_

### Modified Capabilities

- `page-builder` : exiger Video.js comme lecteur des modales vidéo, le bouton favori (PUT, limite 1/h) et le compteur de lecture (`/compteur` au play) pour les médias Charisma identifiés.

## Impact

- **Frontend** : `NodeVideoApi/View.tsx`, `NodeVideoHome/View.tsx`, `NodeVideo/View.tsx`, nouveau module partagé Video.js (player + plugins favori et compteur), `package.json` (dépendance `video.js`).
- **Rendu public** : `templates/page/_render_video_modal_script.html.twig` (ou entry Encore dédiée) pour charger Video.js et initialiser favori + compteur.
- **API externe** : `content.charisma.fr` — `PUT /api/media/{id}/favori` (limite 1 like/heure) et `/api/media/{id}/compteur` au play (pas de changement backend Symfony du page builder).
- **Hors scope** : vidéos YouTube (`NodeYoutube`, entrées home de type `youtube`) — pas de bouton favori Charisma.
