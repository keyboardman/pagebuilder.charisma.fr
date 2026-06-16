# Change: Extraction automatique de l'ID YouTube depuis une URL complète

## Why

Le nœud `NodeYoutube` ne stocke qu'un identifiant vidéo (`content.videoId`). Aujourd'hui, le champ des réglages attend cet ID brut (ex. `dQw4w9WgXcQ`) alors que les éditeurs copient naturellement l'URL complète depuis YouTube (`https://www.youtube.com/watch?v=…`, `https://youtu.be/…`, etc.). Ils doivent extraire manuellement l'ID, ce qui ralentit la saisie et génère des erreurs.

## What Changes

- Ajouter une fonction utilitaire d'extraction d'ID YouTube à partir des formats d'URL courants.
- Normaliser la saisie dans `NodeYoutube/Settings.tsx` : coller ou saisir une URL complète enregistre uniquement l'ID extrait dans `content.videoId`.
- Conserver le comportement actuel lorsque l'utilisateur saisit déjà un ID brut valide.
- Mettre à jour le libellé d'aide du champ pour indiquer que l'URL complète ou l'ID sont acceptés.

## Impact

- Affected specs: `page-builder`
- Affected code:
  - `assets/editeur/ManagerNode/NodeYoutube/Settings.tsx`
  - Nouvel utilitaire partagé (ex. `assets/editeur/utils/youtubeVideoId.ts`)
