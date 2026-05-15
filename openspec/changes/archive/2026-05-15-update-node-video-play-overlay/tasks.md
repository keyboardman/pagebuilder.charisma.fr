## 1. Implémentation

- [x] 1.1 Ajouter `VideoPlayOverlayIcon` (img `play2.svg`, props optionnelles pour l’aperçu thème).
- [x] 1.2 Remplacer la pastille dans `NodeVideo`, `NodeVideoApi`, `NodeVideoHome` et `Preview`.
- [x] 1.3 Mettre à jour `node-video.css` (`.ce-video-icon-player-img`, mobile).
- [x] 1.4 Mettre à jour `play2.svg` (disque gris + triangle contrasté).
- [x] 1.5 Adapter `NodeMediaForm` (sélecteur thème icône → `width` sur `.ce-video-icon-player-img`).
- [x] 1.6 Aligner `templates/theme/showcase.html.twig` sur le même markup.

## 2. Validation

- [x] 2.1 Vérifier visuellement une vidéo avec poster (éditeur + front) : pastille play2 visible, hover acceptable.
- [x] 2.2 Contrôler l’aperçu thème « Node média » pour `node-video` (surcharges inner / largeur img).
- [x] 2.3 `openspec validate update-node-video-play-overlay --strict`.
