# Change: Restructurer les controllers API du page builder

## Why
Le `PageBuilderApiController` concentre aujourd'hui plusieurs responsabilites (catalogue de formulaires, cards API, polices), ce qui rend la maintenance et la lecture plus difficiles. La separation par domaine API clarifie la navigation du code et facilite les evolutions futures.

## What Changes
- Reorganiser les endpoints `/page-builder/api/*` dans un repertoire `src/Controller/Api/` dedie, avec des controllers separes par domaine fonctionnel.
- Preserver les routes, formats de reponse JSON et statuts HTTP existants pour eviter toute regression cote frontend.
- Centraliser les traitements utilitaires partages (ex. mapping item card, parsing des filtres) dans des services/reutilisables explicites plutot que dans un controller monolithique.

## Impact
- Affected specs: `builder-api-registry`
- Affected code: `src/Controller/PageBuilderApiController.php`, nouveau namespace `src/Controller/Api/`, services associes aux endpoints builder API
