# Change: Ajouter le nœud NodeVideoHome dans le builder

## Why
Le builder doit permettre d'afficher une section vidéo "home" pilotée par une source distante existante. Cette capacité n'est pas disponible aujourd'hui et nécessite un nouveau nœud dédié.

## What Changes
- Ajout d'un nouveau nœud `NodeVideoHome` dans la capability `page-builder`.
- Récupération de la liste des vidéos depuis l'endpoint `https://api.charisma.fr/api/charisma/videos/homes`.
- Rendu responsive imposé pour exactement 7 vidéos:
  - desktop: grille 3 colonnes sur 2 lignes puis la 7e vidéo sur une 3e ligne occupant toute la largeur
  - tablette: grille 2 colonnes sur 3 lignes puis la 7e vidéo sur une 4e ligne occupant toute la largeur
  - mobile: grille 1 colonne sur 7 lignes
- Chaque vidéo est affichée au format card vidéo, identique au rendu utilisé par les vidéos API (`video api`).
- La 7e carte conserve un traitement visuel spécifique (span pleine largeur) en desktop et tablette.

## Impact
- Affected specs: `page-builder`
- Affected code:
  - `assets/editeur/ManagerNode/*` (définition, rendu, settings du nœud)
  - rendu front du builder (grille responsive et mapping des vidéos)
