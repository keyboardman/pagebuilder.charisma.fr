# Change: Ajouter le nœud NodePureMusicTopSemaine dans le builder

## Why
Le builder doit permettre d'afficher le classement hebdomadaire PureMusic directement dans une page éditée, en se basant sur la source officielle distante. Cette capacité n'est pas disponible aujourd'hui et nécessite un nœud custom dédié.

## What Changes
- Ajout d'un nouveau nœud `NodePureMusicTopSemaine` dans la capability `page-builder`, visible dans la catégorie `custom`.
- Récupération des données depuis l'endpoint `https://api.charisma.fr/api/puremusic/musiques/tops/semaine`.
- Rendu de la section "top semaine" reproduisant le format de référence `https://api.charisma.fr/puremusic/tops/semaine`.
- Support d'un état de repli non bloquant en cas d'indisponibilité de l'endpoint.
- Persistance de la structure de contenu du nœud dans le JSON du builder.

## Impact
- Affected specs: `page-builder`
- Affected code:
  - `assets/editeur/ManagerNode/*` (registration, settings, view du nœud)
  - styles du thème du builder pour le rendu "top semaine"
