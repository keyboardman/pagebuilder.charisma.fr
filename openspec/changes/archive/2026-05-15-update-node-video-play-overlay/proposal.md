# Change : icône lecteur vidéo (play2.svg + pastille)

## Why

L’indicateur « lecture » sur les vidéos utilisait un masque CSS sur un `div.ce-icon`, ce qui ne reproduisait pas correctement un SVG composite (cercle + triangle). Le fichier `play2.svg` fournit une pastille lisible ; il doit être affiché tel quel pour un rendu fidèle, avec un disque de fond cohérent (gris).

## What Changes

- Rendu de la pastille play via `<img>` pointant vers `/assets/icons/play2.svg` (composant partagé `VideoPlayOverlayIcon`).
- Harmonisation des nœuds `NodeVideo`, `NodeVideoApi`, `NodeVideoHome`, de l’aperçu thème (`Preview`) et du showcase Twig.
- Styles `node-video.css` : cible `.ce-video-icon-player-img`, conteneur interne transparent par défaut (le disque vient du SVG).
- Formulaire thème Node média : la personnalisation « couleur » sur `.ce-icon` est remplacée par la largeur sur `.ce-video-icon-player-img` (l’ancienne surcharge `background-color` sur le masque ne s’applique plus au bitmap).
- **BREAKING** (mineur) : les surcharges de thème existantes sur `.ce-video .ce-icon` ne s’appliquent plus ; migrer vers `.ce-video .ce-video-icon-player-img` (ex. `width`) ou `.ce-video .ce-video-icon-player-inner` si besoin.

## Impact

- Specs : `page-builder` (nouvelle exigence sur l’indicateur de lecture).
- Code : `VideoPlayOverlayIcon.tsx`, vues vidéo, `node-video.css`, `play2.svg`, `NodeMediaForm.tsx`, `Preview.tsx`, `showcase.html.twig`.
